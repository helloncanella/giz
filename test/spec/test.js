/*jshint unused:false*/
/*global describe, expect, it, createjs, Artist, StrokeCollector, document*/
(function(createjs, document) {
  'use strict';

  describe('Controller', function() {


    describe('Artist', function() {

      var artist = new Artist(createjs, 'easeljs');

      it('has a stage', function() {
        expect(artist).to.have.property('stage');
      });

      it('respond to the method draw', function() {
        expect(artist).to.respondTo('draw');
      });

    });

    describe('StrokeCollector', function() {
      var canvas = document.createElement('canvas');
      var strokeCollector = new StrokeCollector(canvas);

      it('collect', function() {
        expect(strokeCollector).to.respondTo('collect');
      });
      it('return non-empty strokes', function() {
        var point = {
          x: 25,
          y: 77
        };
        strokeCollector.collect(point);
        var stroke = strokeCollector.getStroke();
        expect(stroke).to.not.be.empty;
      });

    });




  });



})(createjs, document);
