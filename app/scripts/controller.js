 /*jshint unused:false*/
 /*global Artist, Physics, jQuery, StrokeCollector, createjs*/
 'use strict';

 var Controller = (function($, createjs, Artist) {

   var drawMode;

   var canvasId = '#easeljs',
     canvas = $(canvasId),
     artist = new Artist(createjs, canvasId),
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
         artist.draw(point);
         strokeCollector.collect(point); // used in the enclosement of the shape
       }
     },
     mouseup: function(event) {
       drawMode = false;
     }
   });


   var physics = new Physics();



 })(jQuery, createjs, Artist);
