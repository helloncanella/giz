class myscriptRequests

  constructor: () ->
    @applicationKey = 'a74d2cfe-c979-42b1-9afe-5203c68a490a'
    @hmacKey = '4d3be9ad-8f15-40e8-92d7-29af2d6ea0be'
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
      return @shapeRecognizer.doSimpleRecognition(@applicationKey, @instanceId, @inkManager.getStrokes(), @hmacKey)
    else
      throw console.error("problem with the Myscript's recognition")
