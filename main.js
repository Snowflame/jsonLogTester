fs = require('fs');
fs.readFile('log.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  data = JSON.parse(data);
  var regex_search = RegExp('^.*(google|bing).[a-z]*.*$');
  var regex_social = RegExp('^.*https://t.co*.*$');

  function analyse(regex){
    var regex_uploadDir = RegExp('^GET /wp-content/uploads/.*$');

    let counter = 1;
    let score = {all: 0}
    while(typeof data[counter] !== 'undefined'){
      if(regex.test(data[counter].REFERER) && !regex_uploadDir.test(data[counter].REQUEST) ){
        if(typeof score[data[counter].REQUEST] !== 'undefined'){
          score[data[counter].REQUEST]++;
          score.all++;
        }
        else{
          score[data[counter].REQUEST] = 1;
          score.all++;
        }
      }
      counter++
    }

    return score;
  }

  console.log(analyse(regex_search));
  console.log(analyse(regex_social));
});
