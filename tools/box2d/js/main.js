(function() {
  (function() {
    var Body, Physics, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2PolygonShape, b2Vec2, b2World, init, lastFrame, moveState, physics;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2Body = Box2D.Dynamics.b2Body;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2Fixture = Box2D.Dynamics.b2Fixture;
    b2World = Box2D.Dynamics.b2World;
    b2MassData = Box2D.Collision.Shapes.b2MassData;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    Physics = window.Physics = function(element, scale) {
      var gravity;
      gravity = new b2Vec2(0, 0);
      this.world = new b2World(gravity, true);
      console.log(this.world);
      this.context = $('#debug')[0].getContext('2d');
      this.scale = scale || 20;
      this.dtRemaining = 0;
      this.stepAmount = 1 / 60;
    };
    physics = void 0;
    moveState = void 0;
    init = function() {
      var angle, circle, i, stage, vertices;
      physics = window.physics = new Physics(document.getElementById('debug'));
      physics.setControl();
      physics.debug();
      new Body(physics, {
        type: 'static',
        x: 0,
        y: 0,
        height: 25,
        width: 0.5
      });
      new Body(physics, {
        type: 'static',
        x: 51,
        y: 0,
        height: 25,
        width: 0.5
      });
      vertices = new Array();
      i = 0;
      while (i < 6) {
        angle = -i / 6.0 * 2 * Math.PI;
        vertices[i] = new b2Vec2(Math.sin(angle), Math.cos(angle));
        i++;
      }
      vertices[0] = new b2Vec2(0, 4);
      new Body(physics, {
        x: 100 / physics.scale,
        y: 15,
        angle: 0,
        shape: 'polygon',
        points: vertices
      });
      console.log(100 / physics.scale);
      stage = new createjs.Stage("art");
      circle = new createjs.Shape();
      circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 5);
      circle.x = 100;
      circle.y = 300;
      stage.addChild(circle);
      console.log(circle);
      stage.update();
      requestAnimationFrame(gameLoop);
    };
    Physics.prototype.setControl = function() {
      var self;
      self = this;
      this.direction = {
        STOP: 0,
        LEFT: 1,
        RIGHT: 2,
        UP: 3,
        DOWN: 4
      };
      this.moveState = void 0;
      this.remaingJumpSteps = void 0;
      $(window).keypress(function(event) {
        var body, impulse, key;
        key = String.fromCharCode(event.keyCode);
        switch (key) {
          case '4':
            self.moveState = self.direction.LEFT;
            break;
          case '5':
            self.moveState = self.direction.STOP;
            break;
          case '6':
            self.moveState = self.direction.RIGHT;
            break;
          case '8':
            self.moveState = self.direction.UP;
            break;
          case '2':
            self.moveState = self.direction.DOWN;
            break;
          case 'j':
            self.remainingJumpSteps = 6;
            break;
          case 'i':
            body = self.bodiesList()[0];
            impulse = body.GetMass() * 10;
            body.ApplyImpulse(new b2Vec2(0, -impulse), body.GetWorldCenter());
        }
        if (self.moveState) {
          console.log(self.moveState);
          body = self.bodiesList()[0];
          return self.move(body);
        }
      });
      return $(window).mousedown(function(event) {
        var angle, body, height, mouseX, mouseY, position, toTarget, width;
        width = $('canvas').width();
        height = $('canvas').height();
        mouseX = event.pageX;
        mouseY = event.pageY;
        body = self.bodiesList()[0];
        console.log(body.GetAngle());
        if (mouseX < width && mouseY < height) {
          toTarget = {
            x: mouseX / self.scale - body.GetPosition().x,
            y: mouseY / self.scale - body.GetPosition().y
          };
        }
        angle = Math.atan2(toTarget.y, toTarget.x);
        console.log(angle);
        position = body.GetPosition();
        return body.SetPositionAndAngle(position, angle - 90 * Math.PI / 180);
      });
    };
    Physics.prototype.move = function(body) {
      var vel;
      vel = body.GetLinearVelocity();
      switch (this.moveState) {
        case this.direction.LEFT:
          vel.x = -15;
          break;
        case this.direction.STOP:
          vel.x = 0;
          break;
        case this.direction.RIGHT:
          vel.x = 15;
          break;
        case this.direction.UP:
          vel.y = -15;
          break;
        case this.direction.DOWN:
          vel.y = 15;
      }
      body.SetLinearVelocity(vel);
    };
    Physics.prototype.jump = function(body) {
      return console.log(body.GetWorldCenter());
    };
    Physics.prototype.bodiesList = function() {
      var i, list, obj;
      list = new Array();
      i = 0;
      list[i] = obj = this.world.GetBodyList();
      while (obj) {
        i++;
        list[i] = obj = obj.GetNext();
      }
      return list;
    };
    Physics.prototype.debug = function() {
      this.debugDraw = new b2DebugDraw;
      this.debugDraw.SetSprite(this.context);
      this.debugDraw.SetDrawScale(this.scale);
      this.debugDraw.SetFillAlpha(0.3);
      this.debugDraw.SetLineThickness(1.0);
      this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
      this.world.SetDebugDraw(this.debugDraw);
    };
    Physics.prototype.step = function(dt) {
      var body, force;
      body = this.bodiesList()[0];
      force = body.GetMass() * 100 / (1 / 60.0);
      force /= 6.0;
      if (this.remainingJumpSteps > 0) {
        body.ApplyForce(new b2Vec2(0, -force), body.GetWorldCenter());
        this.remainingJumpSteps--;
      }
      this.dtRemaining += dt;
      while (this.dtRemaining > this.stepAmount) {
        this.dtRemaining -= this.stepAmount;
        this.world.Step(this.stepAmount, 10, 10);
      }
      if (this.debugDraw) {
        this.world.DrawDebugData();
      }
      this.world.ClearForces();
    };
    Body = window.Body = function(physics, details) {
      var k, l;
      this.details = details = details || {};
      this.definition = new b2BodyDef;
      for (k in this.definitionDefaults) {
        this.definition[k] = details[k] || this.definitionDefaults[k];
      }
      this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
      this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
      this.definition.userData = this;
      switch (details.type) {
        case 'static':
          this.definition.type = b2Body.b2_staticBody;
          break;
        case 'kinematic':
          this.definition.type = b2Body.b2_kinematicBody;
          break;
        default:
          this.definition.type = b2Body.b2_dynamicBody;
      }
      this.body = physics.world.CreateBody(this.definition);
      this.fixtureDef = new b2FixtureDef;
      for (l in this.fixtureDefaults) {
        this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
      }
      details.shape = details.shape || this.defaults.shape;
      switch (details.shape) {
        case 'circle':
          details.radius = details.radius || this.defaults.radius;
          this.fixtureDef.shape = new b2CircleShape(details.radius);
          break;
        case 'polygon':
          this.fixtureDef.shape = new b2PolygonShape;
          this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
          break;
        case 'edge':
          this.fixtureDef.shape = new b2PolygonShape;
          this.fixtureDef.shape.SetAsEdge(details.points[0], details.points[1]);
          break;
        default:
          details.width = details.width || this.defaults.width;
          details.height = details.height || this.defaults.height;
          this.fixtureDef.shape = new b2PolygonShape;
          this.fixtureDef.shape.SetAsBox(details.width, details.height);
          break;
      }
      this.body.CreateFixture(this.fixtureDef);
    };
    Body.prototype.defaults = {
      shape: 'block',
      width: 2,
      height: 2,
      radius: 1
    };
    Body.prototype.fixtureDefaults = {
      density: 2,
      friction: 1,
      restitution: 0.2
    };
    Body.prototype.definitionDefaults = {
      active: true,
      allowSleep: false,
      angle: 0,
      angularVelocity: 0,
      awake: true,
      bullet: false,
      fixedRotation: false
    };
    lastFrame = (new Date).getTime();
    window.gameLoop = function() {
      var dt, tm;
      tm = (new Date).getTime();
      requestAnimationFrame(gameLoop);
      dt = (tm - lastFrame) / 1000;
      if (dt > 1 / 15) {
        dt = 1 / 15;
      }
      physics.step(dt);
      return lastFrame = tm;
    };
    $(document).ready(function() {
      return init();
    });
  })();

  (function() {
    var lastTime, vendors, x;
    lastTime = 0;
    vendors = ['ms', 'moz', 'webkit', 'o'];
    x = 0;
    while (x < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      ++x;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = (new Date).getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout((function() {
          callback(currTime + timeToCall);
        }), timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  })();

}).call(this);
