function Blackboard (){
    var self = this; // assingning "this", preventing problems
   
    //canvas variables
    this.canvas    = null;
    this.context   = null;
    
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

	console.log(background.src);
	
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

	
	$(document).bind(self.pressed,self.onPressed());
	
    }

    this.onPressed = function(){
	
	
	$(document).bind(self.unpressed,self.onUnpressed());
	
	return function(){
	    self.traceLine(event);
	    $(document).bind(self.moving,self.onMoving(event));
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
	    return false;
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

	var chalck = new Image();
	chalck.src = "../blackboard/assets/kawaii.png";
	this.context.drawImage(chalck,currentPosition.x,currentPosition.y);

	console.log(chalck);
	

	console.log("distance: "+ distance.modulus());

	
	this.lastPointerPosition = lastPosition = currentPosition;

	//var distance = 

	
	//console.log("cp => "+currentPosition.x+","+currentPosition.y);
	
	//console.log('tracing line');
    }
    
   

}


var blackboard = new Blackboard();
blackboard.setup();
