class box2dAgent
  constructor:(world,scale)->
    @world = world
    @scale = scale
    @box2dEntity = new Object()

    # Temporary wall
    groundDef = new b2BodyDef()
    groundDef.position = new b2Vec2(0,24)
    fixture = new b2FixtureDef()
    shape = fixture.shape = new b2PolygonShape()
    shape.SetAsBox(40,0.5)
    @world.CreateBody(groundDef).CreateFixture(fixture)

  transformTheGivenStrokeInABody: (stroke) ->
    scaledStroke = @scaleStroke(stroke)

    bodyDef = @box2dEntity.definition = new b2BodyDef
    bodyDef.type = b2Body.b2_dynamicBody
    bodyDef.userData = {id:stroke.id}

    classifiedStroke = @classifyStroke(scaledStroke)

    # If last
    fixtureDefArray = @box2dEntity.fixtureDefArray = new Array()
    switch classifiedStroke
      when 'circle'
        fixture = new b2FixtureDef()
        circleShape = fixture.shape = new b2CircleShape()
        center = scaledStroke.measures.box2d.center
        bodyDef.position = new b2Vec2(center.x,center.y)
        circleShape.m_radius = scaledStroke.measures.box2d.maxRadius
        fixtureDefArray.push(fixture)

      when "polygon"
        strokeVertices = stroke.measures.box2d.vertices
        poly2triPolygon = new poly2triDecomposer()
        triangulatedPolygons = poly2triPolygon.triangulatePolygons(strokeVertices)

        for triangule in triangulatedPolygons
          if(!itensReadyToBox2d)
            itensReadyToBox2d = new Array()
          itensReadyToBox2d.push(triangule.transformResultToArrayFormat())

        centroid = @calculateCentroid(itensReadyToBox2d)

        bodyDef.position = new b2Vec2(centroid.x,centroid.y)

        for polygon in itensReadyToBox2d
          fixture = new b2FixtureDef()
          fixture.shape = new b2PolygonShape()
          b2Vertices = new Array()
          for vertex in polygon
            localVertex = {x:vertex.x - centroid.x, y: vertex.y - centroid.y}
            b2Vertices.push(new b2Vec2(localVertex.x,localVertex.y))

          # if the first point is equal to the last, delete it.
          # SetArray Method doesnt accept equal points
          start = 0
          last = (b2Vertices.length-1)
          if b2Vertices[start].x == b2Vertices[last].x and b2Vertices[start].y == b2Vertices[last].y
            b2Vertices.splice(last,1)

          fixture.shape.SetAsArray(b2Vertices,b2Vertices.length)
          fixtureDefArray.push(fixture)

      when 'edge'
        points = scaledStroke.measures.box2d.vertices
        precision = @scale/25 #adjust accordingly to necessities

        for point in points
          if !start
            start = new b2Vec2(point.x, point.y)
            continue
          next = new b2Vec2(point.x, point.y)

          distanceVector = new b2Vec2(next.x-start.x,next.y-start.y)
          distance = distanceVector.Length()

          if distance>=precision
            center = average = new b2Vec2((next.x+start.x)/2,(next.y+start.y)/2)
            angle = Math.atan2(distanceVector.y,distanceVector.x)
            fixture = new b2FixtureDef()
            fixture.shape = new b2PolygonShape()
            fixture.shape.SetAsOrientedBox(distance/2,0.2,center,angle)
            fixtureDefArray.push(fixture)
            start = next




    return this

  scaleStroke:(stroke) ->
    canvasMeasures = stroke.measures.canvas

		# Cloning objects
    stroke.measures.box2d = JSON.parse(JSON.stringify(canvasMeasures))
    box2dMeasures = stroke.measures.box2d

    for property, measure of canvasMeasures
      switch property
        when "center"
          center = box2dMeasures[property]
          center.x/=@scale
          center.y/=@scale
        when "vertices"
          vertices = box2dMeasures[property]
          for vertex in vertices
            vertex.x/=@scale
            vertex.y/=@scale
        when "maxRadius"
          box2dMeasures[property]/=@scale
        when "minRadius"
          box2dMeasures[property]/=@scale

    return stroke

  calculateCentroid: (polygonsArray) ->
    sum = {x:0, y:0}
    pointsCounter=0
    for polygon in polygonsArray
      for vertex in polygon
        sum.x+=vertex.x
        sum.y+=vertex.y
        pointsCounter++
    centroid = {x:sum.x/pointsCounter, y:sum.y/pointsCounter}
    return centroid

  insertTheTransformedBodyInTheWorld: () ->
    if @box2dEntity.fixtureDefArray
      fixtureArray = @box2dEntity.fixtureDefArray
      bodyDefinition = @box2dEntity.definition
      body = @world.CreateBody(bodyDefinition)
      for fixture in fixtureArray
        fixture.friction = 0.3
        fixture.density = 1
        body.CreateFixture(fixture)
    else
      console.error "There isn't any body defined"


  getBodyList: () ->
    bodyList = new Array()
    currentBody = @world.GetBodyList()
    while(currentBody)
      if typeof currentBody.GetUserData()!='undefined' && currentBody.GetUserData()!=null
        id = currentBody.GetUserData().id
        bodyList[id] =
          vx: currentBody.GetLinearVelocity().x
          vy: currentBody.GetLinearVelocity().y
          angularVelocity: currentBody.GetAngularVelocity()
          centroid: currentBody.GetWorldCenter()
          id: currentBody.GetUserData().id
      currentBody = currentBody.m_next
    return bodyList

  classifyStroke: (stroke) ->

    conditions = stroke.conditions

    weGotaEllipseArc = conditions.weGotaEllipseArc
    weGotaPolyline = conditions.weGotaPolyline
    weGotaUglyStroke = conditions.weGotaUglyStroke
    withDifferentRadius = conditions.withDifferentRadius
    withEqualRadius = conditions.withEqualRadius
    closed = conditions.closed
    opened = conditions.opened

    if opened or (weGotaEllipseArc and withDifferentRadius)
      return "edge"
    if weGotaPolyline and closed
      return "polygon"
    if weGotaEllipseArc and withEqualRadius and closed
      return "circle"
