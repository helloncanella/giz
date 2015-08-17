class Canvas
  constructor: (@canvasTag)->
    @setBlackboard()
    @strokeBundler = new Array()

  getStrokeBundler: ->
    toSend = @strokeBundler
    @strokeBundler = new Array() #cleaning the bundler
    return toSend

  setBlackboard:->
    old=undefined
    @lastDrawGraphics=undefined
    @lastDraw = undefined
    self = this

    @stage = new createjs.Stage(@canvasTag.id)

    @stage.enableDOMEvents(true)
    @color = "#0FF"
    @size = 10

    @stage.on 'stagemousedown', (event) ->
      self.color = createjs.Graphics.getHSL(Math.random()*360, 100, 50)
      self.isMouseDown = true
      self.lastDrawGraphics = new createjs.Graphics()
      self.lastDraw = new createjs.Shape(self.lastDrawGraphics)

      @stage.addChild(self.lastDraw)

    @stage.on 'stagemousemove', (event) ->
      self.lastDrawGraphics
      if old and self.isMouseDown
        self.lastDrawGraphics.beginStroke(self.color)
                            .setStrokeStyle(self.size, "round")
                            .moveTo(old.x, old.y)
                            .lineTo(event.stageX, event.stageY)
        @stage.update()

        self.strokeBundler.push({x:event.stageX,y:event.stageY})
      old =
        x: event.stageX
        y: event.stageY

    @stage.on 'stagemouseup', (event) ->

      self.isMouseDown=false


  drawRecognizedShape: (recognizedShape) ->
    self = this
    if recognizedShape #the method wiil act just when there is a recognizedShape
      @stage.removeChild(@lastDraw)

      beautifulDrawGraphics = new createjs.Graphics()

      beautifulDraw = new createjs.Shape(beautifulDrawGraphics)
      beautifulDrawGraphics.beginStroke(self.color)

      @stage.addChild(beautifulDraw)
      @stage.update()

      label = recognizedShape.label
      switch label
        when 'polyline'
          vertexes = recognizedShape.vertexes
          for newVertex in vertexes
            if !old
              old = newVertex
              continue
            beautifulDrawGraphics.beginStroke(self.color)
                                .setStrokeStyle(self.size, "round")
                                .moveTo(old.x,old.y)
                                .lineTo(newVertex.x,newVertex.y)
            @stage.update()
            old = newVertex
        when 'ellipseArc' #TODO ADAPT THE OPERATION FOR A GENERAL ELLIPSE ARC
          center = recognizedShape.center
          radius = recognizedShape.minRadius
          startAngle = recognizedShape.startAngle
          sweepAngle = recognizedShape.sweepAngle
          endAngle = startAngle + sweepAngle
          beautifulDrawGraphics.beginStroke(self.color)
                              .setStrokeStyle(self.size, "round")
                              .arc(center.x, center.y, radius, startAngle, endAngle,true)
          @stage.update()
        else
          return null
