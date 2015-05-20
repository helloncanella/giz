#Controller
class Brain
  constructor: (@worldHeight) ->

  init: () ->
    @worldDef = new World(10,50,{x:0,y:-10},false)
    @world = @worldDef.setWorld()
    @canvas= new CanvasView()
    @canvas.setCanvas()

    @scale = getCanvasWorldRatio()

    @bodiesArray = []
    inputHandler()
    0

  getCanvasWorldRatio: () ->
     return scale = @canvas.height/@worldHeight
   

  inputHandler: () ->  
    $(window).keydown (event) ->
      keyCode = event.which  
      
      #print square
      if keyCode==83
        shape = "circle"
        dimensions = {
          radius:Math.random()*5+0.1 
        }
      if keyCode==67
        shape = "square"
        dimensions = {
          side:Math.random()*5+0.1 
        }
      body = new Body(@world,shape,dimensions,@worldWidth,@wordHeight) 
      body.putBodyInTheWorld()
      @bodiesArray.push(body)
      0
      
    


#--------------------------------------------------------------------------------
#Model (data)
class Body
  
  contructor: (@world,@shape,@dimensions,@worldWidth,@wordHeight) ->
  putBodyInTheWorld: () ->
    randomX = Math.random()*@worldWidth
    randomY = Math.random()*@wordHeight  

    bodyDef = new b2BodyDef()
    bodyDef.type = Body.b2_dynamicBody
    bodyDef.position.Set(randomX,randomY)

    @body = @world.CreateBody(bodyDef)

    fixture = new FixtureDef()
    fixture.density = 1.0
    
    if @shap=="circle"
      fixture.shape = new b2CircleShape(@dimensions.radius)
    else if @shape=="square"
      halfSide = @dimensions.side/2
      fixture.shape = new b2PolygonShape()
      fixture.shape.SetAsBox(halfSide,halfSide)  

    @body.CreateFixture(fixture)
       
      

class World
  constructor: (@width,@height,@gravity,@sleep) ->
  setWorld: () ->
    gravity = new b2Vec2(@gravity.x,@gravity.y)
    world = new b2World(gravity,@sleep)
   
 

#--------------------------------------------------------------------------------

#View
class CanvasView
  
  setCanvas: () ->
    $('canvas').remove()
    $('<canvas></canvas>').prependTo('body')


    @canvas=$('canvas')
    width=@width=$(window).width()
    height=@height=$(window).height()

    self=this 
    $(window).resize () ->
      self.setCanvas() 
      0 
        
    @canvas.attr({width:width, height:height})
    0

    @context = @canvas[0].getContext('2d')
    
class BodyView
  contructor: () ->


giz = new Brain(30)
giz.init()
