/*global createjs, $*/
/*jshint -W098, -W003*/
'use strict';

var EaseljsContainer = createjs.Container;

function Container(position, width, height) {

  EaseljsContainer.call(this);

  this.x = position.x;
  this.y = position.y;

  this.setBounds(0, 0, width, height);

}

Container.prototype = Object.create(EaseljsContainer.prototype);

Container.prototype.constructor = Container;

Container.prototype.prepare = function() {};
