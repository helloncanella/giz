var gravity, rate, scale, update, world;

importScripts('lib/box2dWeb.js', 'lib/bayazit.js', 'auxiliarClasses/bayazitDecomposer.js', 'auxiliarClasses/poly2triDecomposer.js', 'lib/poly2tri.js', 'box2dPreamble.js', 'box2dAgent.js');

gravity = new b2Vec2(0, 10);

world = new b2World(gravity, true);

rate = 1 / 60;

scale = 30;

self.onmessage = function(e) {
  var box2dAgentInstance, stroke;
  stroke = e.data;
  box2dAgentInstance = new box2dAgent(world, scale);
  return box2dAgentInstance.transformTheGivenStrokeInABody(stroke).insertTheTransformedBodyInTheWorld();
};

update = function() {
  var body, position;
  world.Step(rate, 10, 10);
  body = world.GetBodyList();
  if (body.GetUserData) {
    position = {
      x: body.GetPosition().x,
      y: body.GetPosition().y
    };
    console.log(position);
    return postMessage(position);
  }
};

setInterval(update, 1000 * rate);
