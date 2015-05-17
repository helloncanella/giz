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
    this.canvas = null;
    this.context = null;

    //images variables
    var chalk = images["chalk"];
    var background = images["background"];
    
    //ratio between canvas and world dimensions
    this.scale = null;

    //world variables
  /*  this.world = null;
    this.gravity = null;    
    this.worldHeight=10; // variables is given based on MKS 
    this.worldWidth=null; // to be defined */
    

    //events variables
    this.pressed   = null;
    this.unpressed = null;
    this.moving    = null;
    this.lastPosition = {
	x:0,
	y:0
    }
    
    this.setup = function(){
	this.setWorldAndCanvas();
//	this.setWorld();
	this.inputHandler();
	
	//Resizing canvas when window is changed
	$(window).resize(function(){
	    self.setWorldAndCanvas();
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
/*
    this.setWorldAndCanvas = function(){
	this.setCanvas();
	this.scale=this.worldHeight/this.canvas.height;
	this.worldWidth = this.canvas.width/this.scale;
	this.setWorld();
    }

    this.setWorld = function(){
	this.gravity =new Vec(0,-10);
	
	var sleep = false;//avoid dynamic bodies to stop when touched by the static
	this.world = new World(this.gravity,sleep);

	//Defining the walls (Need to be rethought in the future)
	var ground = new BodyDef();
	ground.type= Body.b2_staticBody;
	ground.position.Set(this.worldWidth,0);
	
	var fixture = new Fixture();
	fixture.restituition=0.2;
	fixture.shape = new PolygonShape();
	fixture.shape.SetAsBox(this.worldWidth,this.worldHeight*0.01);

	this.world.CreateBody(ground).CreateFixture(fixture);

	
	
    }
*/
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




