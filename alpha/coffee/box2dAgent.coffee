class box2dAgent
	constructor:(world)->
		@world = world
		@box2dEntity = new Object()

	transformTheGivenStrokeInABody: (stroke) ->
		@box2dEntity.definition =  new b2BodyDef
		@box2dEntity.definition.type = b2Body.b2_dynamicBody
		@box2dEntity.definition.userData = {id:stroke.id}

		classifiedStroke = @classifyStroke(stroke)

		switch classifiedStroke

			when "polygon"
				strokeVertices = stroke.measures.vertexes
				bayazitDecomp = new bayazitDecomposer()
				bayazitPolygons = bayazitDecomp.concanveToconvex(strokeVertices)

				for polygon in bayazitPolygons
					if !toBeRemoved and !toBeAdded
						toBeRemoved = new Array()
						toBeAdded = new Array()

					#Convert using poly2tri in case of the bayazit polygon have more tha 8 sides (limit of box2d)
					if polygon.length>=8
						toBeRemoved.push(polygon)
						poly2triPolygon = new poly2triDecomposer()
						triangulatedPolygons = poly2triPolygon.triangulateBayazitPolygon(polygon)
						for triangulated in triangulatedPolygons
							toBeAdded.push(triangulated)

				for item in toBeRemoved
					bayazitPolygons.slice(item)

				newPolygonArray = new Array().concat(bayazitPolygons,toBeAdded)
				for item in newPolygonArray
					if(!itensReadyToBox2d)
						itensReadyToBox2d = new Array()
					itensReadyToBox2d.push(item.transformResultToArrayFormat())
				console.log itensReadyToBox2d	
		return this

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
				vertices = stroke.measures.vertexes
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
