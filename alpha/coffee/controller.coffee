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
    console.log 'dfadfadfadf'
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
    console.log 'DEBUGDRAW',debugDraw


  $('canvas').mouseup (event)->
    strokeBundler = canvas.getStrokeBundler()
    myscriptWorker.postMessage(strokeBundler)

  classifyStrokeAndSetId = (recognizedShape) ->
    if !@strokeId
      @strokeId=0
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
    strokeClassified = self.classifyStrokeAndSetId(recognizedShape)

    # Draw recognizedShape
    beauty = strokeClassified.uglyOrBeautiful
    if beauty=='beautiful'
      label = strokeClassified.measures.label
      canvas.drawRecognizedShape(strokeClassified)

    box2dAgentInstance.transformTheGivenStrokeInABody(strokeClassified)
                      .insertTheTransformedBodyInTheWorld()
    bodyList = box2dAgentInstance.getBodyList()


  (update = () ->
    if !box2dAgentInstance
      setBox2d()
    if box2dAgentInstance
      world.Step(rate,50,50)
      world.DrawDebugData()
      canvas.updateDraw(box2dAgentInstance.getBodyList())
    requestAnimationFrame(update)
  )()
