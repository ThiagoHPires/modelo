
//IMPORTAÇÕES E CONFIGURAÇÃO INICIAL

require('dotenv').config(); // ESSENCIAL: Carrega o .env ANTES de qualquer outro código
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


//  INICIALIZAÇÃO DO EXPRESS E MIDDLEWARES

const app = express();
app.use(cors());
app.use(express.json());


//  CONFIGURAÇÃO E CONEXÃO COM O BANCO DE DADOS

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};
let db;

async function conectarAoBanco() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ [BACKEND] Conectado ao banco de dados MySQL com sucesso!');
  } catch (error) {
    console.error('❌ [BACKEND] Erro fatal ao conectar ao banco de dados:', error.message);
    process.exit(1);
  }
}


//  CONFIGURAÇÃO DO SERVIÇO DE EMAIL

let transportador;
async function configurarEmail() {
  try {
    // Usando Gmail como exemplo. Certifique-se que o .env tem EMAIL_USER e EMAIL_PASS
    transportador = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('📬 [EMAIL] Transportador de email (Gmail) configurado.');
  } catch (error) {
     console.error('❌ [EMAIL] Erro ao configurar o transportador de email:', error);
  }
}


//  DEFINIÇÃO DAS ROTAS DA API


// Rota de Teste (para verificar se o servidor está no ar)
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: '🎉 API do backend está funcionando!' });
});

// Rota de Cadastro
app.post('/api/cadastrar', async (req, res) => {
  const { nome, email, senha, papel, cpf, endereco, telefone } = req.body;
  if (!nome || !email || !senha || !papel) {
    return res.status(400).json({ sucesso: false, mensagem: "Campos obrigatórios faltando." });
  }
  try {
    const hash = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuarios_konect (nome, email, senha_hash, papel, cpf, endereco, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await db.query(sql, [nome, email, hash, papel, cpf, endereco, telefone]);
    res.status(201).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("❌ [ERRO /api/cadastrar]:", error);
    res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar usuário." });
  }
});

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const sql = "SELECT * FROM usuarios_konect WHERE email = ?";
        const [results] = await db.query(sql, [email]);
        if (results.length === 0) {
            return res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas." });
        }
        const usuario = results[0];
        const senhaCorresponde = await bcrypt.compare(senha, usuario.senha_hash);
        if (senhaCorresponde) {
            const { senha_hash, ...dadosDoUsuario } = usuario;
            res.status(200).json({ sucesso: true, usuario: dadosDoUsuario });
        } else {
            res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas." });
        }
    } catch (error) {
        console.error("❌ [ERRO /api/login]:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
    }
});


// Rota para solicitar recuperação de senha
app.post('/api/esqueci-senha', async (req, res) => {
    const { email } = req.body;
    try {
        const [usuarios] = await db.query("SELECT id, nome, email FROM usuarios_konect WHERE email = ?", [email]);
        if (usuarios.length > 0) {
            const usuario = usuarios[0];
            const token = crypto.randomBytes(20).toString('hex');
            const expiraEm = new Date(Date.now() + 3600000); // Expira em 1 hora
            
            await db.query("UPDATE usuarios_konect SET token_redefinicao = ?, token_expira_em = ? WHERE id = ?", [token, expiraEm, usuario.id]);
            
            const linkRedefinicao = `http://localhost:8080/redefinir-senha/${token}`;
            
            await transportador.sendMail({
                from: `"ALPHA KONECT" <${process.env.EMAIL_USER}>`,
                to: usuario.email,
                subject: "Redefinição de Senha",
                html: `<p>Olá, ${usuario.nome}. Clique no link para redefinir sua senha: <a href="${linkRedefinicao}">${linkRedefinicao}</a></p>`,
            });
             console.log(`✅ Email de redefinição enviado para ${email}.`);
        }
        // Sempre retorne sucesso para não revelar quais emails existem no sistema
        res.status(200).json({ sucesso: true, mensagem: "Se um usuário com este email existir, um link de redefinição será enviado." });
    } catch (error) {
        console.error("❌ [ERRO /api/esqueci-senha]:", error);
        // Não envie o erro detalhado para o frontend por segurança
        res.status(500).json({ sucesso: false, mensagem: "Erro ao processar a solicitação." });
    }
});

// Rota para redefinir a senha com o token
app.post('/api/redefinir-senha-com-token', async (req, res) => {
    const { token, novaSenha } = req.body;
    try {
        const sql = "SELECT * FROM usuarios_konect WHERE token_redefinicao = ? AND token_expira_em > NOW()";
        const [usuarios] = await db.query(sql, [token]);
        if (usuarios.length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Token inválido ou expirado." });
        }
        const usuario = usuarios[0];
        const hash = await bcrypt.hash(novaSenha, 10);
        const updateSql = "UPDATE usuarios_konect SET senha_hash = ?, token_redefinicao = NULL, token_expira_em = NULL WHERE id = ?";
        await db.query(updateSql, [hash, usuario.id]);
        res.status(200).json({ sucesso: true, mensagem: "Senha redefinida com sucesso!" });
    } catch (error) {
        console.error("❌ [ERRO /api/redefinir-senha-com-token]:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao redefinir a senha." });
    }
});



// 6. INICIALIZAÇÃO DO SERVIDOr
const PORTA = 3001;

async function iniciarServidor() {
  await conectarAoBanco();
  await configurarEmail();
  app.listen(PORTA, () => {
    console.log(`🚀 [BACKEND] Servidor pronto e ouvindo na porta ${PORTA}`);
  });
}

iniciarServidor();