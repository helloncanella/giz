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
chalk.src = "../blackboard/assets/kawaii.png";

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
    this.lastPosition = {
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
	    self.updatePosition(event);
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

    
    this.updatePosition = function(event){
	this.lastPosition = {
	    x: event.pageX - $('canvas').offset().left-chalk.width/2,
	    y: event.pageY - $('canvas').offset().top-chalk.height/2
	}
    }

    this.traceLine = function(event){

	var currentPosition={
	    x: event.pageX - $('canvas').offset().left-chalk.width/2,
	    y: event.pageY - $('canvas').offset().top-chalk.height/2
	}
	
	var distance = {
	    x:currentPosition.x-this.lastPosition.x,
	    y:currentPosition.y-this.lastPosition.y,
	    modulus: function(){
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
	    }
	   
	}

	var x,y, angle = Math.atan2(distance.y, distance.x); // finding the angle of change of direction
	log("angle: "+angle);

	//Tracing line
	for(var z=0; (z<distance.modulus()||z==0); z++){
	    
	    

	    
	    x = this.lastPosition.x+Math.cos(angle)*z;
	    y = this.lastPosition.y+Math.sin(angle)*z;

	    log("cos: "+Math.cos(angle));
	    
	    this.context.drawImage(chalk, x, y,2,2);
	}
	




	console.log("distance: "+ distance.modulus());

	
	this.lastPosition = currentPosition;

	//var distance = 

	
	//console.log("cp => "+currentPosition.x+","+currentPosition.y);
	
	//console.log('tracing line');
    }

}




