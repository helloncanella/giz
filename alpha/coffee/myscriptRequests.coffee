class myscriptRequests

  constructor: () ->
    @applicationKey = '15bd945b-44ef-4371-9c60-173b432de8dc'
    @hmacKey = '644e4c91-8cfb-47bc-87b5-15459d86e1de'
    @instanceId = undefined

    @inkManager = new MyScript.InkManager()
    @shapeRecognizer = new MyScript.ShapeRecognizer()

  receiveStrokeBundler: (@strokeBundler) ->
    @fillInkManager() #the body of the @fillInkManager will use the @strokeBundler

  fillInkManager: ->
    counter = start = 0
    end = @strokeBundler.length - 1
    for stroke in @strokeBundler
      switch counter
        when start then @inkManager.startInkCapture(stroke.x, stroke.y)
        when end then @inkManager.endInkCapture()
        else @inkManager.continueInkCapture(stroke.x,stroke.y)
      counter++

  doRecognition: ->
    if (!@inkManager.isEmpty())
      @shapeRecognizer.doSimpleRecognition(@applicationKey, @instanceId, @inkManager.getStrokes(), @hmacKey)
    else
      throw console.error("problem with the Myscript's recognition")

  decodeServerResult: (serverResult) ->
    #The result from myscript's server will be decoded
    resultedSegments = serverResult.result.segments
    arrayLength = resultedSegments.length
    mostProbableShape = resultedSegments[arrayLength-1].candidates[0]
    typeOfResult = constructor = mostProbableShape.constructor.name

    if typeOfResult is 'ShapeNotRecognized'
      console.error  'Shape not recognized'
      shape = null
    else
      primitivesList = mostProbableShape.primitives
      typeOfShape = primitivesList[0].constructor.name

      for primitive in primitivesList
        switch typeOfShape
          when 'ShapeEllipse'
            shape =
              label:'ellipseArc'
              center: primitive.center
              maxRadius: primitive.maxRadius
              minRadius: primitive.minRadius
              orientation: primitive.orientation
              startAngle:  primitive.startAngle
              sweepAngle:  primitive.sweepAngle

          when 'ShapeLine'
            if(!startPoint)
              vertexesArray = new Array()
              startPoint = primitive.firstPoint
              vertexesArray.push(startPoint)
            nextPoint  = primitive.lastPoint
            vertexesArray.push(nextPoint)
            shape = {vertexes: vertexesArray, label:'polyline'}
          else
            shape = null

      return shape
