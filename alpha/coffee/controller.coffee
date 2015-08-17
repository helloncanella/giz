if window.Worker
  canvasTag = $('canvas')[0]
  canvas = new Canvas(canvasTag)

  myscriptWorker = new Worker('js/myscriptWorker.js')
  box2dWorker = new Worker('js/box2dWorker.js')

  strokeBundler = undefined
  $('canvas').mouseup (event)->
    strokeBundler = canvas.getStrokeBundler()
    myscriptWorker.postMessage(strokeBundler)

  recognizedShape = undefined
  myscriptWorker.onmessage = (e) ->
    recognizedShape = e.data
    canvas.drawRecognizedShape(recognizedShape)
    box2dWorker.postMessage({rawStroke:strokeBundler, beautifulStroke:recognizedShape})

else
  $( 'canvas').remove()
  $('body').append "<h1> Your browser doesn't support our application. </h1> <p>Try one more modern, like chrome or firefox, for example.</p>"
