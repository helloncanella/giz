do ->
  b2Vec2 = Box2D.Common.Math.b2Vec2
  b2BodyDef = Box2D.Dynamics.b2BodyDef
  b2Body = Box2D.Dynamics.b2Body
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  b2Fixture = Box2D.Dynamics.b2Fixture
  b2World = Box2D.Dynamics.b2World
  b2MassData = Box2D.Collision.Shapes.b2MassData
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw
  
  Physics = 
  window.Physics = (element, scale) ->
    gravity = new b2Vec2(0, 0)
    
    
    @world = new b2World(gravity, true)
    console.log @world
    @context = $('#debug')[0].getContext('2d')
    @scale = scale or 20
    @dtRemaining = 0
    @stepAmount = 1/60
    return

  
  physics = undefined  
  moveState = undefined

  init = ->

    physics = window.physics = new Physics(document.getElementById('debug'))
    
    physics.setControl()

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

    # new Body(physics,
    #   type: 'static'
    #   x: 0
    #   y: 0
    #   height: 0.5
    #   width: 60)

    # new Body(physics,
    #   type: 'static'
    #   x: 0
    #   y: 25
    #   height: 0.5
    #   width: 60)
   
    #new Body(physics, x:10, y:10,angle:0)
    
    vertices = new Array()
    
    i=0
    while i<6
      angle=-i/6.0*2*Math.PI
      vertices[i]= new b2Vec2(Math.sin(angle),Math.cos(angle))
      i++

    vertices[0]=new b2Vec2(0,4) 
    
    # vertices[0]=new b2Vec2(0,0)
    # vertices[1]=new b2Vec2(10,0)
    

    new Body(physics, x:100/physics.scale, y:15, angle:0, shape:'polygon', points: vertices)

    console.log 100/physics.scale
 
    stage = new createjs.Stage("art")
    circle = new createjs.Shape()
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 5)
    circle.x = 100
    circle.y = 300
    stage.addChild(circle)

    console.log circle

    stage.update()

    requestAnimationFrame gameLoop
    return

  Physics::setControl = ->
    self = this    

    @direction = 
      STOP: 0
      LEFT: 1
      RIGHT: 2
      UP:3
      DOWN:4


    @moveState=undefined
    @remaingJumpSteps=undefined

    $(window).keypress((event) ->
      key = String.fromCharCode(event.keyCode)     
     
      switch key
        when '4' then self.moveState = self.direction.LEFT
        when '5' then self.moveState = self.direction.STOP
        when '6' then self.moveState = self.direction.RIGHT
        when '8' then self.moveState = self.direction.UP
        when '2' then self.moveState = self.direction.DOWN
        when 'j' then self.remainingJumpSteps=6
        when 'i'
          body = self.bodiesList()[0]
          impulse=body.GetMass()*10
          body.ApplyImpulse(new b2Vec2(0,-impulse), body.GetWorldCenter())      
 
      if(self.moveState) 
        console.log self.moveState
        body = self.bodiesList()[0]
        self.move(body)
    )
    
    $(window).mousedown((event)->
      width=$('canvas').width()
      height=$('canvas').height()

      mouseX=event.pageX
      mouseY=event.pageY

      body=self.bodiesList()[0]

      #console.log 'body', body

      console.log body.GetAngle()

      if mouseX<width and mouseY<height
        toTarget=
          x:mouseX/self.scale-body.GetPosition().x
          y:mouseY/self.scale-body.GetPosition().y

      angle=Math.atan2(toTarget.y,toTarget.x)
      console.log angle
      position=body.GetPosition()
      

      body.SetPositionAndAngle(position,angle-90*Math.PI/180)   

    )    

  Physics::move = (body)->
    vel = body.GetLinearVelocity()
    
    switch @moveState
      when @direction.LEFT then vel.x=-15    
      when @direction.STOP then vel.x=0     
      when @direction.RIGHT then vel.x=15
      when @direction.UP then vel.y=-15
      when @direction.DOWN then vel.y=15
    
    body.SetLinearVelocity(vel)

    return

  Physics::jump = (body)->
    console.log body.GetWorldCenter()


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
    @debugDraw.SetFlags b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit
    @world.SetDebugDraw @debugDraw
    return

  Physics::step = (dt) ->
    
    body=@bodiesList()[0]
    force = body.GetMass()*100/(1/60.0)
    force/=6.0      
    if(@remainingJumpSteps>0)
      body.ApplyForce(new b2Vec2(0,-force), body.GetWorldCenter())
      @remainingJumpSteps--
        
    @dtRemaining += dt
    while @dtRemaining > @stepAmount
      @dtRemaining -= @stepAmount
      @world.Step @stepAmount, 10, 10
    if @debugDraw
      @world.DrawDebugData()

    @world.ClearForces()

    

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
  


  window.gameLoop = ->

    tm = (new Date).getTime()
    requestAnimationFrame gameLoop
    dt = (tm - lastFrame) / 1000
    if dt > 1 / 15
      dt = 1 / 15
    physics.step dt 
    lastFrame = tm


  $(document).ready () ->
    init()

  
  
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