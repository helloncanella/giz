/*jshint unused:false*/
/*global Artist, Physics, jQuery, StrokeCollector, createjs, b2Vec2, b2World,
b2DebugDraw,*/
'use strict';
var drawMode;

var Controller = (function($, createjs, Artist) {

  //- Artist's variables
  var canvasId = 'easeljs',
    canvas = $('#' + canvasId),
    artist = new Artist(canvasId),
    strokeCollector = new StrokeCollector();

  //- Physics's variables
  var gravity = new b2Vec2(0, 10),
    world = new b2World(gravity, false),
    scale = 30,
    physics = new Physics(world,scale),
    rate = 1/60;

  //-Building the Debug Draw
  var context = $('canvas#box2dweb')[0].getContext('2d');

  var debugDraw = new b2DebugDraw();
  debugDraw.SetSprite(context);
  debugDraw.SetDrawScale(scale);
  debugDraw.SetFillAlpha 0.3
  debugDraw.SetLineThickness 1.0
  debugDraw.SetFlags b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit
  world.SetDebugDraw debugDraw

  //- Activing Canva's listeners
  canvas.on({
    mousedown: function() {
      drawMode = true;
    },
    mousemove: function(event) {
      if (drawMode) {
        var point = {
          x: event.offsetX,
          y: event.offsetY
        };
        strokeCollector.collect(point); // used in the enclosement of the shape
        artist.draw(point);
      }
    },
    mouseup: function(event) {
      drawMode = false;
      var stroke = strokeCollector.getStroke();

      //Override stroke data if it is closed
      stroke = artist.closeOpenedShape(stroke);

      artist.setShapeBounds()
        .setShapeListeners()
        .clearShapeReference();
    }
  });

})(jQuery, createjs, Artist);
