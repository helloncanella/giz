/*jshint -W098*/
/*global importScripts*/
'use strict';

var scripts = [
  '../../bower_components/box2dweb/Box2dWeb-2.1.a.3.js',
  '../../bower_components/poly2tri/dist/poly2tri.js',
  'box2d-preamble.js',
  'triangulator.js',
  'physics.js',
  'fixtureFactory.js',
  'box2dClosedPolyline.js',
  'box2dOpenedPolyline.js',
  'box2dCircle.js',
];

scripts.forEach(function(script){
  importScripts(script);
});
