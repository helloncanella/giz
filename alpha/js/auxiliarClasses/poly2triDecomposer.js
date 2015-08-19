var poly2triDecomposer;

poly2triDecomposer = (function() {
  function poly2triDecomposer() {}

  poly2triDecomposer.prototype.triangulate = function(polygon) {
    var arrayOfTriangles, componentX, componentY, i, last, len, start, swctx, triangles, vertex, vertices;
    console.log('polygon', polygon);
    vertices = polygon.vertices;
    start = vertices[0];
    last = vertices[vertices.length - 1];
    if (start.x === last.x && start.y === last.y) {
      vertices.splice(last);
    }
    for (i = 0, len = vertices.length; i < len; i++) {
      vertex = vertices[i];
      if (!arrayOfTriangles) {
        arrayOfTriangles = new Array();
      }
      componentX = vertex[0];
      componentY = vertex[1];
      arrayOfTriangles.push(new poly2tri.Point(componentX, componentY));
    }
    console.log(arrayOfTriangles);
    swctx = new poly2tri.SweepContext(arrayOfTriangles);
    console.log('swctx', swctx);
    swctx.triangulate();
    triangles = swctx.getTriangles();
    return triangles;
  };

  return poly2triDecomposer;

})();
