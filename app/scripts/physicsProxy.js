/*jshint -W106, -W098, -W003 */
/*global self, b2Vec2, b2Body, b2World, b2AABB, b2MouseJointDef,importScripts,
Physics, Window*/

'use strict';
importScripts('workerScripts.js');

var mouseJoint, indexSelectedBody, indexLastBody, position,
  mousePosition, selectedBody;

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
      var
        indexSelectedBody = e.data[1],
        position = e.data[2];

      if (!mouseJoint) {
        var
          body = getBodyAtMouse(position),
          md = new b2MouseJointDef();

        md.bodyA = world.GetGroundBody();
        md.bodyB = body;
        md.target.Set(position.x, position.y);
        md.m_collideConnected = true;
        md.maxForce = 50000.0 * body.GetMass();

        mouseJoint = world.CreateJoint(md);
        body.SetAwake(true);
      } else {
        mouseJoint.SetTarget(new b2Vec2(position.x, position.y));
      }
      break;

    case 'destroyJoint':
      if (mouseJoint) {
        world.DestroyJoint(mouseJoint);
        mouseJoint = null;
      }
      break;

    default:
  }



};

setInterval(function() {
  world.Step(rate, 10, 10);

  var bodies = physics.getCustomListOfBodies();
  self.postMessage(bodies);

}, 1000 * rate);


function getBodyAtMouse(position) {
  mousePosition = new b2Vec2(position.x, position.y);

  var aabb = new b2AABB();

  aabb.lowerBound.Set(position.x - 0.001, position.y - 0.001);
  aabb.upperBound.Set(position.x + 0.001, position.y + 0.001);

  // Query the world for overlapping shapes.
  selectedBody = null;
  world.QueryAABB(getBodyCB, aabb);

  return selectedBody;
}

function getBodyCB(fixture) {
  if (fixture.GetBody().GetType() !== b2Body.b2_staticBody) {
    if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePosition)) {
      selectedBody = fixture.GetBody();
      return false;
    }
  }
  return true;
}
