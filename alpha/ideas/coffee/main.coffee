canvas = $('canvas')[0]
isMouseDown = false

stage = new createjs.Stage("canvas")
shape = undefined
start = undefined
next = undefined
stroke = undefined

stage.on "stagemousedown", (event) ->
  isMouseDown = true
  shape = new createjs.Shape()
  shape.x = event.stageX
  shape.y = event.stageY

  console.log shape.x, shape.y

  stroke = new Array()

  start =
    x: 0
    y: 0

  stroke.push(start)

  stage.addChild(shape)

stage.on "stagemousemove", (event) ->
  if(isMouseDown)
    next =
      x: event.stageX-shape.x
      y: event.stageY-shape.y

    shape.graphics.beginStroke("red").moveTo(start.x,start.y).lineTo(next.x,next.y)
    console.log next.x, next.y

    stage.update()

    stroke.push(next)

    start = next



stage.on "stagemouseup", (event) ->
  isMouseDown=false

  console.log 'shape', shape
  #
  # graphics = shape.graphics
  # stage.removeChild(shape)
  #
  # aabbMeasures =  getAABB(stroke)
  # topLeft =
  #   x:aabbMeasures.x
  #   y:aabbMeasures.y
  # width = aabbMeasures.width
  # height = aabbMeasures.height
  #
  # console.log graphics
  # counter = 0
  # for item in graphics.instructions
  #   if(item.x && item.y)
  #     console.log counter, item
  #     counter++
  #
  # # aabbShape = new createjs.Shape(#graphics#)
  # # aabbShape.setBounds(topLeft.x,topLeft.y,width)
  #
  #
  # stage.addChild(aabbShape)
  # stage.update()
  # console.log 'mouseup'


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


# function getAABB(stroke) {
#
#   console.log('stroke',stroke);
#
#   for (var i = 0; i < stroke.length; i++) {
#     point = stroke[i];
#
#     console.log('stroke['+i+']',point);
#
#     if (!lowest && !highest) {
#       //cloning stroke[i]
#       var lowest = JSON.parse(JSON.stringify(point));
#       var highest = JSON.parse(JSON.stringify(point));
#       continue
#     }
#
#     if (point.x > highest.x) {
#       highest.x = point.x
#     }
#     if (point.x < lowest.x) {
#       lowest.x = point.x
#     }
#     if (point.y > highest.y) {
#       highest.y = point.y
#     }
#     if (point.y < lowest.y) {
#       lowest.y = point.y
#     }
#   }
#
#   aabb = {
#     topLeft: {
#       x: lowest.x,
#       y: highest.y
#     },
#     width: highest.x - lowest.x,
#     height: highest.y - lowest.y
#   }
#
#   console.log('AABB FUNCTION', aabb)
#   return aabb
# }
