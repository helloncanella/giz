function Blackboard (){
    var self = this;
   
    //canvas variables
    this.canvas    = null;
    this.context   = null;
    
    //events variables
    this.pressed   = null;
    this.unpressed = null;
    this.moving    = null;

    
    this.setup = function(){
	
	this.setCanvas();
	this.inputHandler();

	var self = this;	
	$(window).resize(function(){
	    self.setCanvas();
	});	
    }

    this.setCanvas = function(){
	
	$('canvas').remove();	//Removing previous canvas
	$('body').append('<canvas></canvas>');//Appending new canvas
	
	var canvas = this.canvas = $('canvas')[0];
	var context= this.context = canvas.getContext('2d');
	console.log(canvas+","+context);

	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();
	
	$('canvas').width(windowWidth).height(windowHeight);

	//Drawing background
	var background = new Image();
	background.src = "../blackboard/assets/chalkboard.jpg";
	
	var pattern = context.createPattern(background,"repeat");
	context.rect(0,0,canvas.width,canvas.height);
	context.fillStyle = pattern;
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

	var self = this;
	$(document).bind(self.pressed,self.onPressed());

    }

    this.onPressed = function(){
	
	var self = this;

	this.onMoving();
	
	$(document).bind(this.unpressed,this.onUnpressed());
	$(document).bind(this.moving,this.onMoving());

	return function(){
	    console.log("pressed");
	}
	
    }

    this.onUnpressed = function(){
	$(document).unbind(this.moving);


	return function(){
	    console.log("unpressed");
	}
    }

    this.onMoving = function(){
	return function(event){
	    console.log("moving");
	    event.preventDefault();
	    return false;
	}
    }


}


var blackboard = new Blackboard();
blackboard.setup();
