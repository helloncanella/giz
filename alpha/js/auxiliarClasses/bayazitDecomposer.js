var bayazitDecomposer;

bayazitDecomposer = (function() {
  function bayazitDecomposer() {}

  bayazitDecomposer.prototype.concanveToconvex = function(strokeVertices) {
    var arrayOfVertices, i, j, len, len1, longerBayazitPolygons, polygon, polygonArray, ref, vertex;
    arrayOfVertices = this.transformIntoArray(strokeVertices);
    polygonArray = new decomp.Polygon();
    for (i = 0, len = arrayOfVertices.length; i < len; i++) {
      vertex = arrayOfVertices[i];
      polygonArray.vertices.push(vertex);
    }
    longerBayazitPolygons = polygonArray.decomp();
    this.bayazitPoligons = longerBayazitPolygons;
    console.log('BAYAZIT', longerBayazitPolygons);
    ref = this.bayazitPoligons;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      polygon = ref[j];
      polygon.makeCCW();
    }
    return this.bayazitPoligons;
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
