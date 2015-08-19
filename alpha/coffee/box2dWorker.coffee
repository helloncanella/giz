importScripts('lib/box2dWeb.js','box2dPreamble.js','box2dAgent.js')

gravity = new b2Vec2(0,10)
world = new b2World(gravity,true)
rate = 1/60

self.onmessage = (e) ->
  stroke = e.data
  console.log  e.data
  box2dAgentInstance = new box2dAgent(world)
  box2dAgentInstance.transformTheGivenStrokeInABody(stroke)
               .insertTheTransformedBodyInTheWorld()


# update =->
#   world.Step(rate,10,10)
#   body = world.GetBodyList()
#
#   world.DrawDebugData()
#
#   if body.GetUserData
#     postMessage({x:body.GetPosition().x,y:body.GetPosition().y})
#
# setInterval(update,1000*rate)
