class myscriptRequests

  constructor: () ->
    @applicationKey = '63e2c95e-2122-458e-8c4b-9055d42d357f'
    @hmacKey = '75b47acb-b553-4a9e-878b-f96639e1f7dc'
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
    console.log mostProbableShape
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
