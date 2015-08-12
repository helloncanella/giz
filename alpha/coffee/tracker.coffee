Tracker = ->
  @mousePosition = undefined
  @isMouseDown = undefined

  @setMouseTracker =  (element) ->
    self =this
    console.log element

    element.mousedown (e) ->
      self.isMouseDown=true
      self.mousePosition = getMousePosition(e)
      element.mousemove (e) ->
        if(self.isMouseDown)
          self.mousePosition = getMousePosition(e)

    element.mouseup (e) ->
      self.isMouseDown=false

    getMousePosition = (e) ->
      mouseX = e.clientX - element.offset().left
      mouseY = e.clientY - element.offset().top
      return {x: mouseX, y:mouseY}

  return
