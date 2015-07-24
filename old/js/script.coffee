#Auxiliar function
log = (logText) ->
  console.log logText

#Controller
class Brain
  constructor: (@worldHeight) ->

  init: () ->
    @worldDef = new World(10,50,{x:0,y:-10},false)
    @world = @worldDef.setWorld()
   

    @canvas= new CanvasView()
    @canvas.setCanvas()

    @context = @canvas.context

    @scale = @getCanvasWorldRatio()
    @worldWidth = @calculateWorldWidth()

    console.log 'WORLD DIMENSIONS', @worldWidth, @worldHeight 

    #Building Edges
    #   'start' and 'end' refer to a line whose start and end is defined by these variables
    #   the origin of my cartesian system [0,0] is the point fixed in the left-bottom corner
    log 'ok1'
    @dynamicBodiesArray = []
    @stickEdgesInTheWorld('top','left','right','bottom',{start:[20,10],end:[60,15]})  

    @inputHandler()
    @setButtons()
   
    
  getCanvasWorldRatio: () ->
   
    return scale = @canvas.height/@worldHeight
   
  calculateWorldWidth: ()->
    return @canvas.width/@scale

  stickEdgesInTheWorld: (edges...) ->
    log 'ok2'
    for edge in edges
      log edge
      if edge=='top'
        log edge
        log 'ok4'
        dimensions={start:[0,@worldHeight],end:[@worldWidth,@worldHeight]}
      else if edge=='right'
        dimensions={start:[@worldWidth,@worldHeight],end:[@worldWidth,0]} 
      else if edge=='bottom'    
        dimensions={start:[@worldWidth,0],end:[0,0]} 
      else if edge=='left'
        dimensions={start:[0,0],end:[0,@worldHeight]}
      else
        dimensions=edge

      log 'ok5' 
      body = new Body(@world,'static','edge',dimensions,@worldWidth,@worldHeight) 
       
      body.putBodyInTheWorld()
      @draw body
      @dynamicBodiesArray.push(body)

               
  inputHandler: () ->  
    $(window).keydown @keyDownEvent.bind(@)
    0

  keyDownEvent: (event)  ->
      keyCode = event.which  

      if keyCode is 83 or keyCode is 67 
        #print square
        if keyCode==67
          shape = "circle"
          dimensions = { 
            radius:Math.random()*5+0.1 
          }
        if keyCode==83
          shape = "square"
          dimensions = {
            side:Math.random()*5+0.1 
          } 

        body = new Body(@world,'dynamic',shape,dimensions,@worldWidth,@worldHeight) 
        #console.log('body', body)

        body.putBodyInTheWorld()
        @draw body
        @dynamicBodiesArray.push(body)
        #console.log @bodiesArray
        

  setButtons: () ->
        
    $('#play').click((()->
      @animation=requestAnimationFrame((()->@update(@)).bind @)
    ).bind @) 
  
    $('#pause').click((() ->
      alert @animation      
      cancelAnimationFrame @animation
    ).bind @)

    
  
  draw:(body)->
    worldPosition = body.getWorldPosition()
    canvasPosition = @convertWorldToCanvasFrame(@scale,worldPosition)  

    console.log body.getWorldVelocity()
      
    if body.shape is 'square'
      side = body.dimensions.side*@scale
      @context.rect((canvasPosition.x+side/2),(canvasPosition.y+side/2),side, side)
    if body.shape is 'circle'  
      radius = body.dimensions.radius*@scale
      @context.beginPath()
      @context.arc(canvasPosition.x, canvasPosition.y, radius, 0, 2*Math.PI)
    if body.shape is 'edge' 
      start={
        x:body.dimensions.start[0]*@scale
        y:body.dimensions.start[1]*@scale
      }
      end={
        x:body.dimensions.end[0]*@scale
        y:body.dimensions.end[1]*@scale
      }

      @context.beginPath();
      @context.moveTo(start.x,start.y);
      @context.lineTo(end.x, end.y);
       
    @context.stroke()   
   
  update: (self) ->

    @context.clearRect(0,0,@canvas.width,@canvas.height)   
    self.world.Step(1/60,10,10)

    
        
    for body in @dynamicBodiesArray
      @draw body

   
    self.world.ClearForces()
    
     
    requestAnimationFrame(()->
      self.animation = self.update(self)
    )
    0     
     
  convertWorldToCanvasFrame:(scale,worldPosition) ->
    return canvasPosition ={
      x: worldPosition.x*scale
      y: (@worldHeight - worldPosition.y)*scale 
    } 
      
        
    
      
    


#--------------------------------------------------------------------------------
#Model (data)
class Body
  constructor: (@world,@type,@shape,@dimensions,@worldWidth,@worldHeight) ->
  putBodyInTheWorld: () ->
    randomX = Math.random()*@worldWidth
    randomY = Math.random()*@worldHeight  
       
    bodyDef = new b2BodyDef()

    if @type=='dynamic'
      bodyDef.type = b2Body.b2_dynamicBody
    else
      bodyDef.type = b2Body.b2_staticBody

    bodyDef.position.Set(randomX,randomY)

   
    @body = @world.CreateBody(bodyDef)

    console.log 'corpão', @body 

    fixture = new b2FixtureDef()
    fixture.density = 1.0
    fixture.friction = 0.0;
    fixture.restitution = 0.2; 
    
    if @shape=="circle"
      fixture.shape = new b2CircleShape(@dimensions.radius)
    else if @shape=="square"
      halfSide = @dimensions.side/2 
      fixture.shape = new b2PolygonShape
      fixture.shape.SetAsBox(halfSide,halfSide)
    else if @shape=="edge"
      log 'ok5.9'
      start= new b2Vec2(@dimensions.start[0],@dimensions.start[1])
      log start
      log 'ok6'
      end= new b2Vec2(@dimensions.end[0],@dimensions.end[1])
      log end
      log 'ok7'
     
      fixture.shape= new b2PolygonShape
      fixture.shape.SetAsEdge(start,end)
      log fixture.shape
      log 'ok8'
  
      
    log 'ok9'
    @body.CreateFixture(fixture)
    log 'ok10'

  getWorldPosition: () ->
    return @body.GetPosition()

  getWorldVelocity: () -> 
    return @body.GetLinearVelocity()
      

class World
  constructor: (@width,@height,@gravity,@sleep) ->
  setWorld: () ->
    gravity = new b2Vec2(@gravity.x,@gravity.y)
    return world = new b2World(gravity,@sleep)
   
 

#--------------------------------------------------------------------------------

#View 
class CanvasView
  
  setCanvas: () ->
    $('canvas').remove()
    $('<canvas></canvas>').appendTo('body')

    @canvas=$('canvas')
       
    width=@width=$(window).width()
    height=@height=$(window).height()

    self=this 
    $(window).resize () ->
      self.setCanvas() 
      0 
   
    @canvas.attr({width:width, height:height})
    @context = @canvas[0].getContext('2d')




giz = new Brain(30)
giz.init()
