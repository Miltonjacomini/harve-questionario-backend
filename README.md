# Questionário Backend

Este é o backend para a aplicação de questionário, desenvolvido com Node.js e MySQL.

## Estrutura do Projeto

```
questionario-backend/
├── config/             # Configurações da aplicação
│   └── database.js     # Configuração de conexão com o MySQL
├── repository/         # Camada de acesso a dados
│   └── mysql.js        # Funções para operações no banco de dados MySQL
├── routes/             # Rotas da API
│   └── questionario.js # Endpoints relacionados ao questionário
├── scripts/            # Scripts auxiliares
│   └── init-db.sql     # Script de inicialização do banco de dados
├── .env                # Variáveis de ambiente
├── index.js            # Ponto de entrada da aplicação
├── package.json        # Dependências e scripts
└── README.md           # Este arquivo
```

## Banco de Dados

O projeto utiliza MySQL como banco de dados. A estrutura do banco é a seguinte:

- **usuarios**: Armazena os usuários que respondem ao questionário
- **perguntas**: Armazena as perguntas do questionário
- **alternativas**: Armazena as alternativas para cada pergunta
- **respostas**: Armazena as respostas dos usuários

## Endpoints da API

### Health Check
- **GET /api/ping**: Verifica se a API está funcionando

### Usuários
- **POST /api/iniciar-teste**: Cria um novo usuário para iniciar o teste
  - Body: `{ "nome": "Nome do Usuário", "email": "email@exemplo.com" }`
  - Response: `{ "idUsuario": 1 }`

### Questionário
- **GET /api/questionario**: Retorna todas as perguntas com suas alternativas
  - Response: `{ "nome": "Questionário A", "perguntas": [...] }`

### Respostas
- **POST /api/resposta**: Registra a resposta de um usuário
  - Body: `{ "idUsuario": 1, "idAlternativa": 2 }`
  - Response: `{ "nome": "Nome do Usuário", "pontos": 10 }`

### Email
- **POST /api/questionario/:id/enviar-email**: Envia email com os resultados (não implementado)

## Configuração do Ambiente

### Pré-requisitos
- Node.js (v14 ou superior)
- MySQL (v8 ou superior)

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Email Configuration
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=questionario_db
DB_USER=root
DB_PASSWORD=password
```

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie o banco de dados:
   ```
   mysql -u root -p < scripts/init-db.sql
   ```
   Ou o banco será criado automaticamente na primeira execução se tiver as permissões corretas.

4. Inicie o servidor:
   ```
   npm start
   ```

## Desenvolvimento

Para executar o servidor em modo de desenvolvimento com recarga automática:

```
npm run dev
```

## Implementação Técnica

O projeto foi implementado utilizando:

- **Express**: Framework web para Node.js
- **mysql2**: Driver MySQL para Node.js com suporte a Promises
- **dotenv**: Para gerenciamento de variáveis de ambiente
- **nodemailer**: Para envio de emails (configurado mas não implementado)

A aplicação utiliza uma arquitetura em camadas:
- **Rotas**: Responsáveis por receber as requisições e enviar as respostas
- **Repositório**: Responsável pela comunicação com o banco de dados
- **Configuração**: Responsável pelas configurações da aplicação

## Segurança

- As senhas e informações sensíveis são armazenadas em variáveis de ambiente
- A aplicação utiliza CORS para permitir requisições de origens específicas
