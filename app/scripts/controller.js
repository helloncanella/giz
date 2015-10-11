/*jshint -W106, -W016, -W098*/
/*global Artist, Physics, Worker, b2Vec2, b2World, b2DebugDraw, requestAnimationFrame
, $, Converter, Limit*/
'use strict';

(function Controller() {

  var listOfDraw;

  var
    scale = 100,
    physicsProxy = new Worker('scripts/physicsProxy.js'),
    artist = new Artist('easeljs'),
    converter = new Converter(scale);

  (function readyToDraw() {
    artist.draw().then(function(shape) {

      //- Cloning object in order to not modify the original shape;
      var clonedShape = JSON.parse(JSON.stringify(shape));

      //- WORKER - TO PASS IN
      var convertedShape = converter.convert(clonedShape, 'box2d');

      physicsProxy.postMessage([convertedShape, 'dynamic']);

      readyToDraw();
    });
  })();

  (function borders() {
    var canvasWidth = $('#easeljs').width();
    var canvasHeight = $('#easeljs').height();

    var bottom = new Limit({
      x: 10,
      y: canvasHeight - 10
    }, canvasWidth - 10, 10);
    var left = new Limit({
      x: 0,
      y: 0
    }, 10, canvasHeight);
    var right = new Limit({
      x: (canvasWidth - 10),
      y: 0
    }, 10, canvasHeight);

    var limits = [bottom, left, right];

    limits.forEach(function(limit) {
      var convertedShape = converter.convert(limit.data, 'box2d');
      physicsProxy.postMessage([convertedShape, 'static']);
    });

  })();

  physicsProxy.onmessage = function(e){
    var bodies = e.data;
    listOfDraw = converter.convert(bodies, 'canvas', 'angle');
  };

  (function update () {
    if(listOfDraw){
      artist.update(listOfDraw);
    }
    requestAnimationFrame(update);
  })();




})();
