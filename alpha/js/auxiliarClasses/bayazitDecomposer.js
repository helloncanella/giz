var bayazitDecomposer;

bayazitDecomposer = (function() {
  function bayazitDecomposer() {}

  bayazitDecomposer.prototype.concanveToconvex = function(strokeVertices) {
    var arrayOfVertices, bayazitPoligons, i, len, longerBayazitPolygons, polygonArray, quickBayazitPolygons, vertex;
    arrayOfVertices = this.transformIntoArray(strokeVertices);
    polygonArray = new decomp.Polygon();
    for (i = 0, len = arrayOfVertices.length; i < len; i++) {
      vertex = arrayOfVertices[i];
      polygonArray.vertices.push(vertex);
    }
    quickBayazitPolygons = polygonArray.quickDecomp();
    longerBayazitPolygons = polygonArray.decomp();
    bayazitPoligons = longerBayazitPolygons;
    return bayazitPoligons;
  };

  bayazitDecomposer.prototype.transformIntoArray = function(vertices) {
    var arrayOfVertices, i, len, vertex;
    for (i = 0, len = vertices.length; i < len; i++) {
      vertex = vertices[i];
      if (!arrayOfVertices) {
        arrayOfVertices = new Array();
      }
      arrayOfVertices.push([vertex.x, vertex.y]);
    }
    return arrayOfVertices;
  };

  return bayazitDecomposer;

})();
