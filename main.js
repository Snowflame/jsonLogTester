var fs = require('fs');
var Table = require('cli-table3');

fs.readFile('log.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var regex_uploadDir = RegExp('^(GET|POST|HEAD) (/wp-content/|/sandbox/|/wp-cron|/wp-admin/|/wp-json/|/wp-includes/).*$');
  var session_length = 20;

  data = JSON.parse(data);http://plus.url.google.com/
  var regex_search = RegExp('^.*https:\/\/(www\.)?(google|bing).[a-z]*.*$');
  var reqest_search_session = [];
  var table_search = new Table({
      head: ['URL', 'Hits']
  });

  var regex_social = RegExp('^.*https://t.co*.*$');
  var table_social = new Table({
      head: ['URL', 'Hits']
  });

  function analyse(regex, table){
    let counter = 1;
    let score = {all: 0}
    while(typeof data[counter] !== 'undefined'){
      if(regex.test(data[counter].REFERER) && !regex_uploadDir.test(data[counter].REQUEST) ){
        reqest_search_session.push(data[counter]);
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
  console.log("# Twitter ###");
  table_social = analyse(regex_social, table_social);
  console.log(table_social.toString());

  function test_session(time_range, host) {
    let pi_done = [];
    for(let counter = 1; typeof data[counter] !== 'undefined'; counter++){
      if(host == data[counter].HOST && !regex_uploadDir.test(data[counter].REQUEST)){
        let min = parseInt(data[counter].TIME.split(/\D/)[7]);
        if(min >= time_range[0] && min <= time_range[1])
          pi_done.push(data[counter]);
      }
    }
    return pi_done;
  }

  let pi_global = 0;
  let count_inits = 0;
    for(search_request of reqest_search_session){
      // 08/Jul/2018:04:19:35 +0200
      let in_time = parseInt(search_request.TIME.split(/\D/)[7]);
      let in_time_range = [];

      if(in_time+session_length < 61) {
        in_time_range[0] = in_time;
        in_time_range[1] = in_time+session_length;
      } else {
        in_time_range[0] = in_time;
        in_time_range[1] = in_time+session_length - 60;
      }
      let pis = test_session(in_time_range, search_request.HOST);
      if(pis.length > 0){
        pi_global += pis.length;
        count_inits++;
      }

    }
    console.log("################");
    console.log("PI per Visit: ", Math.round(pi_global/count_inits));
    console.log("################");
});
