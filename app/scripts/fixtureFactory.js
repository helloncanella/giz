/*global b2FixtureDef, b2PolygonShape*/
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
      default:
    }

    return fixture;
  };
}
