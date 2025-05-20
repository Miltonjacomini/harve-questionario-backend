const express = require("express");
const bodyParser = require("body-parser");
const questionarioRoutes = require("./routes/questionario");
const { initializeDatabase } = require('./repository/mysql');

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const PORT = process.env.PORT || 3000;

// Initialize the application
async function startApp() {
  try {
    // Initialize MySQL database connection
    const dbInitialized = await initializeDatabase();
    
    if (dbInitialized) {
      console.log('MySQL database connected successfully');
      
      // Rotas
      app.use("/api", questionarioRoutes);

      // Iniciar o servidor
      app.listen(PORT, () => {
          console.log(`Servidor rodando na porta ${PORT}`);
      });
    } else {
      console.error('Failed to initialize database');
      process.exit(1);
    }
  } catch (error) {
    console.error("Error starting application:", error);
    process.exit(1);
  }
}

startApp().catch(console.dir);