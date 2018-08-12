exports.splitLogLine = function(line){
  const regex = /^(\S+) \S+ (\S+) \[([^\]]+)\] "([A-Z]+) ([^ "]+)? HTTP\/[0-9.]+" ([0-9]{3}) ([0-9]+|-) "([^"]*)" "([^"]*)"/gm;
  let m;

  let object = {
    host: '',
    identity: '',
    time: '',
    requestType: '',
    url: '',
    status: '',
    size: '',
    ref: '',
    agent: '',
    bot: false,
    intern: false
  };

  if ((m = regex.exec(line)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
          switch(groupIndex) {
            case 1:
              object.host = match;
            break;
            case 2:
              object.identity = match;
            break;
            case 3:
              object.time = match;
            break;
            case 4:
              object.requestType = match;
            break;
            case 5:
              object.url = match;
            break;
            case 6:
              object.status = match;
            break;
            case 7:
              object.size = match;
            break;
            case 8:
              object.ref = match;
            break;
            case 9:
              object.agent = match;
            break;
          }
      });
  }

  return object;
}
