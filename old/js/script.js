// Generated by CoffeeScript 1.9.2
(function() {
  var Body, Brain, CanvasView, World, giz, log,
    slice = [].slice;

  log = function(logText) {
    return console.log(logText);
  };

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
      this.canvas = new CanvasView();
      this.canvas.setCanvas();
      this.context = this.canvas.context;
      this.scale = this.getCanvasWorldRatio();
      this.worldWidth = this.calculateWorldWidth();
      console.log('WORLD DIMENSIONS', this.worldWidth, this.worldHeight);
      log('ok1');
      this.dynamicBodiesArray = [];
      this.stickEdgesInTheWorld('top', 'left', 'right', 'bottom', {
        start: [20, 10],
        end: [60, 15]
      });
      this.inputHandler();
      return this.setButtons();
    };

    Brain.prototype.getCanvasWorldRatio = function() {
      var scale;
      return scale = this.canvas.height / this.worldHeight;
    };

    Brain.prototype.calculateWorldWidth = function() {
      return this.canvas.width / this.scale;
    };

    Brain.prototype.stickEdgesInTheWorld = function() {
      var body, dimensions, edge, edges, i, len, results;
      edges = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      log('ok2');
      results = [];
      for (i = 0, len = edges.length; i < len; i++) {
        edge = edges[i];
        log(edge);
        if (edge === 'top') {
          log(edge);
          log('ok4');
          dimensions = {
            start: [0, this.worldHeight],
            end: [this.worldWidth, this.worldHeight]
          };
        } else if (edge === 'right') {
          dimensions = {
            start: [this.worldWidth, this.worldHeight],
            end: [this.worldWidth, 0]
          };
        } else if (edge === 'bottom') {
          dimensions = {
            start: [this.worldWidth, 0],
            end: [0, 0]
          };
        } else if (edge === 'left') {
          dimensions = {
            start: [0, 0],
            end: [0, this.worldHeight]
          };
        } else {
          dimensions = edge;
        }
        log('ok5');
        body = new Body(this.world, 'static', 'edge', dimensions, this.worldWidth, this.worldHeight);
        body.putBodyInTheWorld();
        this.draw(body);
        results.push(this.dynamicBodiesArray.push(body));
      }
      return results;
    };

    Brain.prototype.inputHandler = function() {
      $(window).keydown(this.keyDownEvent.bind(this));
      return 0;
    };

    Brain.prototype.keyDownEvent = function(event) {
      var body, dimensions, keyCode, shape;
      keyCode = event.which;
      if (keyCode === 83 || keyCode === 67) {
        if (keyCode === 67) {
          shape = "circle";
          dimensions = {
            radius: Math.random() * 5 + 0.1
          };
        }
        if (keyCode === 83) {
          shape = "square";
          dimensions = {
            side: Math.random() * 5 + 0.1
          };
        }
        body = new Body(this.world, 'dynamic', shape, dimensions, this.worldWidth, this.worldHeight);
        body.putBodyInTheWorld();
        this.draw(body);
        return this.dynamicBodiesArray.push(body);
      }
    };

    Brain.prototype.setButtons = function() {
      $('#play').click((function() {
        return this.animation = requestAnimationFrame((function() {
          return this.update(this);
        }).bind(this));
      }).bind(this));
      return $('#pause').click((function() {
        alert(this.animation);
        return cancelAnimationFrame(this.animation);
      }).bind(this));
    };

    Brain.prototype.draw = function(body) {
      var canvasPosition, end, radius, side, start, worldPosition;
      worldPosition = body.getWorldPosition();
      canvasPosition = this.convertWorldToCanvasFrame(this.scale, worldPosition);
      console.log(body.getWorldVelocity());
      if (body.shape === 'square') {
        side = body.dimensions.side * this.scale;
        this.context.rect(canvasPosition.x + side / 2, canvasPosition.y + side / 2, side, side);
      }
      if (body.shape === 'circle') {
        radius = body.dimensions.radius * this.scale;
        this.context.beginPath();
        this.context.arc(canvasPosition.x, canvasPosition.y, radius, 0, 2 * Math.PI);
      }
      if (body.shape === 'edge') {
        start = {
          x: body.dimensions.start[0] * this.scale,
          y: body.dimensions.start[1] * this.scale
        };
        end = {
          x: body.dimensions.end[0] * this.scale,
          y: body.dimensions.end[1] * this.scale
        };
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
      }
      return this.context.stroke();
    };

    Brain.prototype.update = function(self) {
      var body, i, len, ref;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      self.world.Step(1 / 60, 10, 10);
      ref = this.dynamicBodiesArray;
      for (i = 0, len = ref.length; i < len; i++) {
        body = ref[i];
        this.draw(body);
      }
      self.world.ClearForces();
      requestAnimationFrame(function() {
        return self.animation = self.update(self);
      });
      return 0;
    };

    Brain.prototype.convertWorldToCanvasFrame = function(scale, worldPosition) {
      var canvasPosition;
      return canvasPosition = {
        x: worldPosition.x * scale,
        y: (this.worldHeight - worldPosition.y) * scale
      };
    };

    return Brain;

  })();

  Body = (function() {
    function Body(world1, type, shape1, dimensions1, worldWidth, worldHeight) {
      this.world = world1;
      this.type = type;
      this.shape = shape1;
      this.dimensions = dimensions1;
      this.worldWidth = worldWidth;
      this.worldHeight = worldHeight;
    }

    Body.prototype.putBodyInTheWorld = function() {
      var bodyDef, end, fixture, halfSide, randomX, randomY, start;
      randomX = Math.random() * this.worldWidth;
      randomY = Math.random() * this.worldHeight;
      bodyDef = new b2BodyDef();
      if (this.type === 'dynamic') {
        bodyDef.type = b2Body.b2_dynamicBody;
      } else {
        bodyDef.type = b2Body.b2_staticBody;
      }
      bodyDef.position.Set(randomX, randomY);
      this.body = this.world.CreateBody(bodyDef);
      console.log('corpão', this.body);
      fixture = new b2FixtureDef();
      fixture.density = 1.0;
      fixture.friction = 0.0;
      fixture.restitution = 0.2;
      if (this.shape === "circle") {
        fixture.shape = new b2CircleShape(this.dimensions.radius);
      } else if (this.shape === "square") {
        halfSide = this.dimensions.side / 2;
        fixture.shape = new b2PolygonShape;
        fixture.shape.SetAsBox(halfSide, halfSide);
      } else if (this.shape === "edge") {
        log('ok5.9');
        start = new b2Vec2(this.dimensions.start[0], this.dimensions.start[1]);
        log(start);
        log('ok6');
        end = new b2Vec2(this.dimensions.end[0], this.dimensions.end[1]);
        log(end);
        log('ok7');
        fixture.shape = new b2PolygonShape;
        fixture.shape.SetAsEdge(start, end);
        log(fixture.shape);
        log('ok8');
      }
      log('ok9');
      this.body.CreateFixture(fixture);
      return log('ok10');
    };

    Body.prototype.getWorldPosition = function() {
      return this.body.GetPosition();
    };

    Body.prototype.getWorldVelocity = function() {
      return this.body.GetLinearVelocity();
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
      $('<canvas></canvas>').appendTo('body');
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
      return this.context = this.canvas[0].getContext('2d');
    };

    return CanvasView;

  })();

  giz = new Brain(30);

  giz.init();

}).call(this);