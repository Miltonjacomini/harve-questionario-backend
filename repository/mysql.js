const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

// Função que roda o script da /scripts/init-db.sql
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

// Função que inicia a conexão com o banco de dados
async function initializeDatabase() {
  try {
    // Testa a conexão com o banco de dados
    const connection = await pool.getConnection();
    console.log('MySQL database connected successfully');
    
    // Testa se o banco de dados tem as tabelas necessárias
    try {
      await connection.query('SELECT 1 FROM usuarios LIMIT 1');
      await connection.query('SELECT 1 FROM perguntas LIMIT 1');
      await connection.query('SELECT 1 FROM alternativas LIMIT 1');
      await connection.query('SELECT 1 FROM respostas LIMIT 1');
      console.log('All required tables exist');
    } catch (tableError) {
      console.warn('Some tables may not exist:', tableError.message);
      console.log('Attempting to create tables from init-db.sql...');
      
      // Executa o script de inicialização
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
    // Pega todas as perguntas
    console.log('Executing query to get all perguntas');
    const [perguntas] = await pool.execute(
      'SELECT ....'
    );
    
    console.log(`Found ${perguntas.length} perguntas:`, perguntas);
    
    // For para cada pergunta, pega suas alternativas
    for (const pergunta of perguntas) {
      if (pergunta.id_pergunta) {
        console.log(`Getting alternativas for pergunta ${pergunta.id_pergunta}`);
        const [alternativas] = await pool.execute(
          'SELECT ....',
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
      'SELECT ....',
      [idAlternativa]
    );
    
    if (!alternativas.length) {
      throw new Error('Alternativa not found');
    }
    
    const pontos = alternativas[0].pontos;
    
    // Insert the resposta
    const [result] = await pool.execute(
      'INSERT INTO ....',
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
      `SELECT ....
       FROM respostas r
       JOIN ....
       JOIN .....
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
      'SELECT ....',
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
