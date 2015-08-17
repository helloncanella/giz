if window.Worker
  canvasTag = $('canvas')[0]
  canvas = new Canvas(canvasTag)

  myscriptWorker = new Worker('js/myscriptWorker.js')

  $('canvas').mouseup (event)->
    strokeBundler = canvas.getStrokeBundler()
    myscriptWorker.postMessage(strokeBundler)

  myscriptWorker.onmessage = (e) ->
    recognizedShape = e.data
    console.log recognizedShape
    canvas.drawRecognizedShape(recognizedShape)

else
  $( 'canvas').remove()
  $('body').append "<h1> Your browser doesn't support our application. </h1> <p>Try one more modern, like chrome or firefox, for example.</p>"
