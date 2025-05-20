const express = require("express");
const router = express.Router();

const { 
  createUsuario, 
  getUsuarioById, 
  getAllPerguntas, 
  createResposta, 
  getRespostasByUsuario, 
  getTotalPontosByUsuario 
} = require("../repository/mysql");

const nodemailer = require("nodemailer");

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Health check
router.get('/ping', (req, res) => res.json({ message: 'pong' }));

// Route para iniciar o teste - insere usuário na tabela usuarios
router.post("/iniciar-teste", async (req, res) => {
    console.log('Received request to iniciar-teste:', req.body);
    const { nome, email } = req.body;
    
    if (!nome || !email) {
        console.log('Missing required fields');
        return res.status(400).json({ message: "Nome e email são obrigatórios" });
    }
    
    try {
        const usuario = await createUsuario(nome, email);
        console.log('Usuario created successfully:', usuario);
        res.status(201).json({ idUsuario: usuario.id });
    } catch (error) {
        console.error('Error creating usuario:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

// Route para obter o questionário - lista todas as perguntas com suas alternativas
router.get("/questionario", async (req, res) => {
    console.log('Received request to get questionario');
    try {
        //TODO: Buscar perguntas e alternativas do banco de dados
        console.log(`Found ${perguntas.length} perguntas`);
        res.json({ nome: "Questionário A", perguntas });
    } catch (error) {
        console.error('Error getting perguntas:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

// Route para enviar as respostas - registra respostas na tabela respostas
router.post("/resposta", async (req, res) => {
    console.log('Received request to register resposta:', req.body);
    const { idUsuario, idAlternativa } = req.body;
    
    if (!idUsuario || !idAlternativa) {
        console.log('Missing required fields for resposta');
        return res.status(400).json({ message: "ID do usuário e ID da alternativa são obrigatórios" });
    }
    
    try {
        // Verifica se o usuário existe
        //TODO: Buscar usuário do banco de dados
        console.log('Usuario found:', usuario);
        
        if (!usuario) {
            console.log(`Usuario with id ${idUsuario} not found`);
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        
        // Registra a resposta
        //TODO: Criar resposta no banco de dados
        console.log('Resposta created:', resposta);
        
        // Calcula o total de pontos do usuário
        //TODO: Buscar total de pontos do usuário no banco de dados
        console.log(`Total points for usuario ${idUsuario}: ${totalPoints}`);
        
        res.json({ nome: usuario.nome, pontos: totalPoints });
    } catch (error) {
        console.error('Error registering resposta:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

// Route para enviar email
router.post("/questionario/:id/enviar-email", async (req, res) => {
    //TODO: Implementar lógica para enviar email caso seja necessário
    res.send("Email enviado!");
});

module.exports = router;