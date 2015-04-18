function Scenario(){

    this.fps = 100;
    this.worldHeight = 10; //Real height of represented world.
    this.worldWidth = null; //To be determined

    this.body = null;

    this.context = null;
    this.canvasWidth=null;
    this.canvasHeight=null;

    this.scale = null; //ratio between canvas and world dimensions.

    //World variables
    this.gravity=null;
    this.world=null;
    
        
    this.start=function(){
	this.setup();
	this.tick();
    }

    this.setup = function(){
	this.fit();
	this.setWorld();
	this.insertBody();
    }

    this.fit = function(){

	var canvas = document.createElement("CANVAS");
	document.body.appendChild(canvas);
	this.context = canvas.getContext("2d");

	var w = $(window).width();
	var h = $(window).height();

	$('canvas').attr('width',w);
	this.canvasWidth = $('canvas').attr('width');
	
	
	$('canvas').attr('height',h);
	this.canvasHeight = $('canvas').attr('height');
	
	//Converting screen and world size
	this.scale =this.canvasHeight/this.worldHeight;
	this.worldWidth = this.canvasWidth/this.scale;
	


    }


    this.setWorld =  function(){
	this.gravity = new Vec(0,-10);

	var sleep = false; //If true the body will sleep when reach static body
	this.world = new World(this.gravity,sleep); 
    }


    this.insertBody = function(){

	var square = new BodyDef();
	square.type = Body.b2_dynamicBody;
	square.position.Set(0,this.worldHeight);
	
	var fixture = new FixtureDef;
	fixture.density = 1.0;
	fixture.friction = 10000;
	fixture.restituition = 0.2;
	fixture.shape = new PolygonShape();
	fixture.shape.SetAsBox(0.001,0.001);

	this.body = this.world.CreateBody(square);

	this.body.CreateFixture(fixture);

	

    }
 

    this.tick = function(){

	this.world.Step(1/this.fps,8,3);
	this.world.ClearForces();
	this.draw();
	
	var that = this;
	setTimeout(function(){that.tick()}, 1000/this.fps);
	
	
   }

    this.draw = function(){
	
	//Cleaning the canvas
	this.context.clearRect(0 , 0 , this.canvasWidth , this.canvasHeight);
	
	var worldPosition = this.body.GetPosition();
       
	//change world to canvas referential frame
	var canvasPosition = this.transformReferentialFrame(worldPosition);
      
	console.log("Canvas Position");
	console.log(canvasPosition.x+","+canvasPosition.y);
   
	console.log("World Position");
	console.log(worldPosition.x+","+worldPosition.y);

	var image = img_res('kawaii.png');
	
	this.context.drawImage(image,canvasPosition.x,canvasPosition.y,200,200);
   
    }

   this.transformReferentialFrame = function(worldPosition){
      
        
       //the (0,0) canvas point is the top left corner 
       var canvasPosition = {
	   //Mathematically, the vector canvasPositon = scale * worldPosition
	   x: worldPosition.x * this.scale,
	   y: Math.abs(this.canvasHeight - worldPosition.y * this.scale)
       
       }

       return canvasPosition;
   

   }    

   


}

var board = new Scenario();
board.start();

