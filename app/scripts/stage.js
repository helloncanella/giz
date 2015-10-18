/*global createjs, $, Artist, StageFactory, AABB*/
/*jshint -W098, -W003*/
'use strict';

var EaseljsStage = createjs.Stage;

function Stage(canvasId) {

  EaseljsStage.call(this, canvasId);

  this.selectedChild = null;
}

Stage.prototype = Object.create(EaseljsStage.prototype);

Stage.prototype.constructor = Stage;

Stage.prototype.setSelectedChild = function(child) {
  this.selectedChild = child;
};
