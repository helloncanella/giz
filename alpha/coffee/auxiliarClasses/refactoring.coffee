################################################################################
#  GOAL
#
#   1. Define if a shape is opened in the controller. If so, it won't be redrawn
#
################################################################################




################################################################################
# controller.coffee
#
#   1. Maintain name of the function classifyStrokeAndSetId
#   2. Mantain the output.
#   3. Change the the property uglyOrBeautiful
#   4. Make the convinient change in the lines 63 (beauty = strokeClassified.uglyOrBeautiful)
#    and in the condition "if beauty=='beautiful'"
#
##################################################################

weGotaUglyStroke X
weGotaEllipseArc
weGotaPolyline
opened
closed
withEqualRadius
withDifferentRadius

classifyStrokeAndSetId = (rawStroke, recognizedShape) ->

  # rawStroke can be the raw strokeBundler or the recognizedShape

  stroke = undefined
  stroke.measures.box2d = null

  if recognizedShape
    stroke.measures.canvas = recognizedShape

    label = recognizedShape.label
    switch label
      when 'polyline'
        vertices = recognizedShape.measures.box2d.vertices
        length = vertices.length
        startPoint = vertices[0]
        lastPoint = vertices[(length-1)]
        #conditions
        stroke.conditions=
          weGotaPolyline: true
          opened: (startPoint.x != lastPoint.x) and (startPoint.y != lastPoint.y)
          closed: !opened
      when 'ellipseArc'
        sweepAngle = recognizedShape.measures.box2d.sweepAngle
        maxRadius = recognizedShape.measures.box2d.maxRadius
        minRadius = recognizedShape.measures.box2d.minRadius
        #conditions
        stroke.conditions=
          weGotaEllipseArc: true
          opened: Math.round(Math.abs(sweepAngle)/(2*Math.PI))!=1
          closed: !opened
          withEqualRadius: minRadius == maxRadius
          withDifferentRadius: !withEqualRadius
  else
    stroke.measures.canvas = rawStroke
    stroke.conditions=
      weGotaUglyStroke: true

  if !stroke.id
    stroke.id = 0
  else
    stroke.id++

  return stroke

classifyStroke: (stroke) ->
  #verifying conditions


  if (weGotaEllipseArc or weGotaPolyline) and opened
    return "edge"
  if weGotaUglyStroke or ((weGotaPolyline or (weGotaEllipseArc and withDifferentRadius)) and closed)
    return "polygon"
  if weGotaEllipseArc and withEqualRadius and closed
    return "circle"







  ##################################################################

  # TO box2dAgent
  # 1. Maintain name of the function
  # 2. Maintain ifs in the bottom

  ##################################################################

  classifyStroke: (stroke) ->
    #verifying conditions
    label = stroke.measures.box2d.label
    switch label
      when 'polyline'
        vertices = stroke.measures.box2d.vertices
        length = vertices.length
        startPoint = vertices[0]
        lastPoint = vertices[(length-1)]
        #conditions
        weGotaPolyline= true
        opened= (startPoint.x != lastPoint.x) and (startPoint.y != lastPoint.y)
        closed= !opened
      when 'ellipseArc'
        sweepAngle = stroke.measures.box2d.sweepAngle
        maxRadius = stroke.measures.box2d.maxRadius
        minRadius = stroke.measures.box2d.minRadius
        #conditions
        weGotaEllipseArc= true
        opened= Math.round(Math.abs(sweepAngle)/(2*Math.PI))!=1
        closed= !opened
        withEqualRadius= minRadius == maxRadius
        withDifferentRadius= !withEqualRadius
      else
        weGotaUglyStroke = true


    if (weGotaEllipseArc or weGotaPolyline) and opened
      return "edge"
    if weGotaUglyStroke or ((weGotaPolyline or (weGotaEllipseArc and withDifferentRadius)) and closed)
      return "polygon"
    if weGotaEllipseArc and withEqualRadius and closed
      return "circle"
