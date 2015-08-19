class bayazitDecomposer

  concanveToconvex:(strokeVertices)->
    arrayOfVertices = @transformIntoArray(strokeVertices)
    polygonArray = new decomp.Polygon()


    for vertex in arrayOfVertices
      polygonArray.vertices.push(vertex)

    quickBayazitPolygons=polygonArray.quickDecomp()
    longerBayazitPolygons = polygonArray.decomp()
    bayazitPoligons = longerBayazitPolygons



    return bayazitPoligons

  transformIntoArray: (vertices) ->
    for vertex in vertices
      if !arrayOfVertices
        arrayOfVertices = new Array()
      arrayOfVertices.push([vertex.x,vertex.y])
    return arrayOfVertices
