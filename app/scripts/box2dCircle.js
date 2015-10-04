/*global FixtureFactory*/
/*jshint -W106, -W098*/
'use strict';

function Box2dCircle (fixtureData,radius) {

  var fixtureFactory = new FixtureFactory();

  var density = fixtureData.density || 0;
  var friction = fixtureData.friction || 0;

  var fixture = fixtureFactory.spawn('circle',density,friction);
  fixture.shape.m_radius = radius;

  this.getAllFixtures = function(){
    //The return value needs to be an array
    return [fixture];
  };
}
