-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS questionario_db;
USE questionario_db;

-- Create tables
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS perguntas (
  id_pergunta INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  ordem INT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alternativas (
  id_alternativa INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  id_pergunta INT NOT NULL,
  ordem INT NOT NULL,
  pontos INT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pergunta) REFERENCES perguntas(id_pergunta) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS respostas (
  id_resposta INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_alternativa INT NOT NULL,
  pontos INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_alternativa) REFERENCES alternativas(id_alternativa) ON DELETE CASCADE
);

-- Add some sample data
INSERT INTO perguntas (titulo, ordem, ativo) VALUES 
('Qual é a sua cor favorita?', 1, true),
('Qual é o seu animal favorito?', 2, true),
('Qual é a sua comida favorita?', 3, true);

INSERT INTO alternativas (descricao, id_pergunta, ordem, pontos, ativo) VALUES 
('Azul', 1, 1, 5, true),
('Vermelho', 1, 2, 4, true),
('Verde', 1, 3, 3, true),
('Amarelo', 1, 4, 2, true),
('Cachorro', 2, 1, 5, true),
('Gato', 2, 2, 4, true),
('Pássaro', 2, 3, 3, true),
('Peixe', 2, 4, 2, true),
('Pizza', 3, 1, 5, true),
('Hambúrguer', 3, 2, 4, true),
('Salada', 3, 3, 3, true),
('Sushi', 3, 4, 2, true);
