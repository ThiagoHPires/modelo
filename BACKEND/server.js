// 1. IMPORTAÇÕES - Todas as bibliotecas necessárias
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 2. INICIALIZAÇÃO DO APP - A variável 'app' é criada aqui!
const app = express();

// 3. MIDDLEWARES - Agora podemos usar o 'app'
app.use(cors());
app.use(express.json());

// 4. CONFIGURAÇÃO DO BANCO
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '150922', // <<--- CONFIRME SUAS CREDENCIAIS
  database: 'personalizada'  // <<--- CONFIRME SUAS CREDENCIAIS
};

let db;
async function conectarAoBanco() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ [BACKEND] Conectado ao banco de dados MySQL com sucesso!');
  } catch (error) {
    console.error('❌ [BACKEND] Erro fatal ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

// 5. CONFIGURAÇÃO DO EMAIL
let transportador;
async function criarTransportadorEmail() {
  let testAccount = await nodemailer.createTestAccount();

  console.log('📬 [EMAIL TESTE] Use estas credenciais em um serviço como o Ethereal:');
  console.log('   Usuário:', testAccount.user);
  console.log('   Senha:', testAccount.pass);

  transportador = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// 6. ROTAS DA API - Todas as rotas vêm depois da criação do 'app'

// ROTA DE CADASTRO
app.post('/api/cadastrar', async (req, res) => {
  // (O código desta rota permanece o mesmo da etapa anterior)
  console.log('\n--- [BACKEND] Nova requisição em /api/cadastrar ---');
  const { nome, email, senha, papel, cpf, endereco, telefone } = req.body;
  if (!nome || !email || !senha || !papel) { return res.status(400).json({ sucesso: false, mensagem: "Campos obrigatórios faltando." }); }
  try {
    const hash = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuarios_konect (nome, email, senha_hash, papel, cpf, endereco, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [nome, email, hash, papel, cpf, endereco, telefone]);
    console.log('✅ Usuário inserido com sucesso! ID:', result.insertId);
    res.status(201).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("❌ [BACKEND] ERRO DURANTE O CADASTRO:", error);
    res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar usuário." });
  }
});

// ROTA DE LOGIN
app.post('/api/login', async (req, res) => {
  // (O código desta rota permanece o mesmo da etapa anterior)
   console.log('\n--- [BACKEND] Nova requisição em /api/login ---');
   const { email, senha } = req.body;
   try {
     const sql = "SELECT * FROM usuarios_konect WHERE email = ?";
     const [results] = await db.query(sql, [email]);
     if (results.length === 0) { return res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas." }); }
     const usuario = results[0];
     const senhaCorresponde = await bcrypt.compare(senha, usuario.senha_hash);
     if (senhaCorresponde) {
       const { senha_hash, ...dadosDoUsuario } = usuario;
       res.status(200).json({ sucesso: true, usuario: dadosDoUsuario });
     } else {
       res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas." });
     }
   } catch (error) {
     console.error("❌ [BACKEND] ERRO DURANTE O LOGIN:", error);
     res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
   }
});

// ROTA ESQUECI-SENHA
app.post('/api/esqueci-senha', async (req, res) => {
    // (O código desta rota permanece o mesmo da etapa anterior)
    console.log('\n--- [BACKEND] Rota /api/esqueci-senha recebida ---');
    const { email } = req.body;
    try {
        const [usuarios] = await db.query("SELECT id, email, nome FROM usuarios_konect WHERE email = ?", [email]);
        if (usuarios.length === 0) {
            return res.status(200).json({ sucesso: true, mensagem: "Se um usuário com este email existir, um link de redefinição será enviado." });
        }
        const usuario = usuarios[0];
        const token = crypto.randomBytes(20).toString('hex');
        const expiraEm = new Date(Date.now() + 3600000); // 1 hora
        await db.query("UPDATE usuarios_konect SET token_redefinicao = ?, token_expira_em = ? WHERE id = ?", [token, expiraEm, usuario.id]);
        
        const linkRedefinicao = `http://localhost:8080/redefinir-senha/${token}`;
        
        const info = await transportador.sendMail({
            from: '"ALPHA KONECT" <nao-responda@alphakonect.com>',
            to: usuario.email,
            subject: "Redefinição de Senha",
            html: `<p>Olá, ${usuario.nome},</p><p>Clique no link para redefinir sua senha: <a href="${linkRedefinicao}">${linkRedefinicao}</a></p>`,
        });

        console.log(`Email de redefinição enviado. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        res.status(200).json({ sucesso: true, mensagem: "Se um usuário com este email existir, um link de redefinição será enviado." });
    } catch (error) {
        console.error("❌ ERRO em /api/esqueci-senha:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
    }
});

// ROTA REDEFINIR-SENHA-COM-TOKEN
app.post('/api/redefinir-senha-com-token', async (req, res) => {
  // (O código desta rota permanece o mesmo da etapa anterior)
    console.log('\n--- [BACKEND] Rota /api/redefinir-senha-com-token recebida ---');
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
        console.log(`✅ Senha do usuário ${usuario.email} foi redefinida com sucesso.`);
        res.status(200).json({ sucesso: true, mensagem: "Senha redefinida com sucesso!" });
    } catch (error) {
        console.error("❌ ERRO em /api/redefinir-senha-com-token:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro interno ao redefinir a senha." });
    }
});


// 7. INICIALIZAÇÃO DO SERVIDOR
const PORTA = 3001;
app.listen(PORTA, async () => {
  await conectarAoBanco();
  await criarTransportadorEmail();
  console.log(`🚀 [BACKEND] Servidor pronto e ouvindo na porta ${PORTA}`);
});