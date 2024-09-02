const https = require('https');
const fs = require('fs');
const express = require('express');
const next = require('next');



const app = next({ dev: false });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt'),
  ca: fs.readFileSync('ssl/ca_bundle.crt')
};

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });



  https.createServer(options, server).listen(4001, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:4001');
  });


});
