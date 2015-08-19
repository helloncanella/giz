class box2dAgent
	constructor:(world)->
		@world = world
		@box2dEntity = new Object()

	transformTheGivenStrokeInABody: (stroke) ->
		@box2dEntity.definition =  new b2BodyDef
		@box2dEntity.definition.type = b2Body.b2_dynamicBody
		@box2dEntity.definition.userData = {id:stroke.id}

		console.log 'userData', @box2dEntity.definition.userData

		classifiedStroke = @classifyStroke(stroke)

		switch classifiedStroke
			when "polygon"
				strokeVertices = stroke.measures.vertexes
				bayazitDecomp = new bayazitDecomposer()
				bayazitPolygons = bayazitDecomp.concanveToconvex(strokeVertices)

				for polygon in bayazitPolygons
					poly2tri = new poly2triDecomposer()
					triangles = poly2tri.triangulate(polygon)
					console.log triangles

					if polygon.length>=8
						if !toBeRemoved
							toBeRemoved = new Array()
						toBeRemoved.push(polygon)
						triangulated = poly2triDecomposer.triangulate(polygon)

						if triangulated
							console.log 'triangulated',triangulated
						else
							console.log "not trianguleted", null


		# switch classifiedStroke
		#   when "polygon"
		# 		if ok
		# 			console.log 'caqui'
		#
		# 		polygonArray = new decomp.Polygon()
		# 		polygonArray.vertices.concat(transformIntoArray(strokeVertices))
		# 		console.log polygonArray.vertices
		#
		# 		transformIntoArray = (vertices) ->
		# 			for vertex in vertices
		# 				if !arrayOfVertices
		# 					arrayOfVertices = new Array()
		# 				arrayOfVertices.push([vertex.x,vertex.y])
		# 			return arrayOfVertices

		#   # when 'EDGE'
		#   # when 'CIRCLE'

		return this

	insertTheTransformedBodyInTheWorld: () ->
		if @box2dEntity.definition
			console.log 'body'
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
