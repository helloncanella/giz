/*jshint -W106, -W016*/
/*global Artist, Physics, b2Vec2, b2World, b2DebugDraw, requestAnimationFrame
, $*/
'use strict';

(function Controller() {

  var artist = new Artist('easeljs');

  (function waitDraw() {
    artist.draw().then(function(drawing) {
      console.log(drawing);
      waitDraw();
    });

  })();

  //- Physics's variables
  var gravity = new b2Vec2(0, 10),
    world = new b2World(gravity, false),
    scale = 30,
    physics = new Physics(world, scale),
    rate = 1 / 60;

  //-Building the Debug Draw
  (function debugDrawBuilder() {
    var context = $('canvas#box2dweb')[0].getContext('2d'),
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
    world.Step(rate, 10, 10);
    world.DrawDebugData();
    requestAnimationFrame(update);
  })();

})();
