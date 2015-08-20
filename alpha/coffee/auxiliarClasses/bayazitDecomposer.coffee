class bayazitDecomposer

  concanveToconvex:(strokeVertices)->
    arrayOfVertices = @transformIntoArray(strokeVertices)
    polygonArray = new decomp.Polygon()

    for vertex in arrayOfVertices
      polygonArray.vertices.push(vertex)

    longerBayazitPolygons = polygonArray.decomp()
    @bayazitPoligons = longerBayazitPolygons

    for polygon in @bayazitPoligons
      polygon.makeCCW()

    return @bayazitPoligons

  transformIntoArray: (vertices) ->
    for vertex in vertices
      if !arrayOfVertices
        arrayOfVertices = new Array()
      arrayOfVertices.push([vertex.x,vertex.y])
    return arrayOfVertices
