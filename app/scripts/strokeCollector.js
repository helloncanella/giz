/*jshint unused:false*/
'use strict';

function StrokeCollector(canvas, createjs) {

  this.stroke = [];

  this.collect = function(point){
    this.stroke.push(point);
  };

  this.getStroke = function(){
    var stroke = this.stroke;
    this.stroke = [];

    return stroke;
  };

}
