/*global createjs, $, Shape*/
/*jshint -W098, -W003*/
'use strict';

//-----------------------------------------------------------
//- Circle's abstraction. It inherits from Shape
//-----------------------------------------------------------
function Circle(position, radius) {
  Shape.call(this, position);

  this.radius = radius || 0;

  this.data = {
    label: 'circle',
    measures: {
      center: {
        x: this.x,
        y: this.y
      },
      radius: this.radius
    }
  };

}

Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.constructor = Circle;

Circle.prototype.setBounds = function(){

};

Circle.prototype.prepare = function() {
  var data = this.data;

  var circle = this;

  var promise = new Promise(function(resolve) {
    circle.setBounds();
    resolve(data);
  });


  return promise;
};

Circle.prototype.increaseRadius = function() {

  var radius = this.data.measures.radius += 0.15;

  this.graphics.clear();
  this.graphics.beginFill('red').drawCircle(0, 0, radius);

  this.data.measures.radius = radius;

};
