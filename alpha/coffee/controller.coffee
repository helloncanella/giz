if window.Worker
  canvasTag = $('canvas')[0]
  canvas = new Canvas(canvasTag)

  myscriptWorker = new Worker('js/myscriptWorker.js')
  box2dWorker = new Worker('js/box2dWorker.js')

  strokeBundler = undefined
  $('canvas').mouseup (event)->
    strokeBundler = canvas.getStrokeBundler()
    myscriptWorker.postMessage(strokeBundler)

  classifyStrokeAndSetId = (recognizedShape) ->
    if !@strokeId
      @strokeId=1
    if recognizedShape
      stroke=
        uglyOrBeautiful:'beautiful'
        measures:recognizedShape
    else
      stroke=
        uglyOrBeautiful:'ugly'
        measures:strokeBundler
    stroke.id = @strokeId
    @strokeId++
    return stroke

  recognizedShape = undefined
  myscriptWorker.onmessage = (e) ->
    recognizedShape = e.data
    canvas.drawRecognizedShape(recognizedShape)
    strokeClassified = self.classifyStrokeAndSetId(recognizedShape)
    box2dWorker.postMessage(strokeClassified)








  # bodiesList = null
  # box2dWorker.onmessage = (e) ->
  #   bodiesList = e.data or null
  #
  # (updateCanvas = () ->
  #   window.requestAnimationFrame(updateCanvas)
  #   console.log bodiesList
  # )()




else
  $( 'canvas').remove()
  $('body').append "<h1> Your browser doesn't support our application. </h1> <p>Try one more modern, like chrome or firefox, for example.</p>"
