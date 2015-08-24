if window.Worker
  canvasTag = $('canvas#easel')[0]
  debugDrawCanvas = $('canvas#debugDraw')[0]
  canvas = new Canvas(canvasTag)

  context = debugDrawCanvas.getContext('2d')

  myscriptWorker = new Worker('js/myscriptWorker.js')

  box2dAgentInstance = undefined
  world = undefined
  rate = undefined
  debugDraw = undefined

  setBox2d = () ->
    gravity = new b2Vec2(0,10)
    world = new b2World(gravity,false)
    rate = 1/60
    scale = 30
    box2dAgentInstance = new box2dAgent(world,scale)

    debugDraw = new b2DebugDraw
    debugDraw.SetSprite context
    debugDraw.SetDrawScale scale
    debugDraw.SetFillAlpha 0.3
    debugDraw.SetLineThickness 1.0
    debugDraw.SetFlags b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit
    world.SetDebugDraw debugDraw

  $('canvas').mouseup (event)->
    strokeBundler = canvas.getStrokeBundler()
    myscriptWorker.postMessage(strokeBundler)

  classifyStrokeAndSetId = (recognizedShape) ->
    if !@strokeId
      @strokeId=0
    if recognizedShape
      stroke=
        uglyOrBeautiful:'beautiful'
        measures:
          canvas:recognizedShape
          box2d: null
    else
      stroke=
        uglyOrBeautiful:'ugly'
        measures:
          canvas:recognizedShape
          box2d: null
    stroke.id = @strokeId
    @strokeId++
    return stroke

  recognizedShape = undefined
  myscriptWorker.onmessage = (e) ->
    recognizedShape = e.data
    strokeClassified = self.classifyStrokeAndSetId(recognizedShape)

    box2dAgentInstance.transformTheGivenStrokeInABody(strokeClassified)
                      .insertTheTransformedBodyInTheWorld()
    bodyList = box2dAgentInstance.getBodyList()

    # Draw recognizedShape
    beauty = strokeClassified.uglyOrBeautiful
    if beauty=='beautiful'
      label = strokeClassified.measures.canvas.label
      canvas.drawRecognizedShape(strokeClassified)

    canvas.setLastBodyAxis(bodyList[(bodyList.length-1)])



  (update = () ->
    if !box2dAgentInstance
      setBox2d()
    if box2dAgentInstance
      world.Step(rate,10,10)
      world.DrawDebugData()
      canvas.updateDraw(box2dAgentInstance.getBodyList())
    requestAnimationFrame(update)
  )()
