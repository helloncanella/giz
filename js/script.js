// Generated by CoffeeScript 1.9.2
(function() {
  var Body, BodyView, Brain, CanvasView, World, giz;

  Brain = (function() {
    function Brain() {}

    Brain.prototype.init = function() {
      this.world = new World(10, 50, {
        x: 0,
        y: -10
      }, false);
      this.world.setWorld();
      this.canvas = new CanvasView();
      this.canvas.setCanvas();
      this.inputHandler();
      return 0;
    };

    Brain.prototype.inputHandler = function() {
      return $(window).keydown(function(event) {
        var body, keyCode;
        keyCode = event.which;
        body = new Body();
        if (keyCode === 83) {
          console.log("square");
        }
        if (keyCode === 67) {
          return console.log('circle');
        }
      });
    };

    return Brain;

  })();

  Body = (function() {
    function Body() {}

    Body.prototype.contructor = function(type) {
      this.type = type;
      return this;
    };

    return Body;

  })();

  World = (function() {
    function World(width1, height1, gravity1, sleep) {
      this.width = width1;
      this.height = height1;
      this.gravity = gravity1;
      this.sleep = sleep;
    }

    World.prototype.setWorld = function() {
      var gravity, world;
      gravity = new b2Vec2(this.gravity.x, this.gravity.y);
      world = new b2World(gravity, this.sleep);
      console.log(gravity, b2World);
      return 0;
    };

    return World;

  })();

  CanvasView = (function() {
    function CanvasView() {}

    CanvasView.prototype.setCanvas = function() {
      var canvas, height, self, width;
      $('canvas').remove();
      $('<canvas></canvas>').prependTo('body');
      canvas = $('canvas');
      width = this.width = $(window).width();
      height = this.height = $(window).height();
      self = this;
      $(window).resize(function() {
        self.setCanvas();
        return 0;
      });
      canvas.attr({
        width: width,
        height: height
      });
      return 0;
    };

    return CanvasView;

  })();

  BodyView = (function() {
    function BodyView() {}

    BodyView.prototype.contructor = function() {};

    return BodyView;

  })();

  giz = new Brain();

  giz.init();

}).call(this);
