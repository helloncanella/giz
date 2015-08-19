var gravity, rate, world;

importScripts('lib/box2dWeb.js', 'lib/bayazit.js', 'auxiliarClasses/bayazitDecomposer.js', 'auxiliarClasses/poly2triDecomposer.js', 'lib/poly2tri.js', 'box2dPreamble.js', 'box2dAgent.js');

gravity = new b2Vec2(0, 10);

world = new b2World(gravity, true);

rate = 1 / 60;

self.onmessage = function(e) {
  var box2dAgentInstance, stroke;
  stroke = e.data;
  console.log(e.data);
  box2dAgentInstance = new box2dAgent(world);
  return box2dAgentInstance.transformTheGivenStrokeInABody(stroke).insertTheTransformedBodyInTheWorld();
};
