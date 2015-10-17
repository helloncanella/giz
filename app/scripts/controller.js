/*jshint -W106, -W016, -W098*/
/*global Artist, Physics, Worker, b2Vec2, b2World, b2DebugDraw, requestAnimationFrame
, $, Converter, Limit, Circle*/
'use strict';

(function Controller() {

  var listOfDraw;

  var
    scale = 100,
    physicsProxy = new Worker('scripts/physicsProxy.js'),
    artist = new Artist('easeljs'),
    stage = artist.stage,
    converter = new Converter(scale);


  (function circleInsertions() {

    function random (number){
      return Math.round(number*Math.random());
    }

    var
      number = random(70),
      shapeArray = [],
      i = 1,
      canvas = $('canvas#easeljs');

    while(i <= number){
      var circle = new Circle({
        x: random(canvas.width()),
        y: random(canvas.height())
      }, random(50)+20);

      circle.increaseRadius();

      stage.addChild(circle);

      circle.setBounds();

      circle.setCentroid();

      //- Cloning object in order to not modify the original shape;
      var clonedShape = JSON.parse(JSON.stringify(circle.data));

      //- WORKER - TO PASS IN
      var convertedShape = converter.convert(clonedShape, 'box2d');

      physicsProxy.postMessage([convertedShape, 'dynamic']);

      i++;
    }

    console.log(i);

    stage.update();
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

  physicsProxy.onmessage = function(e) {
    var bodies = e.data;
    listOfDraw = converter.convert(bodies, 'canvas', 'angle');
  };

  (function update() {
    if (listOfDraw) {
      artist.update(listOfDraw);
    }
    requestAnimationFrame(update);
  })();



})();
