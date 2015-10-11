/*jshint -W020, -W098*/
/*global AABB, createjs, drawMode,  ShapeFactory, $*/

'use strict';

function Artist(canvasId) {


  var shapeFactory = new ShapeFactory(canvasId, this.stage);

  this.shapeFactory = shapeFactory;

  var artist = this;

  this.draw = function() {

    var promise = new Promise(function(resolve) {
      shapeFactory.spawnShape().then(function(shape) {
        shape
          .prepare()
          .then(function(drawing) {
            drawing
              .setAABB()
              .setCentroid();
            resolve(drawing.data);
          });
      });
    });

    return promise;
  };

  this.update = function(bodyList) {

    var stage = this.shapeFactory.stage;

    var children = stage.children;

    for (var i = 0; i < children.length; i++) {
      var body = bodyList[i + 4];

      if (body) {
        children[i].x = body.x;
        children[i].y = body.y;
        children[i].rotation = body.angle;
      }

      stage.update();
    }
  };
}
