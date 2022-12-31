const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const WebSocketServer = require('./websocket-chat-server');
const dotenv = require("dotenv");


const app = express();

const port = process.env.PORT || 5000;

app.use(sassMiddleware({
  src: 'public',
  dest: 'public',
  indentedSyntax: false, // Enable .sass syntax
  debug: false
}));

app.use(express.static('public'));

app.listen(port, () => {
  console.log('Server listening on port', port);
});

const wss = new WebSocketServer(8125);
