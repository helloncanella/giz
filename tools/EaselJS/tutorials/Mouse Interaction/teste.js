var stage, label, shape, oldX, oldY, size, color;

stage = new createjs.Stage("canvas");
stage.enableDOMEvents(true);
label = new createjs.Text("finger paint", "24px Arial");
label.x = label.y = 10;

shape = new createjs.Shape();
console.log(shape);
stage.addChild(shape, label);

// set up our defaults:
color = "#0FF";
size = 2;

// add handler for stage mouse events:
stage.on("stagemousedown", function(event) {
  size = 10;
})

stage.on("stagemouseup", function(event) {
  color = createjs.Graphics.getHSL(Math.random()*360, 100, 50);
  size = 2;
})


  stage.on("stagemousemove",function(evt) {
  if (oldX) {
    shape.graphics.beginStroke(color)
            .setStrokeStyle(size, "round")
            .moveTo(oldX, oldY)
            .lineTo(evt.stageX, evt.stageY);
    stage.update();
  }
  oldX = evt.stageX;
  oldY = evt.stageY;
})

var myGraphics = new createjs.Graphics();

myGraphics.beginStroke("red").beginFill("blue").drawRect(20, 20, 100, 50);

var shape2 = new createjs.Shape(myGraphics);


stage.addChild(shape2);


stage.update();
