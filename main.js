var http = require('http');
var util = require('util');
var colors = require('colors');
var prettyjson = require('prettyjson');
var figlet = require('figlet');
var through = require('through2');

var headerOptions = {
	keysColor: 'red',
	dashColor: 'magenta',
	stringColor: 'grey'
};

var bodyOptions = {
	keysColor: 'green',
	dashColor: 'magenta',
	stringColor: 'grey'
};

function rule() {
	return "*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*";
}

console.log("\n" + figlet.textSync('HTTP-Respond', {
	font: 'standard'
}).rainbow, "\n\n" + rule() + "\n");

var httpServer = http.createServer(function(req, res) {
	var headers = req.headers;
	var method = {method: req.method};
	
	console.log('Headers:\n'.bold.underline);
	console.log(prettyjson.render(headers, headerOptions) + '\n'
				+ prettyjson.render(method, {keysColor: 'blue', stringColor: 'grey'}));
	if (!Number(headers["content-length"]))
		return res.end(console.log("\n" + rule() + "\n"));
	console.log('\n\nBODY:\n'.bold.underline);

	if (headers["content-type"] === "application/json")
		req.pipe(through(function(buf, _, next) {
			this.push(prettyjson.render(JSON.parse(buf), bodyOptions));
			next();
		})).pipe(process.stdout);
	else
		req.pipe(through(function(buf, _, next) {
			this.push(buf.toString().green);
			next();
		})).pipe(process.stdout);
	req.on("end", function() {
		console.log("\n\n" + rule() + "\n");
	});

	res.end();
});

httpServer.listen(process.argv[2]);