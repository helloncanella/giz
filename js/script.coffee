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

   

    @scale = @getCanvasWorldRatio()
    @worldWidth = @calculateWorldWidth()
    
    @bodiesArray = []
    @inputHandler()
    @setButtons()
    
    0
    
  getCanvasWorldRatio: () ->
   
    return scale = @canvas.height/@worldHeight
   
  calculateWorldWidth: ()->
    return @canvas.width/@scale
  
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
          
        body = new Body(@world,shape,dimensions,@worldWidth,@worldHeight) 
        #console.log('body', body)
       
        body.putBodyInTheWorld()
        @draw body
        @bodiesArray.push(body)
        #console.log @bodiesArray
        0 

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

    @context = @canvas.context
      
    if body.shape is 'square'
      side = body.dimensions.side*@scale
      @context.rect(canvasPosition.x, canvasPosition.y,side, side)
    if body.shape is 'circle'  
      radius = body.dimensions.radius*@scale
      @context.beginPath()
      @context.arc(canvasPosition.x, canvasPosition.y, radius, 0, 2*Math.PI)
 
    @context.stroke()   
   
  update: (self) ->

  
    self.world.Step(1/60,8,3)

    self.draw self.bodiesArray[0] 
      
    console.log self.bodiesArray[0].getWorldPosition()
    self.world.ClearForces(); 
   # for body in @bodiesArray
    #  @draw body
     # console.log body.getWorldPosition()
      
    requestAnimationFrame(()->
      self.animation = self.update(self)
    )
    0     

  test: () ->
    console.log olá 
    
  convertWorldToCanvasFrame:(scale,worldPosition) ->
    return canvasPosition ={
      x: worldPosition.x*scale
      y: worldPosition.y*scale
    } 
      
        
    
      
    


#--------------------------------------------------------------------------------
#Model (data)
class Body
  constructor: (@world,@shape,@dimensions,@worldWidth,@worldHeight) ->
  putBodyInTheWorld: () ->
    randomX = Math.random()*@worldWidth
    randomY = Math.random()*@worldHeight  
       
    bodyDef = new b2BodyDef()
    bodyDef.type = Body.b2_dynamicBody
    bodyDef.position.Set(randomX,randomY)

   
    @body = @world.CreateBody(bodyDef)

    fixture = new b2FixtureDef()
    fixture.density = 1.0
    
    if @shape=="circle"
      fixture.shape = new b2CircleShape(@dimensions.radius)
    else if @shape=="square"
      halfSide = @dimensions.side/2
      fixture.shape = new b2PolygonShape()
      fixture.shape.SetAsBox(halfSide,halfSide)  
    
    @body.CreateFixture(fixture)

  getWorldPosition: () ->
    return @body.GetPosition()
      

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
    
    return 0



giz = new Brain(30)
giz.init()
