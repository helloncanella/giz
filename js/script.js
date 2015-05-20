// Generated by CoffeeScript 1.9.2
(function() {
  var Body, BodyView, Brain, CanvasView, World, giz;

  Brain = (function() {
    function Brain(worldHeight) {
      this.worldHeight = worldHeight;
    }

    Brain.prototype.init = function() {
      this.worldDef = new World(10, 50, {
        x: 0,
        y: -10
      }, false);
      this.world = this.worldDef.setWorld();
      console.log('world', this.world);
      this.canvas = new CanvasView();
      this.canvas.setCanvas();
      this.scale = this.getCanvasWorldRatio();
      this.bodiesArray = [];
      this.inputHandler();
      return 0;
    };

    Brain.prototype.getCanvasWorldRatio = function() {
      var scale;
      console.log("canvas's height", this.canvas.height);
      return scale = this.canvas.height / this.worldHeight;
    };

    Brain.prototype.inputHandler = function() {
      $(window).keydown(this.keyDownEvent.bind(this));
      return 0;
    };

    Brain.prototype.keyDownEvent = function(event) {
      var body, dimensions, keyCode, shape;
      keyCode = event.which;
      if (keyCode === 83) {
        shape = "circle";
        dimensions = {
          radius: Math.random() * 5 + 0.1
        };
      }
      if (keyCode === 67) {
        shape = "square";
        dimensions = {
          side: Math.random() * 5 + 0.1
        };
      }
      console.log('world', this.world);
      body = new Body(this.world, shape, dimensions, this.worldWidth, this.wordHeight);
      console.log('this', this);
      body.putBodyInTheWorld();
      this.bodiesArray.push(body);
      return 0;
    };

    return Brain;

  })();

  Body = (function() {
    function Body(world1, shape1, dimensions1, worldWidth, wordHeight) {
      this.world = world1;
      this.shape = shape1;
      this.dimensions = dimensions1;
      this.worldWidth = worldWidth;
      this.wordHeight = wordHeight;
    }

    Body.prototype.putBodyInTheWorld = function() {
      var bodyDef, fixture, halfSide, randomX, randomY;
      randomX = Math.random() * this.worldWidth;
      randomY = Math.random() * this.wordHeight;
      console.log('random', this.worldWidth, randomY);
      bodyDef = new b2BodyDef();
      bodyDef.type = Body.b2_dynamicBody;
      bodyDef.position.Set(randomX, randomY);
      this.body = this.world.CreateBody(bodyDef);
      fixture = new b2FixtureDef();
      fixture.density = 1.0;
      if (this.shape === "circle") {
        fixture.shape = new b2CircleShape(this.dimensions.radius);
      } else if (this.shape === "square") {
        halfSide = this.dimensions.side / 2;
        fixture.shape = new b2PolygonShape();
        fixture.shape.SetAsBox(halfSide, halfSide);
      }
      return this.body.CreateFixture(fixture);
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
      return world = new b2World(gravity, this.sleep);
    };

    return World;

  })();

  CanvasView = (function() {
    function CanvasView() {}

    CanvasView.prototype.setCanvas = function() {
      var height, self, width;
      $('canvas').remove();
      $('<canvas></canvas>').prependTo('body');
      this.canvas = $('canvas');
      width = this.width = $(window).width();
      height = this.height = $(window).height();
      self = this;
      $(window).resize(function() {
        self.setCanvas();
        return 0;
      });
      this.canvas.attr({
        width: width,
        height: height
      });
      0;
      return this.context = this.canvas[0].getContext('2d');
    };

    return CanvasView;

  })();

  BodyView = (function() {
    function BodyView() {}

    BodyView.prototype.contructor = function() {};

    return BodyView;

  })();

  giz = new Brain(30);

  giz.init();

}).call(this);
