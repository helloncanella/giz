/*jshint -W106, -W016, -W098,-W003*/
/*global Artist, Physics, Worker, b2Vec2, b2World, b2DebugDraw, requestAnimationFrame
, $, Converter, Limit, window*/
'use strict';



(function Controller(window) {

  var listOfDraw;

  var
    paused = true,
    scale = 100,
    physicsProxy = new Worker('scripts/physicsProxy.js'),
    canvasId = 'easeljs',
    artist = new Artist(canvasId),
    canvas = $('#' + canvasId),
    converter = new Converter(scale);

  activeDraw();

  function activeDraw() {

    if (paused) {
      artist.draw().then(function drawShape(shape) {

        //- Cloning object in order to not modify the original shape;
        var clonedShape = JSON.parse(JSON.stringify(shape));

        //- WORKER - TO PASS IN
        var convertedShape = converter.convert(clonedShape, 'box2d');

        physicsProxy.postMessage(['insertBody', convertedShape, 'dynamic']);
        activeDraw();
      });
    }
  }


  //XXX - REPLACE THE CODE BELLOW WITH BUTTONS
  $(window).on({
    keydown: function(e) {
      if (paused) {
        paused = false;
      } else {
        paused = true;
        activeDraw();
      }
      physicsProxy.postMessage(['playPause', paused]);
    }
  });


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
      physicsProxy.postMessage(['insertBody', convertedShape, 'static']);
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





})(window);
