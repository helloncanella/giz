self.onmessage = function(e) {
  var workerResult;
  console.log('Message received from main script');
  workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log(workerResult);
  console.log('Posting message back to main script');
  return postMessage(workerResult);
};
