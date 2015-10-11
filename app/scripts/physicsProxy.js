/*jshint -W106, -W098*/
/*global self, b2Vec2, b2World, importScripts, Physics, Window*/
'use strict';
importScripts('workerScripts.js');

//- Physics's variables
var
  gravity = new b2Vec2(0, 10),
  world = new b2World(gravity, false),
  physics = new Physics(world),
  rate = 1 / 60;

self.onmessage = function(e) {
  var
    convertedShape = e.data[0],
    type = e.data[1];

  physics.insertIntoWorld(convertedShape, type);
};



setInterval(function() {
  world.Step(rate, 10, 10);

  var bodies = physics.getListOfBodies();
  self.postMessage(bodies);

}, 1000 * rate);
