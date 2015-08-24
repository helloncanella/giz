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
    pointToCentroidCalculation = undefined

    
    @stage = new createjs.Stage(@canvasTag.id)

    @stage.enableDOMEvents(true)
    @color = "#0FF"
    @size = 5

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
      @stage.update()


  drawRecognizedShape: (recognizedShape) ->
    self = this
    centroid = undefined

    if recognizedShape #the method wiil act just when there is a recognizedShape
      @stage.removeChild(@lastDraw)
      beautifulDrawGraphics = new createjs.Graphics()
      beautifulDraw = new createjs.Shape(beautifulDrawGraphics)
      beautifulDrawGraphics.beginStroke(self.color)

      @stage.addChild(beautifulDraw)
      @stage.update()


      label = recognizedShape.measures.canvas.label
      switch label
        when 'polyline'
          vertices = recognizedShape.measures.canvas.vertices
          for newVertex in vertices
            if !old
              old = newVertex
              continue
            beautifulDrawGraphics.beginStroke(self.color)
                                .setStrokeStyle(self.size, "round")
                                .moveTo(old.x,old.y)
                                .lineTo(newVertex.x,newVertex.y)
            @stage.update()

            # if(!pointToCentroidCalculation)
            #   pointToCentroidCalculation = new Array()
            # pointToCentroidCalculation.push(old)

            old = newVertex

          # centroid = @calculateCentroid(pointToCentroidCalculation)



          @stage.update()
        when 'ellipseArc' #TODO ADAPT THE OPERATION FOR A GENERAL ELLIPSE ARC
          center = recognizedShape.measures.canvas.center
          radius = recognizedShape.measures.canvas.minRadius
          startAngle = recognizedShape.measures.canvas.startAngle
          sweepAngle = recognizedShape.measures.canvas.sweepAngle
          endAngle = startAngle + sweepAngle

          if sweepAngle<=0
            anticlockwise = true
          else
            anticlockwise = false


          beautifulDrawGraphics.beginStroke(self.color)
                              .setStrokeStyle(self.size, "round")
                              .arc(center.x, center.y, radius, startAngle, endAngle,anticlockwise)
          # centroid = center
          # beautifulDraw.x = centroid.x
          # beautifulDraw.y = centroid.Y

          @stage.update()

        else
          return null

  # calculateCentroid: (pointToCentroidCalculation) ->
  #   sum = {x:0, y:0}
  #   pointsCounter=0
  #   vertices = pointToCentroidCalculation
  #   for vertex in vertices
  #     sum.x+=vertex.x
  #     sum.y+=vertex.y
  #     pointsCounter++
  #   centroid = {x:sum.x/pointsCounter, y:sum.y/pointsCounter}
  #   return centroid

  setLastBodyAxis: (body) ->
    id = body.id
    child = @stage.children[id]

    child.regX = body.centroid.x*30
    child.regY = body.centroid.y*30

    console.log 'body', body

    child.x+= child.regX
    child.y+= child.regY

  updateDraw: (bodyList) ->
    index = 0
    for child in @stage.children
      if(bodyList[index])

        child.x += bodyList[index].vx*(1/60)*30
        child.y += bodyList[index].vy*(1/60)*30

        child.rotation+= bodyList[index].angularVelocity*(1/60)*180/Math.PI
        index++
        @stage.update()
