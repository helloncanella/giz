var init;

init = function() {
  var b2AABB, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2MouseJointDef, b2PolygonShape, b2Vec2, b2World, bodyDef, canvasPosition, debugDraw, fixDef, getBodyAtMouse, getBodyCB, getElementPosition, handleMouseMove, i, isMouseDown, mouseJoint, mousePVec, mouseX, mouseY, selectedBody, update, world;
  b2Vec2 = Box2D.Common.Math.b2Vec2;
  b2AABB = Box2D.Collision.b2AABB;
  b2BodyDef = Box2D.Dynamics.b2BodyDef;
  b2Body = Box2D.Dynamics.b2Body;
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  b2Fixture = Box2D.Dynamics.b2Fixture;
  b2World = Box2D.Dynamics.b2World;
  b2MassData = Box2D.Collision.Shapes.b2MassData;
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
  b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
  world = new b2World(new b2Vec2(0, 10), true);
  fixDef = new b2FixtureDef;
  handleMouseMove = function(e) {
    var mouseX, mouseY;
    mouseX = (e.clientX - canvasPosition.x) / 30;
    mouseY = (e.clientY - canvasPosition.y) / 30;
  };
  getBodyAtMouse = function() {
    var aabb, mousePVec, selectedBody;
    mousePVec = new b2Vec2(mouseX, mouseY);
    aabb = new b2AABB;
    aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
    aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
    selectedBody = null;
    world.QueryAABB(getBodyCB, aabb);
    return selectedBody;
  };
  getBodyCB = function(fixture) {
    var selectedBody;
    if (fixture.GetBody().GetType() !== b2Body.b2_staticBody) {
      if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
        selectedBody = fixture.GetBody();
        return false;
      }
    }
    return true;
  };
  update = function() {
    var body, md, mouseJoint;
    if (isMouseDown && !mouseJoint) {
      body = getBodyAtMouse();
      if (body) {
        md = new b2MouseJointDef;
        md.bodyA = world.GetGroundBody();
        md.bodyB = body;
        md.target.Set(mouseX, mouseY);
        md.collideConnected = true;
        md.maxForce = 300.0 * body.GetMass();
        mouseJoint = world.CreateJoint(md);
        body.SetAwake(true);
      }
    }
    if (mouseJoint) {
      if (isMouseDown) {
        mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
      } else {
        world.DestroyJoint(mouseJoint);
        mouseJoint = null;
      }
    }
    world.Step(1 / 60, 10, 10);
    world.DrawDebugData();
    world.ClearForces();
  };
  getElementPosition = function(element) {
    var elem, tagname, x, y;
    elem = element;
    tagname = '';
    x = 0;
    y = 0;
    while (typeof elem === 'object' && typeof elem.tagName !== 'undefined') {
      y += elem.offsetTop;
      x += elem.offsetLeft;
      tagname = elem.tagName.toUpperCase();
      if (tagname === 'BODY') {
        elem = 0;
      }
      if (typeof elem === 'object') {
        if (typeof elem.offsetParent === 'object') {
          elem = elem.offsetParent;
        }
      }
    }
    return {
      x: x,
      y: y
    };
  };
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;
  bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(20, 2);
  bodyDef.position.Set(10, 400 / 30 + 1.8);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(10, -1.8);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  fixDef.shape.SetAsBox(2, 14);
  bodyDef.position.Set(-1.8, 13);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(21.8, 13);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.type = b2Body.b2_dynamicBody;
  i = 0;
  while (i < 10) {
    if (Math.random() > 0.5) {
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(Math.random() + 0.1, Math.random() + 0.1);
    } else {
      fixDef.shape = new b2CircleShape(Math.random() + 0.1);
    }
    bodyDef.position.x = Math.random() * 10;
    bodyDef.position.y = Math.random() * 10;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    ++i;
  }
  debugDraw = new b2DebugDraw;
  debugDraw.SetSprite(document.getElementById('canvas').getContext('2d'));
  debugDraw.SetDrawScale(30.0);
  debugDraw.SetFillAlpha(0.5);
  debugDraw.SetLineThickness(1.0);
  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
  world.SetDebugDraw(debugDraw);
  window.setInterval(update, 1000 / 60);
  mouseX = void 0;
  mouseY = void 0;
  mousePVec = void 0;
  isMouseDown = void 0;
  selectedBody = void 0;
  mouseJoint = void 0;
  canvasPosition = getElementPosition(document.getElementById('canvas'));
  document.addEventListener('mousedown', (function(e) {
    isMouseDown = true;
    handleMouseMove(e);
    document.addEventListener('mousemove', handleMouseMove, true);
  }), true);
  document.addEventListener('mouseup', (function() {
    document.removeEventListener('mousemove', handleMouseMove, true);
    isMouseDown = false;
    mouseX = void 0;
    mouseY = void 0;
  }), true);
};
