const express = require('express');

const projectRouter = require('./project/projectRouter');
const actionRouter = require('./action/actionRouter');

const server = express();

server.use(express.json());

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Server get!</h2>`)
});

module.exports = server;