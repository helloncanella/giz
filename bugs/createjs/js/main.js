var canvas, count, handleTick, stage, txt;

count = 0;

canvas = $('#b2dCanvas')[0];

stage = new createjs.Stage(canvas);

txt = new createjs.Text("text on the canvas... 0!", "36px Arial", "#FFF");

txt.x = 100;

txt.y = 100;

stage.addChild(txt);

createjs.Ticker.setFPS(100);

createjs.Ticker.addEventListener("tick", handleTick);

handleTick = function(event) {
  console.log('olá');
  count++;
  txt.text = "text on canvas" + count;
  stage.update(event);
};
