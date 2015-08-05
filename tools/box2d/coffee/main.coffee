do ->
  b2Vec2 = Box2D.Common.Math.b2Vec2
  b2BodyDef = Box2D.Dynamics.b2BodyDef
  b2Body = Box2D.Dynamics.b2Body

  b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint
  b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef

  b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint
  b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef

  b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint
  b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef

  b2Joint = Box2D.Dynamics.Joints.b2Joint
  b2JointDef = Box2D.Dynamics.Joints.b2JointDef

  b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint
  b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef

  b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint
  b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef

  b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint
  b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef

  b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint
  b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef

  b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint
  b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef

  b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint
  b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef

  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  b2Fixture = Box2D.Dynamics.b2Fixture
  b2World = Box2D.Dynamics.b2World
  b2MassData = Box2D.Collision.Shapes.b2MassData
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw

  Physics =
  window.Physics = (element, scale) ->
    gravity = new b2Vec2(0, 9.8)
    @world = new b2World(gravity, true)
    @context = $('#b2dCanvas')[0].getContext('2d')
    @scale = scale or 20
    @dtRemaining = 0
    @stepAmount = 1/60
    return


  physics = undefined

  init = ->

    physics = window.physics = new Physics(document.getElementById('b2dCanvas'))

    physics.debug()

    new Body(physics,
      type: 'static'
      x: 0
      y: 0
      height: 25
      width: 0.5)

    new Body(physics,
      type: 'static'
      x: 51
      y: 0
      height: 25
      width: 0.5)

    new Body(physics,
      type: 'static'
      x: 0
      y: 0
      height: 0.5
      width: 60)

    new Body(physics,
      type: 'static'
      x: 0
      y: 25
      height: 0.5
      width: 60)

    i=0
    bodies = new Array()
    while i<3
      bodies[i] = new Body(physics, x:20+i*10, y:10,angle:Math.PI/4.25, shape:'circle', radius:2)
      i++

    allBodies = physics.bodiesList()

    new Joint(physics,
      type:'distance'
      bodyA: allBodies[0]
      bodyB: allBodies[1]
    )

    body=allBodies[0]
    move = (moveState)  ->
      switch moveState
          when 'UP' then body.SetLinearVelocity(new b2Vec2(0,-25))
          when 'DOWN'  then body.SetLinearVelocity(new b2Vec2(0,25))
          when 'LEFT' then body.SetLinearVelocity(new b2Vec2(-25,0))
          when 'RIGHT' then body.SetLinearVelocity(new b2Vec2(25,0))

    window.addEventListener("keypress", (event) ->
      key=String.fromCharCode(event.keyCode)

      direction=
        LEFT:'LEFT'
        RIGHT:'RIGHT'
        UP:'UP'
        DOWN:'DOWN'

      switch key
        when '8' then moveState=direction.UP
        when '2' then moveState=direction.DOWN
        when '4' then moveState=direction.LEFT
        when '6' then moveState=direction.RIGHT

      move(moveState)
    )


    requestAnimationFrame gameLoop
    return

  Physics::bodiesList = ->
    list = new Array()

    i=0
    list[i]=obj= @world.GetBodyList()

    while obj
      i++
      list[i] = obj = obj.GetNext()

    return list

  Physics::debug = ->
    @debugDraw = new b2DebugDraw
    @debugDraw.SetSprite @context
    @debugDraw.SetDrawScale @scale
    @debugDraw.SetFillAlpha 0.3
    @debugDraw.SetLineThickness 1.0
    @debugDraw.SetFlags b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit
    @world.SetDebugDraw @debugDraw
    return

  Physics::step = (dt) ->
    @dtRemaining += dt
    while @dtRemaining > @stepAmount
      @dtRemaining -= @stepAmount
      @world.Step @stepAmount, 10, 10
    if @debugDraw
      @world.DrawDebugData()
    return

  Body =
  window.Body = (physics, details) ->

    @details = details = details or {}
    @definition = new b2BodyDef
    for k of @definitionDefaults
      @definition[k] = details[k] or @definitionDefaults[k]
    @definition.position = new b2Vec2(details.x or 0, details.y or 0)
    @definition.linearVelocity = new b2Vec2(details.vx or 0, details.vy or 0)
    @definition.userData = this

    switch details.type
      when 'static'
        @definition.type = b2Body.b2_staticBody
      when 'kinematic'
        @definition.type = b2Body.b2_kinematicBody
      else @definition.type = b2Body.b2_dynamicBody


    @body = physics.world.CreateBody(@definition)

    @fixtureDef = new b2FixtureDef
    for l of @fixtureDefaults
      @fixtureDef[l] = details[l] or @fixtureDefaults[l]
    details.shape = details.shape or @defaults.shape
    switch details.shape
      when 'circle'
        details.radius = details.radius or @defaults.radius
        @fixtureDef.shape = new b2CircleShape(details.radius)
      when 'polygon'
        @fixtureDef.shape = new b2PolygonShape
        @fixtureDef.shape.SetAsArray details.points, details.points.length
      when 'edge'
        @fixtureDef.shape = new b2PolygonShape
        @fixtureDef.shape.SetAsEdge details.points[0], details.points[1]
      else
        details.width = details.width or @defaults.width
        details.height = details.height or @defaults.height
        @fixtureDef.shape = new b2PolygonShape
        @fixtureDef.shape.SetAsBox details.width, details.height
        break
    @body.CreateFixture @fixtureDef

    return


  Body::defaults =
    shape: 'block'
    width: 2
    height: 2
    radius: 1
  Body::fixtureDefaults =
    density: 2
    friction: 1
    restitution: 0.2
  Body::definitionDefaults =
    active: true
    allowSleep: false
    angle: 0
    angularVelocity: 0
    awake: true
    bullet: false
    fixedRotation: false

  lastFrame = (new Date).getTime()


  Joint =
  window.Joint = (physics, jointDetails) ->

    bodyA = jointDetails.bodyA
    bodyB = jointDetails.bodyB
    anchorA = bodyA.GetWorldCenter()
    anchorB = bodyB.GetWorldCenter()

    jointType = jointDetails.type

    switch jointType
      when 'distance'
        jointDef = new b2DistanceJointDef()
        jointDef.Initialize(bodyA, bodyB, anchorA, anchorB)

    physics.world.CreateJoint(jointDef)

    return


  window.gameLoop = ->

    tm = (new Date).getTime()
    requestAnimationFrame gameLoop
    dt = (tm - lastFrame) / 1000
    if dt > 1 / 15
      dt = 1 / 15
    physics.step dt
    lastFrame = tm



  window.addEventListener 'load', init

  return




do ->
  lastTime = 0
  vendors = [
    'ms'
    'moz'
    'webkit'
    'o'
  ]
  x = 0
  while x < vendors.length and !window.requestAnimationFrame
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] or window[vendors[x] + 'CancelRequestAnimationFrame']
    ++x
  if !window.requestAnimationFrame

    window.requestAnimationFrame = (callback, element) ->
      currTime = (new Date).getTime()
      timeToCall = Math.max(0, 16 - (currTime - lastTime))
      id = window.setTimeout((->
        callback currTime + timeToCall
        return
      ), timeToCall)
      lastTime = currTime + timeToCall
      id

  if !window.cancelAnimationFrame

    window.cancelAnimationFrame = (id) ->
      clearTimeout id
      return

  return

# ---
# generated by js2coffee 2.1.0
