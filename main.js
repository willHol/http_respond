const http = require('http');
const prettyjson = require('prettyjson');
const colors = require('colors');
const figlet = require('figlet');
const through = require('through2');

const headerOptions = {
  keysColor: 'red',
  dashColor: 'magenta',
  stringColor: 'grey',
};

const bodyOptions = {
  keysColor: 'green',
  dashColor: 'magenta',
  stringColor: 'grey',
};

const rule = () => '*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*';
const header = figlet.textSync('HTTP-Respond', { font: 'standard' }).rainbow;

console.log(`\n${header}\n\n${rule()}\n`);

const httpServer = http.createServer((req, res) => {
  const headers = prettyjson.render(req.headers, headerOptions);
  const method = prettyjson.render({ method: req.method }, { keysColor: 'blue', stringColor: 'grey' });

  // Headers section
  console.log('\b\b\bHeaders:\n'.bold.underline);
  console.log(`${headers}\n${method}`);

  // Stop now if the request contains no body
  if (!Number(req.headers['content-length'])) {
    return res.end(console.log(`\n${rule()}\n`));
  }

  // Body section
  console.log('\n\nBODY:\n'.bold.underline);

  // Stream the body into the console
  if (headers['content-type'] === 'application/json') {
    req
      .pipe(through(function(buf, _, next) {
        this.push(prettyjson.render(JSON.parse(buf), bodyOptions));
        next();
      }))
      .pipe(process.stdout);
  } else {
    req
      .pipe(through(function(buf, _, next) {
        this.push(buf.toString().green);
        next();
      }))
      .pipe(process.stdout);
  }

  // When the body finishes streaming end the program
  req.on('end', () => {
    console.log(`\n\n${rule()}\n`);
    return res.end();
  });
});

httpServer.listen(process.argv[2]);
