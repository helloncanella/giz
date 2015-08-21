class box2dAgent
	constructor:(world,scale)->
		@world = world
		@scale = scale
		@box2dEntity = new Object()

	transformTheGivenStrokeInABody: (stroke) ->

		scaledStroke = @scaleStroke(stroke)

		bodyDef = @box2dEntity.definition =  new b2BodyDef
		bodyDef.type = b2Body.b2_dynamicBody
		bodyDef.userData = {id:stroke.id}

		classifiedStroke = @classifyStroke(scaledStroke)

		# If last

		switch classifiedStroke

			when "polygon"
				strokeVertices = stroke.measures.vertices
				bayazitDecomp = new bayazitDecomposer()
				bayazitPolygons = bayazitDecomp.concanveToconvex(strokeVertices)

				for polygon in bayazitPolygons
					if !toBeRemoved and !toBeAdded
						toBeRemoved = new Array()
						toBeAdded = new Array()

					#Convert using poly2tri in case of the bayazit polygon have more tha 8 sides (limit of box2d)
					if polygon.vertices.length>=8 #XXX
						toBeRemoved.push(polygon)
						poly2triPolygon = new poly2triDecomposer()
						triangulatedPolygons = poly2triPolygon.triangulateBayazitPolygon(polygon)
						for triangulated in triangulatedPolygons
							toBeAdded.push(triangulated)

				for item in toBeRemoved #remove polygon with more than or equal to 8 sides
					index = bayazitPolygons.indexOf(item)
					bayazitPolygons.splice(index,1)

				newPolygonArray = new Array().concat(bayazitPolygons,toBeAdded)
				for item in newPolygonArray
					if(!itensReadyToBox2d)
						itensReadyToBox2d = new Array()
					itensReadyToBox2d.push(item.transformResultToArrayFormat())



				centroid = @calculateCentroid(itensReadyToBox2d)
				bodyDef.position = new b2Vec2(centroid.x,centroid.y)



				@fixtureDefArray = new Array()
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
					@fixtureDefArray.push(fixture)


		console.log this
		return this

	scaleStroke:(stroke) ->
		vertices = stroke.measures.vertices
		for vertex in vertices
			vertex.x /= @scale
			vertex.y /= @scale
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
		if @box2dEntity.definition
		else
		  console.error "There isn't any body defined"
		return this

	classifyStroke: (stroke) ->
		#verifying conditions
		label = stroke.measures.label
		switch label
			when 'polyline'
				vertices = stroke.measures.vertices
				length = vertices.length
				startPoint = vertices[0]
				lastPoint = vertices[(length-1)]
				#conditions
				weGotaPolyline= true
				opened= (startPoint.x != lastPoint.x) and (startPoint.y != lastPoint.y)
				closed= !opened
			when 'ellipseArc'
				sweepAngle = stroke.measures.sweepAngle
				maxRadius = stroke.measures.maxRadius
				minRadius = stroke.measures.minRadius
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
