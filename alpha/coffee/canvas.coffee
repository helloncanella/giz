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
    size = 10
    self = this

    stage = new createjs.Stage(@canvasTag.id)
    stage.enableDOMEvents(true)

    shape = new createjs.Shape()

    stage.addChild(shape)

    color = "#0FF"

    stage.on 'stagemousedown', (event) ->
      self.isMouseDown = true

    stage.on 'stagemousemove', (event) ->
      if old and self.isMouseDown
        shape.graphics.beginStroke(color)
          .setStrokeStyle(size, "round")
          .moveTo(old.x, old.y)
          .lineTo(event.stageX, event.stageY)
        stage.update()
        self.strokeBundler.push({x:event.stageX,y:event.stageY})
      old =
        x: event.stageX
        y: event.stageY

    stage.on 'stagemouseup', (event) ->
      self.isMouseDown=false
      color = createjs.Graphics.getHSL(Math.random()*360, 100, 50)
