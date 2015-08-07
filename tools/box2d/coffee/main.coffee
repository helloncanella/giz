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

    #forklift
    m_bodyA = new Body(physics, x:10, y:20, width: 5, height:3, density:1000).body
    m_bodyB = new Body(physics, x:17.5, y:20, width: 1, height:4).body
    m_wheel1= new Body(physics, x:17.5, y:20, shape:'circle', radius:2, density:20).body
    m_wheel2= new Body(physics, x:17.5, y:20, shape:'circle', radius:2, density:20).body


    joint1 = new Joint(physics,
                      kind:'prismatic'
                      bodyA: m_bodyA
                      bodyB: m_bodyB
                      localAnchorA: new b2Vec2(6,2)
                      localAnchorB: new b2Vec2(-1,3)
                      collideConnected: true
                      localAxisA: new b2Vec2(0,1)
                      enableLimit:true
                      lowerTranslation:-25
                      upperTranslation:-3
                      # enableMotor:true
                      # maxMotorForce:350
                      # motorSpeed:-5000000
                      )
    wheelJoint1 = new Joint(physics,
                            kind:'revolute'
                            bodyA: m_bodyA
                            bodyB: m_wheel1
                            localAnchorA: new b2Vec2(5,3)
                            localAnchorB: new b2Vec2(0,0)
                            )

    wheelJoint2 = new Joint(physics,
                            kind:'revolute'
                            bodyA: m_bodyA
                            bodyB: m_wheel2
                            localAnchorA: new b2Vec2(-5,3)
                            localAnchorB: new b2Vec2(0,0)
                            )

    allBodies = physics.bodiesList()
    move = (body, moveState)  ->
      switch moveState
          when 'LEFT' then body.SetLinearVelocity(new b2Vec2(-10,0))
          when 'RIGHT' then body.SetLinearVelocity(new b2Vec2(10,0))
          when 'UP' then body.SetLinearVelocity(new b2Vec2(0,-10))
          when 'DOWN' then body.SetLinearVelocity(new b2Vec2(0,10))


    window.addEventListener("keypress", (event) ->
      key=String.fromCharCode(event.keyCode)

      direction=
        LEFT:'LEFT'
        RIGHT:'RIGHT'
        UP:'UP'
        DOWN:'DOWN'

      switch key
        when '8'
          moveState=direction.UP
          body=allBodies[2] #XXX
        when '2'
          moveState=direction.DOWN
          body=allBodies[2] #XXX
        when '4'
          moveState=direction.LEFT
          body=allBodies[3] #XXX
        when '6'
          moveState=direction.RIGHT
          body=allBodies[3] #XXX

      move(body, moveState)
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
    anchorA = jointDetails.anchorA or null
    anchorB = jointDetails.anchorB or null
    jointType = jointDetails.kind

    switch jointType
      when 'distance'
        jointDef = new b2DistanceJointDef()
      when 'revolute'
        jointDef = new b2RevoluteJointDef()
      when 'prismatic'
        jointDef = new b2PrismaticJointDef()
        localAxisA = jointDetails.localAxisA or null
        localAnchorA= jointDetails.localAnchorA or null
        localAnchorB= jointDetails.localAnchorB or null
        if localAxisA
          normal = localAxisA.Normalize()
          jointDetails.localAxisA.x = localAxisA.x/normal
          jointDetails.localAxisA.y = localAxisA.y/normal
      when 'line'
        jointDef = new b2LineJointDef()
      when 'weld'
        jointDef = new b2WeldJointDef()
      when 'pulley'
        jointDef = new b2PulleyJointDef()
      when 'friction'
        jointDef = new b2FrictionJointDef()
      when 'gear'
        jointDef = new b2GearJointDef()
      when 'mouse'
        jointDef = new b2MouseJointDef()

    #the property will assigned to jointDef just it exists in that object
    for k of jointDetails when jointDef.hasOwnProperty(k)
      jointDef[k]=jointDetails[k]

    console.log jointDef

    @b2Joint = physics.world.CreateJoint(jointDef)

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
