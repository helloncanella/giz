var Tracker;

Tracker = function() {
  this.mousePosition = void 0;
  this.isMouseDown = void 0;
  this.setMouseTracker = function(element) {
    var getMousePosition, self;
    self = this;
    console.log(element);
    element.mousedown(function(e) {
      self.isMouseDown = true;
      self.mousePosition = getMousePosition(e);
      return element.mousemove(function(e) {
        if (self.isMouseDown) {
          return self.mousePosition = getMousePosition(e);
        }
      });
    });
    element.mouseup(function(e) {
      return self.isMouseDown = false;
    });
    return getMousePosition = function(e) {
      var mouseX, mouseY;
      mouseX = e.clientX - element.offset().left;
      mouseY = e.clientY - element.offset().top;
      return {
        x: mouseX,
        y: mouseY
      };
    };
  };
};
