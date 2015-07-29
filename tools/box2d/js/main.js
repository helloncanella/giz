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
      gravity = new b2Vec2(0, 9.8);
      console.log(this);
      this.world = new b2World(gravity, true);
      this.context = $('#b2dCanvas')[0].getContext('2d');
      this.scale = scale || 20;
      this.dtRemaining = 0;
      this.stepAmount = 1 / 60;
    };
    physics = void 0;
    moveState = void 0;
    init = function() {
      physics = window.physics = new Physics(document.getElementById('b2dCanvas'));
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
      new Body(physics, {
        type: 'static',
        x: 0,
        y: 0,
        height: 0.5,
        width: 60
      });
      new Body(physics, {
        type: 'static',
        x: 0,
        y: 25,
        height: 0.5,
        width: 60
      });
      new Body(physics, {
        x: 10,
        y: 10,
        angle: 0
      });
      requestAnimationFrame(gameLoop);
    };
    Physics.prototype.setControl = function() {
      var self;
      self = this;
      this.direction = {
        STOP: 0,
        LEFT: 1,
        RIGHT: 2
      };
      this.moveState = void 0;
      return $(window).keypress(function(event) {
        var key;
        key = String.fromCharCode(event.keyCode);
        console.log(self);
        switch (key) {
          case '4':
            return self.moveState = self.direction.LEFT;
          case '5':
            return self.moveState = self.direction.STOP;
          case '6':
            return self.moveState = self.direction.RIGHT;
        }
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
      }
      return body.SetLinearVelocity(vel);
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
      this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      this.world.SetDebugDraw(this.debugDraw);
    };
    Physics.prototype.step = function(dt) {
      var body;
      body = this.bodiesList()[0];
      this.move(body);
      this.dtRemaining += dt;
      while (this.dtRemaining > this.stepAmount) {
        this.dtRemaining -= this.stepAmount;
        this.world.Step(this.stepAmount, 10, 10);
      }
      if (this.debugDraw) {
        this.world.DrawDebugData();
      }
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
    window.addEventListener('load', init);
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
