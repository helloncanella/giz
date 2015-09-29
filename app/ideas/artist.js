/*global createjs,jQuery, $*/
/*jshint -W098*/
'use strict';

function Artist(canvasId) {
  var canvas = $('#' + canvasId);
  var stage = new createjs.Stage(canvasId);

  this.draw = function() {
    var promise = new Promise(function(resolve, reject) {
      var startToken;

      var stroke = [];
      var shape = new createjs.Shape();
      stage.addChild(shape);

      canvas.on({
        mousedown: function(event) {
          var start = {
            x: event.offsetX,
            y: event.offsetY
          };
          if (!startToken) {
            startToken = new StartTokenFactory().getToken(start);
            stage.addChild(startToken);
            stage.update();
          }

          shape.graphics.moveTo(start.x,start.y);

        },
        mouseup: function(event) {
          canvas.trigger('finishDraw');
        },
        finishDraw: function(event) {
          resolve(stroke);
        }
      });

    });
    return promise;
  };

  // startToken builder
  function StartTokenFactory (){

    this.getToken = function(position){
      var startToken = new createjs.Shape();
      startToken.graphics.setStrokeStyle(2).beginStroke('black')
        .drawRect(position.x, position.y, 7.5, 7.5);
      return startToken;
    };

  }
}
