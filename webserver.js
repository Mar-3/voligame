// Used the basic node server template from nodejs.org
const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = '127.0.0.1';
const port = 1234;

const mimeTypes = {
  'js': 'text/javascript',
  'css': 'text/css',
  'html': 'text/html',
  'png': 'image/png'
}

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'src');
  let contentType = mimeTypes[req.url.split('.')[1]];
  if (contentType == undefined) {
    res.end();
    return;
  }
  if (req.url == '/') {
    fs.readFile(path.join(filePath, 'index.html'), (err, content) => {
    res.writeHead(200, { 'Content-Type': mimeTypes['html']});
    res.end(content, 'utf-8');
    })
  }
  else if (fs.existsSync(path.join(filePath, req.url))) {
    fs.readFile(path.join(filePath, req.url), (err, content) => {
      console.log(contentType,req.url)
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8' );
    })    
  } else {
    res.end();
  }
  });
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});