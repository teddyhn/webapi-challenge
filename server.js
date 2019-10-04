const express = require('express');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Server get!</h2>`)
});

module.exports = server;