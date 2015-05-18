#Controller
class Brain
  constructor: () ->



  init: () ->
    @world = new World(10,50,{x:0,y:-10},false)
    @world.setWorld()
    @canvas= new CanvasView()
    @canvas.setCanvas()
    @inputHandler()
    0

  inputHandler: () ->  
    $(window).keydown (event) ->
      keyCode = event.which  

      body = new Body()  
      
      #print square
      if keyCode==83
        console.log("square")
      if keyCode==67
        console.log('circle')

    


#--------------------------------------------------------------------------------
#Model (data)
class Body
  
  contructor: (@type, ) ->
    @

class World
  constructor: (@width,@height,@gravity,@sleep) ->
  setWorld: () ->
    gravity = new b2Vec2(@gravity.x,@gravity.y)
    world = new b2World(gravity,@sleep)
    console.log(gravity,b2World)
    0
 

#--------------------------------------------------------------------------------

#View  
class CanvasView
  
  setCanvas: () ->
    $('canvas').remove()
    $('<canvas></canvas>').prependTo('body')

    canvas=$('canvas')
    width=@width=$(window).width()
    height=@height=$(window).height()

    self=this 
    $(window).resize () ->
      self.setCanvas() 
      0 
        
    canvas.attr({width:width, height:height})
    0
    
class BodyView
  contructor: () ->


giz = new Brain()
giz.init()
