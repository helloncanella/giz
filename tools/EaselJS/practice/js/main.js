var circle, counter, init, stage, text, tick;

stage = void 0;

circle = void 0;

counter = 0;

text = void 0;

init = function() {
  stage = new createjs.Stage("demoCanvas");
  console.log(stage);
  circle = new createjs.Shape();
  circle.graphics.beginFill("royalblue").drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  text = new createjs.Text();
  text.text = "Hello World";
  stage.addChild(text);
  stage.update();
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.setFPS(60);
  console.log(event);
};

tick = function(e) {
  circle.x += e.delta / 1000 * 1000;
  if (circle.x > stage.canvas.width) {
    circle.x = 0;
  }
  counter++;
  text.text = counter + " - teste";
  return stage.update();
};

$(window).load(function() {
  init();
});