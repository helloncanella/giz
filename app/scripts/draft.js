/*jshint -W106, -W098*/
/*global self, b2Vec2, b2World, b2MouseJointDef,importScripts,
Physics, Window*/

'use strict';
importScripts('workerScripts.js');

var mouseJoint, indexSelectedBody, indexLastBody;

var
  gravity = new b2Vec2(0, 10),
  world = new b2World(gravity, false),
  physics = new Physics(world),
  rate = 1 / 60;

self.onmessage = function(e) {

  var message = e.data[0];

  switch (message) {

    case 'insertBody':
      var
        convertedShape = e.data[1],
        type = e.data[2];

      physics.insertIntoWorld(convertedShape, type);
      break;

    case 'moveBody':

      indexSelectedBody = e.data[1];

      if(indexLastBody){
        if(indexLastBody !== indexSelectedBody && mouseJoint){
          world.DestroyJoint(mouseJoint);
          mouseJoint = null;
        }
      }

      var position = e.data[2];

      if (!mouseJoint) {
        var
          body = physics.getListOfBodies()[indexSelectedBody],
          md = new b2MouseJointDef();

        md.bodyA = world.GetGroundBody();
        md.bodyB = body;
        md.target.Set(position.x, position.y);
        md.collideConnected = true;
        md.maxForce = 300.0 * body.GetMass();
        mouseJoint = world.CreateJoint(md);
        body.SetAwake(true);
      }else {
        mouseJoint.SetTarget(new b2Vec2(position.x, position.y));
      }

      indexLastBody = indexSelectedBody;

      break;

    default:
  }

};

setInterval(function() {
  world.Step(rate, 10, 10);

  var bodies = physics.getCustomListOfBodies();
  self.postMessage(bodies);

}, 1000 * rate);
