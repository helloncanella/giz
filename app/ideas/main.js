/*global createjs, Artist*/
/*jshint -W098*/
'use strict';
(function Controller(){

  var artist = new Artist('idea');

  (function prepareDraw (){
    artist.draw().then(function(stroke){
      console.log(stroke);
      prepareDraw();
    });
  })();


})();
