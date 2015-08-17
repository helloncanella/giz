console.log('WORKER');

self.onmessage = function(e) {
  var beautiful, raw;
  console.log('WORKER');
  raw = e.data.rawStroke;
  beautiful = e.data.beautifulStroke;
  if (beautiful) {
    return console.log("I prefer the pretty shape");
  } else {
    return console.log("I don't have option. I'll stay with the ugly shape");
  }
};
