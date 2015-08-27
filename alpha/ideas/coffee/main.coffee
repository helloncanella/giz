drawMode = false
stage = new createjs.Stage("canvas")
shape = undefined
start = undefined
next = undefined
stroke = undefined
precision = 40
origin =
  x: 0
  y: 0


stage.on "stagemousedown", (event) ->
  drawMode = true

stage.on "stagemousemove", (event) ->

  if(drawMode)

    if(!shape)
      shape = new createjs.Shape()
      shape.x = event.stageX
      shape.y = event.stageY

      stroke = new Array()

      start = origin

      stroke.push(start)

      stage.addChild(shape)

      shape.graphics.beginStroke("red")
      stage.update()

    next =
      x: event.stageX-shape.x
      y: event.stageY-shape.y

    shape.graphics.lineTo(next.x,next.y)

    stage.update()

    stroke.push(next)


stage.on "stagemouseup", (event) ->
  drawMode=false

  last = stroke[(stroke.length-1)]
  distanceLastPointToOrigin = Math.sqrt(Math.pow((last.x-origin.x),2)+Math.pow((last.y-origin.y),2))

  if precision>distanceLastPointToOrigin
    shape.graphics.lineTo(origin.x,origin.y)

    for point in stroke
      if !reseted
        reseted = true
        shape.graphics.clear()
        shape.graphics.beginStroke("red").beginFill("red")
                      .moveTo(origin.x, origin.y)

      shape.graphics.lineTo(point.x,point.y)

      if point.x == last.x && point.y == last.y
        shape.graphics.lineTo(origin.x,origin.y).closePath()


  stage.update()

  aabbMeasures =  getAABB(stroke)

  topLeft =
    x:aabbMeasures.topLeft.x
    y:aabbMeasures.topLeft.y
  width = aabbMeasures.width
  height = aabbMeasures.height

  shape.setBounds(topLeft.x,topLeft.y,width,height)

  aShape = shape


  initialPosition=undefined
  aShape.on "pressmove", (event)->
    drawMode = false
    if (!initialPosition)
      initialPosition = new Object()
      initialPosition.x = event.stageX
      initialPosition.y = event.stageY
    else
      newPosition = new Object()
      newPosition.x = event.stageX
      newPosition.y = event.stageY

      delta = new Object()
      delta.x = newPosition.x - initialPosition.x
      delta.y = newPosition.y - initialPosition.y

      event.target.x += delta.x
      event.target.y += delta.y

      initialPosition = newPosition

    stage.update()

  stage.update()
  shape = null


getAABB = (stroke) ->
  i = 0
  while i < stroke.length
    point = stroke[i]
    if !lowest and !highest
      #cloning stroke[i]
      lowest = JSON.parse(JSON.stringify(point))
      highest = JSON.parse(JSON.stringify(point))
      i++
      continue
    if point.x > highest.x
      highest.x = point.x
    if point.x < lowest.x
      lowest.x = point.x
    if point.y > highest.y
      highest.y = point.y
    if point.y < lowest.y
      lowest.y = point.y
    i++

  aabb =
    topLeft:
      x: lowest.x
      y: lowest.y
    width: highest.x - (lowest.x)
    height: highest.y - (lowest.y)

  return aabb
