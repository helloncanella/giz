(function() {
  var Body, Joint, Physics, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2DistanceJoint, b2DistanceJointDef, b2Fixture, b2FixtureDef, b2FrictionJoint, b2FrictionJointDef, b2GearJoint, b2GearJointDef, b2Joint, b2JointDef, b2LineJoint, b2LineJointDef, b2MassData, b2MouseJoint, b2MouseJointDef, b2PolygonShape, b2PrismaticJoint, b2PrismaticJointDef, b2PulleyJoint, b2PulleyJointDef, b2RevoluteJoint, b2RevoluteJointDef, b2Vec2, b2WeldJoint, b2WeldJointDef, b2World, init, lastFrame, physics;
  b2Vec2 = Box2D.Common.Math.b2Vec2;
  b2BodyDef = Box2D.Dynamics.b2BodyDef;
  b2Body = Box2D.Dynamics.b2Body;
  b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint;
  b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
  b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint;
  b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef;
  b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint;
  b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef;
  b2Joint = Box2D.Dynamics.Joints.b2Joint;
  b2JointDef = Box2D.Dynamics.Joints.b2JointDef;
  b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint;
  b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;
  b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint;
  b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
  b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;
  b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
  b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint;
  b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef;
  b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
  b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
  b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint;
  b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
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
    this.world = new b2World(gravity, true);
    this.context = $('#b2dCanvas')[0].getContext('2d');
    this.scale = scale || 20;
    this.dtRemaining = 0;
    this.stepAmount = 1 / 60;
  };
  physics = void 0;
  init = function() {
    var allBodies, bodies, body, i, move;
    physics = window.physics = new Physics(document.getElementById('b2dCanvas'));
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
    i = 0;
    bodies = new Array();
    while (i < 1) {
      bodies[i] = new Body(physics, {
        x: 20 + i * 10,
        y: 10,
        angle: Math.PI / 4.25,
        shape: 'circle',
        radius: 2
      });
      i++;
    }
    allBodies = physics.bodiesList();
    body = allBodies[0];
    move = function(moveState) {
      switch (moveState) {
        case 'LEFT':
          return body.SetLinearVelocity(new b2Vec2(-25, 0));
        case 'RIGHT':
          return body.SetLinearVelocity(new b2Vec2(25, 0));
      }
    };
    window.addEventListener("keypress", function(event) {
      var direction, key, moveState;
      key = String.fromCharCode(event.keyCode);
      direction = {
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
        UP: 'UP',
        DOWN: 'DOWN'
      };
      switch (key) {
        case '8':
          moveState = direction.UP;
          break;
        case '2':
          moveState = direction.DOWN;
          break;
        case '4':
          moveState = direction.LEFT;
          break;
        case '6':
          moveState = direction.RIGHT;
      }
      return move(moveState);
    });
    requestAnimationFrame(gameLoop);
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
  Joint = window.Joint = function(physics, jointDetails) {
    var anchorA, anchorB, bodyA, bodyB, jointDef, jointType, k, worldAxis;
    bodyA = jointDetails.bodyA;
    bodyB = jointDetails.bodyB;
    anchorA = jointDetails.anchorA || null;
    anchorB = jointDetails.anchorB || null;
    jointType = jointDetails.kind;
    switch (jointType) {
      case 'distance':
        jointDef = new b2DistanceJointDef();
        break;
      case 'revolute':
        jointDef = new b2RevoluteJointDef();
        break;
      case 'prismatic':
        jointDef = new b2PrismaticJointDef();
        worldAxis = jointDetails.worldAxis;
        jointDef.Initialize(bodyA, bodyB, anchorA, worldAxis);
        break;
      case 'line':
        jointDef = new b2LineJointDef();
        break;
      case 'weld':
        jointDef = new b2WeldJointDef();
        break;
      case 'pulley':
        jointDef = new b2PulleyJointDef();
        break;
      case 'friction':
        jointDef = new b2FrictionJointDef();
        break;
      case 'gear':
        jointDef = new b2GearJointDef();
        break;
      case 'mouse':
        jointDef = new b2MouseJointDef();
    }
    for (k in jointDetails) {
      if (jointDef.hasOwnProperty(k)) {
        jointDef[k] = jointDetails[k];
      }
    }
    physics.world.CreateJoint(jointDef);
  };
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
