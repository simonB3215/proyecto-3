require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
// Render asignará un puerto dinámicamente en 'process.env.PORT'
const PORT = process.env.PORT || 3000;

// Configuración de Seguridad y Middlewares
// Habilitamos CORS para que tu Frontend (por ejemplo, Netlify) pueda hacerle peticiones sin problemas
app.use(cors({ origin: '*' })); 
app.use(express.json()); // Permite leer la información (body) que nos envíen por POST

// ==========================================
// RUTAS DE LA API (ENDPOINTS)
// ==========================================

// 1. Ruta de Estado (Health Check)
// Usada por Render para saber si tu servidor no se ha caído.
app.get('/', (req, res) => {
  res.send('Servidor El Dorado operando al 100%');
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'El Backend de El Dorado está respondiendo peticiones.',
    timestamp: new Date()
  });
});

// A futuro: Aquí puedes agregar rutas privadas
// Ejemplo: POST /api/pagos -> Valida una tarjeta y luego le habla a Supabase usando 'supabase-js'

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 El servidor secreto está funcionando en el puerto: ${PORT}`);
});
