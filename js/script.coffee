#Controller
class Brain
  constructor: () ->

  init: () ->
    @worldData = new WorldData(10,50,{x:0,y:-10},false)
    @canvas= new CanvasView()
    @canvas.setCanvas()



#--------------------------------------------------------------------------------
#Model (data)
class BodyData
  contructor: () ->

class WorldData
  constructor: (@width,@height,@gravity,@sleep) ->


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
