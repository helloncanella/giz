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
  strokeBundler = undefined
  recognizedShape = undefined

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
    self.strokeBundler = canvas.getStrokeBundler()
    myscriptWorker.postMessage(strokeBundler)

  myscriptWorker.onmessage = (e) ->
    recognizedShape = e.data
    strokeClassified = self.classifyStrokeAndSetId(strokeBundler,recognizedShape)

    console.log 'strokeClassified', strokeClassified

    box2dAgentInstance.transformTheGivenStrokeInABody(strokeClassified)
                      .insertTheTransformedBodyInTheWorld()

    # Draw recognizedShape closed if it exists
    weGotaBeautifulStroke = !strokeClassified.conditions.weGotaUglyStroke
    weGotaClosedShape = strokeClassified.conditions.closed

    if weGotaBeautifulStroke and weGotaClosedShape
      canvas.drawRecognizedShape(strokeClassified)

    bodyList = box2dAgentInstance.getBodyList()
    canvas.setLastBodyAxis(bodyList[(bodyList.length-1)])

  classifyStrokeAndSetId = (rawStroke, recognizedShape) ->
    stroke =
      measures:
        canvas: undefined
        box2d: undefined
      conditions: undefined

    # conditions = stroke.conditions

    if recognizedShape
      stroke.measures.canvas = recognizedShape

      label = recognizedShape.label
      switch label
        when 'polyline'
          vertices = recognizedShape.vertices
          length = vertices.length
          startPoint = vertices[0]
          lastPoint = vertices[(length-1)]
          opened = (startPoint.x != lastPoint.x) and (startPoint.y != lastPoint.y)
          #conditions
          stroke.conditions=
            weGotaPolyline: true
            opened: opened
            closed: !opened
        when 'ellipseArc'
          sweepAngle = recognizedShape.sweepAngle
          maxRadius = recognizedShape.maxRadius
          minRadius = recognizedShape.minRadius
          opened = Math.round(Math.abs(sweepAngle)/(2*Math.PI))!=1

          withEqualRadius= minRadius == maxRadius

          #conditions
          stroke.conditions=
            weGotaEllipseArc: true
            opened: opened
            closed: !opened
            withEqualRadius: withEqualRadius
            withDifferentRadius: !withEqualRadius
    else
      stroke.measures.canvas = rawStroke
      stroke.conditions = {weGotaUglyStroke: true}

    if !@thereIsPreviousStroke
      @thereIsPreviousStroke = true
      stroke.id = @id= 0
    else
      stroke.id = @id + 1
      @id++

    return stroke

  (update = () ->
    if !box2dAgentInstance
      setBox2d()
    else
      world.Step(rate,10,10)
      world.DrawDebugData()
      canvas.updateDraw(box2dAgentInstance.getBodyList())
    requestAnimationFrame(update)
  )()
