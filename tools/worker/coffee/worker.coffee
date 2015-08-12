self.onmessage = (e) ->
  console.log('Message received from main script')
  workerResult = 'Result: '+(e.data[0]*e.data[1])
  console.log workerResult
  console.log 'Posting message back to main script'
  postMessage(workerResult)
