function Scenario(){

    this.fps = 60;
    this.worldHeight = 10; //Real height of represented world.
    this.worldWidth = null; //To be determined


    this.canvasWidth=null;
    this.canvasHeight=null;

    this.scale = null; //ratio between canvas and world dimensions.
        
    this.start=function(){
	this.setup();
	//this.tick();
    }

    this.setup = function(){
	this.fit();
	//this.setFrame();
    }

    this.fit = function(){

	var canvas = document.createElement("CANVAS");
	document.body.appendChild(canvas);

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

    this.setFrame = function(){


    }

    this.tick = function(){

	
    }

   


}

var world = new Scenario();
world.start();

