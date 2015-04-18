/**
	1. Initialise the box2d objects
	2. Code for class inheritance
*/

var Vec = Box2D.Common.Math.b2Vec2
	,AABB = Box2D.Collision.b2AABB
	,BodyDef = Box2D.Dynamics.b2BodyDef
	,Body = Box2D.Dynamics.b2Body
	,FixtureDef = Box2D.Dynamics.b2FixtureDef
	,Fixture = Box2D.Dynamics.b2Fixture
	,World = Box2D.Dynamics.b2World
	,MassData = Box2D.Collision.Shapes.b2MassData
	,PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	,CircleShape = Box2D.Collision.Shapes.b2CircleShape
	,DebugDraw = Box2D.Dynamics.b2DebugDraw
	,MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
	,Shape = Box2D.Collision.Shapes.b2Shape
	,RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	,Joint = Box2D.Dynamics.Joints.b2Joint
	,PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
	,ContactListener = Box2D.Dynamics.b2ContactListener
	,Settings = Box2D.Common.b2Settings
	,Mat22 = Box2D.Common.Math.b2Mat22
	,EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef
	,EdgeShape = Box2D.Collision.Shapes.b2EdgeShape
	,WorldManifold = Box2D.Collision.b2WorldManifold
	;

//max speed = 10 mps for higher velocity
Settings.b2_maxTranslation = 10.0;
Settings.b2_maxRotation = 50.0;


/*
	Load image from asset manager
*/
function img_res(path)
{
	var i = new Image();
	i.src = 'code/media/'+path;
	
	return i;
}

/*
	Generic function to write text
	example :
	
	write_text({x : game.canvas_width - 100 , y : game.canvas_height - 50 , font : 'bold 35px arial' , color : '#fff' , text : time , ctx : game.ctx})
*/
function write_text(options)
{
	var x = options.x;
	var y = options.y;
	var font = options.font;
	var color = options.color;
	var text = options.text;
	var ctx = options.ctx;
	
	ctx.save();
	
	if('shadow' in options)
	{
		ctx.shadowColor = options.shadow.color;
		ctx.shadowOffsetX = options.shadow.x;
		ctx.shadowOffsetY = options.shadow.y;
		ctx.shadowBlur = options.shadow.blur;
	}
	
	ctx.font = font;
	/*ctx.textAlign = 'center';*/
	ctx.fillStyle = color;
	
	if('align' in options)
	{
		ctx.textAlign = options.align;
	}
	
	ctx.fillText( text , x , y);
	
	ctx.restore();
}
