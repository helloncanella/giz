/*var blackboard = new Blackboard();
blackboard.setup();

//Drawing background
var background = new Image();
	background.src = "../blackboard/assets/chalkboard.jpg";

	console.log(background.src);
	
	var pattern = context.createPattern(background,"repeat");
	context.rect(0,0,canvas.width,canvas.height);
	context.fillStyle = pattern;
	context.fill();
*/


//-----------------------------------------------------------------------------------------------------

//Auxiliary methods (create library)

Object.prototype.size = function(){
    var size = 0, key;

    for(key in this){
	if(this.hasOwnProperty(key)) size++;
    }
    
    return size;

}

function log (argument){
    console.log(argument)
}

log("ok");


//-----------------------------------------------------------------------------------------------------

var chalk = new Image();
chalk.src = "../blackboard/assets/chalk-brush.png";

var background = new Image();
background.src = "../blackboard/assets/chalkboard.jpg";

var images = {
    "chalk": chalk,
    "background":background
}

//Verifying the images is loaded
var count=0;
for(var item in images){
    
   images[item].onload = function(){
	
	count++; //counting the number of loaded images

	console.log(count);

	//when all image is loaded create the blackboard 
	if(count===images.size()){
	    console.log("loaded images");
	    var giz = new Blackboard(images);
	    log(giz.size());
	    giz.setup();
	}
    }

}    

//-----------------------------------------------------------------------------------------------------
function Blackboard(images){
   
    var self = this; // assingning "this", preventing problems

    //canvas variables
    var canvas  = this.canvas   = null;
    var context = this.context  = null;

    //images variables
    var chalk = images["chalk"];
    var background = images["background"];
	
    
    //events variables
    this.pressed   = null;
    this.unpressed = null;
    this.moving    = null;
    this.lastPointerPosition = {
	x:0,
	y:0
    }
    
    this.setup = function(){
	
	this.setCanvas();
	this.inputHandler();
	
	//Resizing canvas when window is changed
	$(window).resize(function(){
	    self.setCanvas();
	});	

    }

    this.setCanvas = function(){
	
	$('canvas').remove();	//Removing previous canvas
	$('<canvas></canvas>').appendTo('body');//Appending new canvas
	
	var canvas = this.canvas = $('canvas')[0];
	var context= this.context = canvas.getContext('2d');
	
	$('canvas').attr({
	    width: $(window).width(),
	    height: $(window).height()
	});

	var pattern = context.createPattern(background, "repeat");
	context.rect(0,0, canvas.width, canvas.height);
	context.fillStyle=pattern;
	context.fill();	
		
    }


    this.inputHandler = function(){
	
	//Verifying if there is support for touch events
	var touchSupported = Modernizr.touch;
	if(touchSupported){
	    this.pressed   = "touchstart";
	    this.unpressed = "touchend";
	    this.moving    = "touchmove";
	}
	else{
	    this.pressed   = "mousedown";
	    this.unpressed = "mouseup";
	    this.moving    = "mousemove";
	}

	
	$(document).bind(self.pressed,self.onPressed());
	
    }

    this.onPressed = function(){
	
	
	$(document).bind(self.unpressed,self.onUnpressed());
	
	return function(){
	    
	    $(document).bind(self.moving,self.onMoving(event));
	    self.traceLine(event);
	    console.log("pressed");
	}
	
    }

    this.onUnpressed = function(){

	return function(){
	    $(document).unbind(self.moving);
	    console.log("unpressed");
	}
    }

    this.onMoving = function(event){
	
	return function(event){
	    self.traceLine(event);
	    console.log("moving");
	    console.log(event.pageX+","+event.pageY);
	    
	}
    }


    this.traceLine = function(event){
	var lastPosition = this.lastPointerPosition;
	var currentPosition={
	    x: event.pageX - $('canvas').offset().left,
	    y: event.pageY - $('canvas').offset().top,
	}
	
	var distance = {
	    x:currentPosition.x-lastPosition.x,
	    y:currentPosition.y-lastPosition.y,
	    modulus: function(){
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
	    }
	   
	}

	//Tracing line
	this.context.drawImage(chalk, currentPosition.x, currentPosition.y);
	

	

	console.log(chalck);
	

	console.log("distance: "+ distance.modulus());

	
	this.lastPointerPosition = lastPosition = currentPosition;

	//var distance = 

	
	//console.log("cp => "+currentPosition.x+","+currentPosition.y);
	
	//console.log('tracing line');
    }

}




