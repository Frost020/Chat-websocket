const WebSocket = require('ws');
const http = require('http');
const fs = require('fs'); // Para leer el archivo HTML

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Servir el archivo HTML
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error al cargar el archivo HTML');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket funcionando');
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  
  ws.on('message', (data) => {
    const parsedData = JSON.parse(data); // Parsear el mensaje recibido
    const username = parsedData.username;
    const message = parsedData.message;
    
    console.log(`Mensaje de ${username}: ${message}`);
    
    // Enviar el mensaje a todos los clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`De ${username}: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(4000, () => {
  console.log('Servidor WebSocket y HTTP corriendo en http://localhost:4000');
});