/*global createjs, $, Artist, ShapeFactory, AABB*/
/*jshint -W098, -W003*/
'use strict';

var EaseljsShape = createjs.Shape;

function Shape(position) {

  EaseljsShape.call(this);

  this.x = position.x;
  this.y = position.y;

  this.data = {
    label: '',
    measures: {}
  };

}

Shape.prototype = Object.create(EaseljsShape.prototype);

Shape.prototype.constructor = Shape;

Shape.prototype.prepare = function() {};

Shape.prototype.setAABB = function() {

  var data = this.data;

  var aabb = new AABB(data);

  var width = aabb.width,
    height = aabb.height,
    topLeft = Object.assign({}, aabb.topLeft);

  this.setBounds(topLeft.x, topLeft.y, width, height);

  return this;
};

Shape.prototype.setCentroid = function(centroid) {
  var data = this.data;

  data.centroid = {
    x: centroid.x,
    y: centroid.y
  };

  return this;

};

Shape.prototype.setListeners = function(){
  var stage = this.stage;

  this.on('mousedown',function () {
    var index = stage.getChildIndex(this);
    stage.setSelectedChild(index);
  });

  this.on('pressup',function () {
    stage.setSelectedChild(null);
  });

  return this;
};
