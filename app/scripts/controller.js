 /*jshint unused:false*/
 /*global Artist, Physics, jQuery, StrokeCollector, createjs*/
 'use strict';
 var drawMode;

 var Controller = (function($, createjs, Artist) {

   var canvasId = 'easeljs',
     canvas = $('#' + canvasId),
     artist = new Artist(canvasId),
     strokeCollector = new StrokeCollector();

   canvas.on({
     mousedown: function() {
       drawMode = true;
     },
     mousemove: function(event) {
       if (drawMode) {
         var point = {
           x: event.offsetX,
           y: event.offsetY
         };
         strokeCollector.collect(point); // used in the enclosement of the shape
         artist.draw(point);
       }
     },
     mouseup: function(event) {
       drawMode = false;
       var stroke = strokeCollector.getStroke();
       artist.closeOpenedShape(stroke)
         .setShapeBounds()
         .setShapeListeners()
         .clearShapeReference();
     }
   });


   var physics = new Physics();

 })(jQuery, createjs, Artist);
