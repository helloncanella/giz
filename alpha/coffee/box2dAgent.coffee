class box2dAgent
	constructor:(world)->
		@world = world
		@box2dEntity = new Object()

	transformTheGivenStrokeInABody: (stroke) ->
		@box2dEntity.definition =  new b2BodyDef
		@box2dEntity.definition.type = b2Body.b2_dynamicBody
		@box2dEntity.definition.userData = {id:stroke.id}

		console.log 'userData', @box2dEntity.definition.userData

		@classifyStroke(stroke)

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
				vertexes = stroke.measures.vertexes
				length = vertexes.length
				startPoint = vertexes[0]
				lastPoint = vertexes[(length-1)]
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
			console.log "EDGE"
		if weGotaUglyStroke or ((weGotaPolyline or (weGotaEllipseArc and withDifferentRadius)) and closed)
			console.log "POLYGON"
		if weGotaEllipseArc and withEqualRadius and closed
			console.log "CIRCLE"
