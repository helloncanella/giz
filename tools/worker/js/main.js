var first, myWorker, result, second;

if (window.Worker) {
  myWorker = new Worker("js/worker.js");
  first = $('#first');
  second = $('#second');
  result = $('#result');
  first.change(function() {
    console.log(first, second);
    myWorker.postMessage([first.val(), second.val()]);
    console.log('Message posted to worker');
  });
  second.change(function() {
    myWorker.postMessage([first.val(), second.val()]);
    console.log([first.val(), second.val()]);
    console.log('Message posted to worker');
  });
  myWorker.onmessage = function(e) {
    result.val(e.data);
    return console.log('Message received from worker');
  };
  console.log(myWorker);
}
