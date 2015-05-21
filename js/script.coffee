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
    @setButtons()
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

  setButtons:()->
    @animation = $('#play').click requestAnimationFrame @update.bind @
    $('#pause').click cancelAnimationFrame @animation

  draw:(body)->
    worldPosition = body.getWorldPosition()
    canvasPosition = convertWorldToCanvasFrame(@scale,worldPosition)  

    if body.shape is 'square'
      side = body.dimensions.side
      @context.rect(canvasPosition.x, canvasPosition.y,side, side)
    if body.shape is 'circle'  
      radius = body.dimensions.radius
      @context.beginPath()
      @context.arc(canvasPosition.x, canvasPosition.y, radius, 0, 2*Math.PI)
 
    @context.stroke()   

  update:()->
    for body in @bodiesArray
      @draw body
      @animation = requestAnimationFrame @update.bind @   
       
   
  convertWorldToCanvasFrame:(scale,worldPosition) ->
    return canvasPosition ={
      x: worldPosition.x*scale
      y: worldPosition.y*scale
    } 
      
        
    
      
    


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

    return 0
    ##console.log 'canvas', @
class BodyView
  contructor: () ->


giz = new Brain(30)
giz.init()
