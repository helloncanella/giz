/*jshint -W106, -W098*/
/*global self, b2Vec2, b2World, importScripts, Physics, Window*/
'use strict';
importScripts('workerScripts.js');

//- Physics's variables
var
  gravity = new b2Vec2(0, 10),
  world = new b2World(gravity, false),
  physics = new Physics(world),
  rate = 1 / 60,
  paused = true;

self.onmessage = function(e) {
  var message = e.data[0];

  switch (message) {
    case 'playPause':
      paused = e.data[1];
      break;
    case 'insertBody':
      var
        convertedShape = e.data[1],
        type = e.data[2];
      physics.insertIntoWorld(convertedShape, type);
      break;
    default:
      break;
  }


};

setInterval(function() {

  if (!paused) {
    world.Step(rate, 10, 10);

    var bodies = physics.getListOfBodies();
    self.postMessage(bodies);
  }

}, 1000 * rate);
