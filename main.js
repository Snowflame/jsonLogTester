const CRAWLER = require('crawler-user-agents');
var express = require('express');
var app = express();
var TableBuilder = require('table-builder');
var fs = require('fs');
var rl = require('readline');
var renderLogFile = require( __dirname + '/tojson.js');

const regex_search = RegExp('^.*https:\/\/(www\.)?(google|bing).[a-z]*.*$');
const regex_uploadDir = RegExp('^(/wp-content/|/sandbox/|/wp-cron|/wp-admin/|/wp-json/|/wp-includes/).*$');
const table_pis_head = { "url" : "Adress", "pi": "Pageimpression" };

let score = {all: 0}

function readFile(file, res) {
  var lineReader = rl.createInterface({
    input: fs.createReadStream("./log/"+file)
  });
  lineReader.on('line', function (line) {

    let reqest = renderLogFile.splitLogLine(line);
    if(regex_search.test(reqest.ref) && !regex_uploadDir.test(reqest.url) ){
      if(typeof score[reqest.url] !== 'undefined'){
        score[reqest.url]++;
        score.all++;
      }
      else{
        score[reqest.url] = 1;
        score.all++;
      }
    }
  });

  lineReader.on('close', function(){
    let table = [];
    for(let key in score){
      table.push([key, score[key]]);
    }
    score = {all: 0};
    table.sort(function(a, b) {
        return b[1] - a[1];
    });
    table = table.map(row => {
      return {url: row[0], pi: row[1]};
    });

    res.send("<h1>Searchtraffic</h1><br/><a href=\"/\">back</a>"+(new TableBuilder())
      .setHeaders(table_pis_head) // see above json headers section
      .setData(table) // see above json data section
      .render());
  })
}

app.get('/', function (req, res) {
  fs.readdir('./log', (err, files) => {
    let html = "<h1>Logfiles</h1><br/>";
    files.forEach(file => {
      html += "<a href=\"/parse?file="+file+"\">"+file+"</a><br/>";
    });
    res.send(html);
  })
});

app.get('/parse', function (req, res) {
  readFile(req.query.file, res);
});

app.listen(1337, function () {
  console.log('http://localhost:1337');
});
