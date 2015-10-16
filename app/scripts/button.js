/*global createjs, Container, Shape*/
/*jshint -W003*/
'use strict';

function Button(position, width, height) {

  var textDisplay, rect;

  Container.call(this, position, width, height);

  var button = this;

  this.paused = true;
  this.touched = false;

  var pauseStyle = {
    background: 'red',
    text: 'PAUSE'
  };

  var playStyle = {
    background: 'green',
    text: 'PLAY'
  };


  (function basicStyle() {

    textDisplay = new createjs.Text();
    textDisplay.set({
      font: 'bold 24px Helvetica',
      color: 'white'
    });

    rect = new Shape({
      x: 0,
      y: 0
    });

    button.addChild(rect, textDisplay);

    customize(playStyle);
  })();

  (function listeners() {
    button.on('mousedown', function() {
      if (this.paused) {
        this.paused = false;
        customize(pauseStyle);
      } else {
        this.paused = true;
        customize(playStyle);
      }

      this.stage.update();

    });

    button.on('mouseover', function() {
      console.log('mouseover');
      this.touched = true;
    });

    button.on('mouseout', function() {
      console.log('mouseout');
      this.touched = false;
    });
  })();


  function customize(style) {
    var
      background = style.background,
      text = style.text;

    textDisplay.text = text;

    var textBounds = textDisplay.getBounds();

    textDisplay.set({
      x: (width - textBounds.width) / 2,
      y: (height - textBounds.height) / 2
    });

    rect.graphics.beginFill(background).drawRect(0, 0, width, height);
  }



}





Button.prototype = Object.create(Container.prototype);

Button.prototype.constructor = Container;

Button.prototype.prepare = function() {};
