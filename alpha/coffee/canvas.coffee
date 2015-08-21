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

  storeInTheStrokeList: (stroke) ->
    if !@strokeList
      @strokeList = new Array()
    @strokeList.push(stroke) #store new recognizedShape

  removeFromTheStrokeList: (stroke) ->
    index = @strokeList.indexOf(stroke)
    @strokeList.splice(index,1)

  drawRecognizedShape: (recognizedShape) ->
    self = this

    if recognizedShape #the method wiil act just when there is a recognizedShape
      @stage.removeChild(@lastDraw)
      beautifulDrawGraphics = new createjs.Graphics()
      beautifulDraw = new createjs.Shape(beautifulDrawGraphics)
      beautifulDrawGraphics.beginStroke(self.color)

      @stage.addChild(beautifulDraw)
      @stage.update()

      console.log @stage

      label = recognizedShape.measures.label
      switch label
        when 'polyline'
          vertices = recognizedShape.measures.vertices
          for newVertex in vertices
            if !old
              old = newVertex
              continue
            beautifulDrawGraphics.beginStroke(self.color)
                                .setStrokeStyle(self.size, "round")
                                .moveTo(old.x,old.y)
                                .lineTo(newVertex.x,newVertex.y)

            @stage.update()
            old = newVertex
          @stage.update()
        when 'ellipseArc' #TODO ADAPT THE OPERATION FOR A GENERAL ELLIPSE ARC
          center = recognizedShape.measures.center
          radius = recognizedShape.measures.minRadius
          startAngle = recognizedShape.measures.startAngle
          sweepAngle = recognizedShape.measures.sweepAngle
          endAngle = startAngle + sweepAngle

          if sweepAngle<=0
            anticlockwise = true
          else
            anticlockwise = false


          beautifulDrawGraphics.beginStroke(self.color)
                              .setStrokeStyle(self.size, "round")
                              .arc(center.x, center.y, radius, startAngle, endAngle,anticlockwise)
          @stage.update()
        else
          return null

  updateDraw: (bodyList) ->
    index = 0
    # console.log bodyList
    # console.log @stage
    for child in @stage.children
      if(bodyList[index])
        console.log 'aqui'
        child.x = child.x + bodyList[index].vx*(1/60)*30
        child.y = child.y + bodyList[index].vy*(1/60)*30
        # child.regX = child.localToGlobal(bodyList[index].centroid.x*30,bodyList[index].centroid.y*30).x
        # child.regY = child.localToGlobal(bodyList[index].centroid.x*30,bodyList[index].centroid.y*30).y
        #
        # child.rotation = child.rotation + bodyList[index].angularVelocity*(1/60)*30
        # console.log 'angular', bodyList[index].angularVelocity
        index++
        @stage.update()
