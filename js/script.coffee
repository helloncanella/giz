#Controller
class Brain
  constructor: (@worldHeight) ->

  init: () ->
    @worldDef = new World(10,50,{x:0,y:-10},false)
    @world = @worldDef.setWorld()
    console.log('world',@world)

    @canvas= new CanvasView()
    @canvas.setCanvas()

    @scale = @getCanvasWorldRatio()

    @bodiesArray = []
    @inputHandler()
    0

  getCanvasWorldRatio: () ->
    console.log("canvas's height",@canvas.height)
    return scale = @canvas.height/@worldHeight
   

  inputHandler: () ->  
    $(window).keydown @keyDownEvent.bind(@)
    0

  keyDownEvent: (event)  ->
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
        
      console.log('world',@world)

      body = new Body(@world,shape,dimensions,@worldWidth,@wordHeight) 
      #console.log('body', body)
    
      console.log 'this', this

      body.putBodyInTheWorld()
      @bodiesArray.push(body)
      #console.log @bodiesArray
      0
   
      
    


#--------------------------------------------------------------------------------
#Model (data)
class Body
  constructor: (@world,@shape,@dimensions,@worldWidth,@wordHeight) ->
  putBodyInTheWorld: () ->
    randomX = Math.random()*@worldWidth
    randomY = Math.random()*@wordHeight  

    console.log 'random',@worldWidth,randomY

    ##console.log 'this', this
    ##console.log 'height', @worldWidth
    ##console.log 'worldInsideBody',@world
    
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

    ##console.log('shape',this.shape)
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

    ##console.log 'canvas', @
class BodyView
  contructor: () ->


giz = new Brain(30)
giz.init()
