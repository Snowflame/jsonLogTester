var fs = require('fs');
var Table = require('cli-table3');

fs.readFile('log.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  data = JSON.parse(data);
  var regex_search = RegExp('^.*(google|bing).[a-z]*.*$');

  // instantiate
  var table_search = new Table({
      head: ['Hits', 'URL']
  });

  var regex_social = RegExp('^.*https://t.co*.*$');
  // instantiate
  var table_social = new Table({
      head: ['Hits', 'URL']
  });

  function analyse(regex, table){
    var regex_uploadDir = RegExp('^GET (/wp-content/|/sandbox/).*$');

    let counter = 1;
    let score = {all: 0}
    while(typeof data[counter] !== 'undefined'){
      if(regex.test(data[counter].REFERER) && !regex_uploadDir.test(data[counter].REQUEST) ){
        let req = data[counter].REQUEST.replace('GET ', '');
        req = req.replace(' HTTP/1.1', '');
        if(typeof score[req] !== 'undefined'){
          score[req]++;
          score.all++;
        }
        else{
          score[req] = 1;
          score.all++;
        }
      }
      counter++
    }

    for(let key in score){
      table.push([key, score[key]]);
    }
    table.sort(function(a, b) {
        return b[1] - a[1];
    });

    return table;
  }
  console.log("# Google & Bing ###")
  table_search = analyse(regex_search, table_search);
  console.log(table_search.toString());
  table_social = analyse(regex_social, table_social);
  console.log("# Twitter ###")
  console.log(table_social.toString());
});
