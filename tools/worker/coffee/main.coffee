if window.Worker
  myWorker = new Worker("js/worker.js")
  first = $('#first')
  second = $('#second')
  result = $('#result')

  first.change ->
    console.log first, second
    myWorker.postMessage([first.val(),second.val()])
    console.log('Message posted to worker')
    return

  second.change ->
    myWorker.postMessage([first.val(),second.val()])
    console.log [first.val(),second.val()]
    console.log('Message posted to worker')
    return

  myWorker.onmessage = (e) ->
    result.val(e.data)
    console.log('Message received from worker')
    

  console.log myWorker
