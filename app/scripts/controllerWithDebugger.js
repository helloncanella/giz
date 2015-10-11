/*jshint -W106, -W016, -W098*/
/*global Artist, Physics, b2Vec2, b2World, b2DebugDraw, requestAnimationFrame
, $, Converter, Limit*/
'use strict';

(function Controller() {


  //- Physics's variables
  var
    gravity = new b2Vec2(0, 10),
    world = new b2World(gravity, false),
    scale = 100,
    physics = new Physics(world, scale),
    rate = 1 / 60;

  var artist = new Artist('easeljs');
  var converter = new Converter(scale);

  (function readyToDraw() {
    artist.draw().then(function(shape) {

      //- Cloning object in order to not modify the original shape;
      var clonedShape = JSON.parse(JSON.stringify(shape));

      var convertedShape = converter.convert(clonedShape, 'box2d');

      physics.insertIntoWorld(convertedShape, 'dynamic');

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
      physics.insertIntoWorld(convertedShape, 'static');
      var bodies = physics.getListOfBodies();
    });

  })();


  //-Building the Debug Draw
  (function debugDrawBuilder() {
    var
      context = $('canvas#box2dweb')[0].getContext('2d'),
      debugDraw = new b2DebugDraw();

    debugDraw.SetSprite(context);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
    world.SetDebugDraw(debugDraw);
  })();


  //- Running the world
  (function update() {
    // artist.stage.update();
    world.Step(rate, 10, 10);
    world.DrawDebugData();

    var bodies = physics.getListOfBodies();

    var listOfDraw = converter.convert(bodies,'canvas','angle');

    artist.update(listOfDraw,rate);

    requestAnimationFrame(update);
  })();

})();
