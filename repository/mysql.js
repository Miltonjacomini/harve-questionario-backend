const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

// Function to run SQL script
async function executeSqlScript(connection, filePath) {
  try {
    const script = fs.readFileSync(filePath, 'utf8');
    const statements = script.split(';').filter(statement => statement.trim() !== '');
    
    for (const statement of statements) {
      await connection.query(statement);
    }
    
    console.log(`SQL script ${filePath} executed successfully`);
    return true;
  } catch (error) {
    console.error(`Error executing SQL script ${filePath}:`, error);
    return false;
  }
}

// Initialize database connection
async function initializeDatabase() {
  try {
    // Test the connection
    const connection = await pool.getConnection();
    console.log('MySQL database connected successfully');
    
    // Test if the database has the required tables
    try {
      await connection.query('SELECT 1 FROM usuarios LIMIT 1');
      await connection.query('SELECT 1 FROM perguntas LIMIT 1');
      await connection.query('SELECT 1 FROM alternativas LIMIT 1');
      await connection.query('SELECT 1 FROM respostas LIMIT 1');
      console.log('All required tables exist');
    } catch (tableError) {
      console.warn('Some tables may not exist:', tableError.message);
      console.log('Attempting to create tables from init-db.sql...');
      
      // Run the initialization script
      const scriptPath = path.join(__dirname, '../scripts/init-db.sql');
      await executeSqlScript(connection, scriptPath);
    }
    
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    return false;
  }
}

// Usuario repository functions
async function createUsuario(nome, email) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
      [nome, email]
    );
    return { id: result.insertId, nome, email };
  } catch (error) {
    console.error('Error creating usuario:', error);
    throw error;
  }
}

async function getUsuarioById(id) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting usuario:', error);
    throw error;
  }
}

// Perguntas repository functions
async function getAllPerguntas() {
  try {
    // Get all perguntas
    console.log('Executing query to get all perguntas');
    const [perguntas] = await pool.execute(
      'SELECT id_pergunta, titulo, ordem, ativo, createdAt, updatedAt FROM perguntas WHERE ativo = true ORDER BY ordem'
    );
    
    console.log(`Found ${perguntas.length} perguntas:`, perguntas);
    
    // For each pergunta, get its alternativas
    for (const pergunta of perguntas) {
      if (pergunta.id_pergunta) {
        console.log(`Getting alternativas for pergunta ${pergunta.id_pergunta}`);
        const [alternativas] = await pool.execute(
          'SELECT id_alternativa, descricao, id_pergunta, ordem, pontos, ativo, createdAt, updatedAt FROM alternativas WHERE id_pergunta = ? AND ativo = true ORDER BY ordem',
          [pergunta.id_pergunta]
        );
        console.log(`Found ${alternativas.length} alternativas for pergunta ${pergunta.id_pergunta}`);
        pergunta.alternativas = alternativas;
      } else {
        console.log(`No id_pergunta found for pergunta:`, pergunta);
        pergunta.alternativas = [];
      }
    }
    
    return perguntas;
  } catch (error) {
    console.error('Error getting perguntas:', error);
    throw error;
  }
}

// Respostas repository functions
async function createResposta(idUsuario, idAlternativa) {
  try {
    // First get the pontos from the alternativa
    const [alternativas] = await pool.execute(
      'SELECT pontos FROM alternativas WHERE id_alternativa = ?',
      [idAlternativa]
    );
    
    if (!alternativas.length) {
      throw new Error('Alternativa not found');
    }
    
    const pontos = alternativas[0].pontos;
    
    // Insert the resposta
    const [result] = await pool.execute(
      'INSERT INTO respostas (id_usuario, id_alternativa, pontos) VALUES (?, ?, ?)',
      [idUsuario, idAlternativa, pontos]
    );
    
    return { id: result.insertId, idUsuario, idAlternativa, pontos };
  } catch (error) {
    console.error('Error creating resposta:', error);
    throw error;
  }
}

async function getRespostasByUsuario(idUsuario) {
  try {
    const [respostas] = await pool.execute(
      `SELECT r.*, a.descricao, p.titulo 
       FROM respostas r
       JOIN alternativas a ON r.id_alternativa = a.id_alternativa
       JOIN perguntas p ON a.id_pergunta = p.id_pergunta
       WHERE r.id_usuario = ?`,
      [idUsuario]
    );
    
    return respostas;
  } catch (error) {
    console.error('Error getting respostas:', error);
    throw error;
  }
}

async function getTotalPontosByUsuario(idUsuario) {
  try {
    const [result] = await pool.execute(
      'SELECT SUM(pontos) as totalPontos FROM respostas WHERE id_usuario = ?',
      [idUsuario]
    );
    
    return result[0]?.totalPontos || 0;
  } catch (error) {
    console.error('Error getting total pontos:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  createUsuario,
  getUsuarioById,
  getAllPerguntas,
  createResposta,
  getRespostasByUsuario,
  getTotalPontosByUsuario
};
