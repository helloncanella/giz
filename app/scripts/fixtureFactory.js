/*global b2FixtureDef, b2PolygonShape, b2CircleShape*/
/*jshint -W106, -W098*/
'use strict';

function FixtureFactory () {
  this.spawn = function (shape,density,friction) {
    var fixture = new b2FixtureDef();
    fixture.friction = friction;
    fixture.density = density;

    switch (shape) {
      case 'polygon':
        fixture.shape = new b2PolygonShape();
        break;
      case 'circle':
        fixture.shape = new b2CircleShape();
        break;
      default:
    }

    return fixture;
  };
}
