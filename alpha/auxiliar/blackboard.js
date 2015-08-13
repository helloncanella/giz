// var stage, label, shape, oldX, oldY, size, color;
		//
		// function init() {
		// 	stage = new createjs.Stage("demoCanvas");
		// 	stage.enableDOMEvents(true);
		// 	label = new createjs.Text("finger paint", "24px Arial");
		// 	label.x = label.y = 10;
		//
		// 	shape = new createjs.Shape();
		// 	stage.addChild(shape, label);
		//
		// 	// set up our defaults:
		// 	color = "#0FF";
		// 	size = 2;
		//
		// 	// add handler for stage mouse events:
		// 	stage.on("stagemousedown", function(event) {
		// 		size = 10;
		// 	})
		//
		// 	stage.on("stagemouseup", function(event) {
		// 		color = createjs.Graphics.getHSL(Math.random()*360, 100, 50);
		// 		size = 2;
		// 	})
		//
		//
		//     stage.on("stagemousemove",function(evt) {
		// 		if (oldX) {
		// 			shape.graphics.beginStroke(color)
		// 						  .setStrokeStyle(size, "round")
		// 						  .moveTo(oldX, oldY)
		// 						  .lineTo(evt.stageX, evt.stageY);
		// 			stage.update();
		// 		}
		// 		oldX = evt.stageX;
		// 		oldY = evt.stageY;
		// 	})
		//
		// 	stage.update();
		// }
