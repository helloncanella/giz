/*jshint -W106, -W016, -W098*/
/*global Artist, Physics, Worker, b2Vec2, b2World, b2DebugDraw, requestAnimationFrame
, $, Converter, Limit, Circle*/
'use strict';

(function Controller() {

  var listOfDraw, selectedBody;

  var
    canvasId = 'easeljs',
    canvas = $('#' + canvasId),
    scale = 100,
    physicsProxy = new Worker('scripts/physicsProxy.js'),
    artist = new Artist(canvasId),
    stage = artist.stage,
    converter = new Converter(scale);

  (function borders() {
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();

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

  (function readyToDraw() {
    artist.draw().then(

      function onSucess(shape) {
        var
          clonedShape = JSON.parse(JSON.stringify(shape)),
          convertedShape = converter.convert(clonedShape, 'box2d');
        physicsProxy.postMessage(['insertBody', convertedShape, 'dynamic']);
        readyToDraw();
      },

      function onFail(message) {
        console.log(message);
      }

    );
  })();

  physicsProxy.onmessage = function(e) {
    var bodies = e.data;
    listOfDraw = converter.convert(bodies, 'canvas', 'angle');
  };

  (function update() {

    //- Hook
    var
      selectedBody = stage.selectedChild,
      index = selectedBody;

    if (index === 0 || selectedBody) {
      var position = {
        x: stage.mouseX,
        y: stage.mouseY
      };

      var scaledPosition = converter.convert(Object.assign({}, position), 'box2d');
      physicsProxy.postMessage(['moveBody', selectedBody + 4, scaledPosition]);

      canvas.mouseup(function() {
        physicsProxy.postMessage(['destroyJoint']);
      });
    }

    //-Update World
    if (listOfDraw) {
      artist.update(listOfDraw);
    }

    requestAnimationFrame(update);
  })();



})();
