importScripts('lib/box2dWeb.js', 'lib/bayazit.js', 'auxiliarClasses/bayazitDecomposer.js','auxiliarClasses/poly2triDecomposer.js', 'lib/poly2tri.js','box2dPreamble.js','box2dAgent.js')

gravity = new b2Vec2(0,10)
world = new b2World(gravity,true)
rate = 1/60
scale = 30
bodyList = undefined
box2dAgentInstance = undefined

self.onmessage = (e) ->
  stroke = e.data
  box2dAgentInstance = new box2dAgent(world,scale)
  box2dAgentInstance.transformTheGivenStrokeInABody(stroke)
                    .insertTheTransformedBodyInTheWorld()

  # update()

update =->
  world.Step(rate,10,10)
  if(box2dAgentInstance)
    postMessage(box2dAgentInstance.getBodyList())

setInterval(update,1000*rate)
