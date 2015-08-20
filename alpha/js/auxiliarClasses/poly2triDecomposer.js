var poly2triDecomposer;

poly2triDecomposer = (function() {
  function poly2triDecomposer() {}

  poly2triDecomposer.prototype.triangulateBayazitPolygon = function(polygon) {
    var arrayOfTriangles, componentX, componentY, i, j, lastPoint, len, len1, ref, startPoint, swctx, triangle, vertex, vertices;
    vertices = polygon.vertices;
    startPoint = vertices[0];
    lastPoint = vertices[vertices.length - 1];
    for (i = 0, len = vertices.length; i < len; i++) {
      vertex = vertices[i];
      if (!arrayOfTriangles) {
        arrayOfTriangles = new Array();
      }
      componentX = vertex[0];
      componentY = vertex[1];
      if (vertex !== lastPoint) {
        arrayOfTriangles.push(new poly2tri.Point(componentX, componentY));
      }
    }
    swctx = new poly2tri.SweepContext(arrayOfTriangles);
    swctx.triangulate();
    this.triangles = swctx.getTriangles();
    ref = this.triangles;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      triangle = ref[j];
      triangle.makeCCW();
    }
    return this.triangles;
  };

  return poly2triDecomposer;

})();
