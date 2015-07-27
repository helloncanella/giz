//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  BasicRUBELayer
//
//  See header file for description.
//

#include "ExamplesMenuLayer.h"
#include "BasicRUBELayer.h"
#include "rubestuff/b2dJson.h"
#include "QueryCallbacks.h"

using namespace std;
using namespace cocos2d;

BasicRUBELayer::BasicRUBELayer()
{
    m_world = NULL;
    m_debugDraw = NULL;
    m_mouseJoint = NULL;
    m_mouseJointGroundBody = NULL;
    m_mouseJointTouch = NULL;
}

BasicRUBELayer::~BasicRUBELayer()
{
    unscheduleUpdate();
    clear();
}

CCScene* BasicRUBELayer::scene()
{
    CCScene *scene = CCScene::create();
    
    // add layer as a child to scene
    BasicRUBELayer* layer = new BasicRUBELayer();
    layer->init();// do things that require virtual functions (can't do in constructor)
    scene->addChild(layer);
    layer->release();
    
    // only for this demo project, you can remove this in your own app
    scene->addChild(layer->setupMenuLayer());
    
    return scene;
}

bool BasicRUBELayer::init()
{
    CCLayer::init();
    
    setTouchEnabled( true );
    setAccelerometerEnabled( true );    
    setAnchorPoint( CCPointMake(0,0) );
    
    // set the starting scale and offset values from the subclass
    setPosition( initialWorldOffset() );
    setScale( initialWorldScale() );
    
    // load the world from RUBE .json file (this will also call afterLoadProcessing)
    loadWorld();
    
    scheduleUpdate();
    
    return true;
}

// Sets up a menu layer as a child of this layer, to allow the user to return to
// the previous scene, or reload the world.
// This is only for this demo project, you can remove this in your own app.
CCLayer* BasicRUBELayer::setupMenuLayer()
{
    CCMenuItem* backItem = CCMenuItemFont::create("Back", this, menu_selector(BasicRUBELayer::goBack));
    CCMenuItem* reloadItem = CCMenuItemFont::create("Reload", this, menu_selector(BasicRUBELayer::loadWorld));    
    m_menuLayer = CCMenu::create(backItem,reloadItem,NULL);
    m_menuLayer->alignItemsHorizontally();
    
    updateAfterOrientationChange();
    
    //[[NSNotificationCenter defaultCenter] addObserver:self
	//										 selector:@selector(updateAfterOrientationChange:)
	//											 name:UIDeviceOrientationDidChangeNotification
	//										   object:nil];
    return m_menuLayer;
}

// This is only for this demo project, you can remove this in your own app.
void BasicRUBELayer::goBack()
{
    unscheduleUpdate();
    CCDirector::sharedDirector()->replaceScene(ExamplesMenuLayer::scene());
}
  
// Repositions the menu child layer after the device orientation changes.
// This is only for this demo project, you can remove this in your own app.
void BasicRUBELayer::updateAfterOrientationChange()
{
    CCSize s = CCDirector::sharedDirector()->getWinSize();
    m_menuLayer->setPosition( CCPointMake(s.width/2,s.height-20) );
}


// Override this in subclasses to specify which .json file to load
string BasicRUBELayer::getFilename()
{
    return "jointTypes.json";
}


// Override this in subclasses to set the inital view position
CCPoint BasicRUBELayer::initialWorldOffset()
{
    // This function should return the location in pixels to place
    // the (0,0) point of the physics world. The screen position
    // will be relative to the bottom left corner of the screen.
    
    //place (0,0) of physics world at center of bottom edge of screen
    CCSize s = CCDirector::sharedDirector()->getWinSize();
    return CCPointMake( s.width/2, 0 );
}


// Override this in subclasses to set the inital view scale
float BasicRUBELayer::initialWorldScale()
{
    // This method should return the number of pixels for one physics unit.
    // When creating the scene in RUBE I can see that the jointTypes scene
    // is about 8 units high, so I want the height of the view to be about
    // 10 units, which for iPhone in landscape (480x320) we would return 32.
    // But for an iPad in landscape (1024x768) we would return 76.8, so to
    // handle the general case, we can make the return value depend on the
    // current screen height.
    
    CCSize s = CCDirector::sharedDirector()->getWinSize();
    return s.height / 10; //screen will be 10 physics units high
}

// Attempts to load the world from the .json file given by getFilename.
// If successful, the method afterLoadProcessing will also be called,
// to allow subclasses to do something extra while the b2dJson information
// is still available.
void BasicRUBELayer::loadWorld()
{
    // The clear method should undo anything that is done in this method,
    // and also whatever is done in the afterLoadProcessing method.
    clear();
    
    // Get the name of the .json file to load, eg. "jointTypes.json"
    string filename = getFilename();
    
    // Find out the absolute path for the file
    string fullpath = CCFileUtils::sharedFileUtils()->fullPathForFilename(filename.c_str());
    
    // This will print out the actual location on disk that the file is read from.
    // When using the simulator, exporting your RUBE scene to this folder means
    // you can edit the scene and reload it without needing to restart the app.
    CCLOG("Full path is: %s", fullpath.c_str());
    
    // Create the world from the contents of the RUBE .json file. If something
    // goes wrong, m_world will remain NULL and errMsg will contain some info
    // about what happened.
    b2dJson json;
    std::string errMsg;
    unsigned long fileSize = 0;
    unsigned char* fileData = CCFileUtils::sharedFileUtils()->getFileData(fullpath.c_str(), "r", &fileSize);
    std::string jsonContent;
    jsonContent.assign(reinterpret_cast<const char*>(fileData), fileSize);
    m_world = json.readFromString(jsonContent, errMsg);
    
    if ( m_world ) {
        CCLOG("Loaded JSON ok");
        
        // Set up a debug draw so we can see what's going on in the physics engine.
        // The scale for rendering will be handled by the layer scale, which will affect
        // the entire layer, so we keep the PTM ratio here to 1 (ie. one physics unit
        // will be one pixel)
        //m_debugDraw = new GLESDebugDraw( 1 );
        // oh wait... actually, this should be 2 if using retina
        m_debugDraw = new Box2DDebugDraw( CCDirector::sharedDirector()->getContentScaleFactor() );
        
        // set the debug draw to show fixtures, and let the world know about it
        m_debugDraw->SetFlags( b2Draw::e_shapeBit | b2Draw::e_jointBit );
        m_world->SetDebugDraw(m_debugDraw);

        // This body is needed if we want to use a mouse joint to drag things around.
        b2BodyDef bd;
        m_mouseJointGroundBody = m_world->CreateBody( &bd );
        
        afterLoadProcessing(&json);
    }
    else
        CCLOG(errMsg.c_str()); //if this warning bothers you, turn off "Typecheck calls to printf/scanf" in the project build settings
}


// Override this in subclasses to do some extra processing (eg. acquire references
// to named bodies, joints etc) after the world has been loaded, and while the b2dJson
// information is still available.
void BasicRUBELayer::afterLoadProcessing(b2dJson* json)
{
    
}

// This method should undo anything that was done by the loadWorld and afterLoadProcessing
// methods, and return to a state where loadWorld can safely be called again.
void BasicRUBELayer::clear()
{
    if ( m_world ) {
        CCLOG("Deleting Box2D world");
        delete m_world;
    }
    
    if ( m_debugDraw )
        delete m_debugDraw;
    
    m_world = NULL;
    m_mouseJoint = NULL;
    m_mouseJointGroundBody = NULL;
}


// Standard Cocos2d method, just step the physics world with fixed time step length
void BasicRUBELayer::update(float dt)
{
    if ( m_world )
        m_world->Step(1/60.0, 8, 3);
}


// Standard Cocos2d method
void BasicRUBELayer::draw()
{
    if ( !m_world )
        return;
 
    // debug draw display will be on top of anything else
    CCLayer::draw();
        
    ccGLEnableVertexAttribs( kCCVertexAttribFlag_Position );
    kmGLPushMatrix();
    
    m_world->DrawDebugData();
    
    // Draw mouse joint line
    if ( m_mouseJoint ) {
        b2Vec2 p1 = m_mouseJoint->GetAnchorB();
        b2Vec2 p2 = m_mouseJoint->GetTarget();
        
        b2Color c;
        c.Set(0.0f, 1.0f, 0.0f);
        m_debugDraw->DrawPoint(p1, 4.0f, c);
        m_debugDraw->DrawPoint(p2, 4.0f, c);
        
        c.Set(0.8f, 0.8f, 0.8f);
        m_debugDraw->DrawSegment(p1, p2, c);
    }
    
    kmGLPopMatrix();  
    
}


// Converts a position in screen pixels to a location in the physics world
b2Vec2 BasicRUBELayer::screenToWorld(cocos2d::CCPoint screenPos)
{
    screenPos.y = CCDirector::sharedDirector()->getWinSize().height - screenPos.y;
    
    CCPoint layerOffset = getPosition();
    screenPos.x -= layerOffset.x;
    screenPos.y -= layerOffset.y;
    
    float layerScale = getScale();
    
    return b2Vec2(screenPos.x / layerScale, screenPos.y / layerScale);
}


// Converts a location in the physics world to a position in screen pixels
cocos2d::CCPoint BasicRUBELayer::worldToScreen(b2Vec2 worldPos)
{
    worldPos *= getScale();
    CCPoint layerOffset = getPosition();
    CCPoint p = CCPointMake(worldPos.x + layerOffset.x, worldPos.y + layerOffset.y);
    p.y = CCDirector::sharedDirector()->getWinSize().height - p.y;
    return p;
}


// Standard Cocos2d method. Here we make a mouse joint to drag dynamic bodies around.
void BasicRUBELayer::ccTouchesBegan(CCSet* touches, CCEvent* event)
{
    // Only make one mouse joint at a time!
    if ( m_mouseJoint )
        return;
    
    CCTouch *touch = (CCTouch*)touches->anyObject();
    CCPoint screenPos = touch->getLocationInView();
    b2Vec2 worldPos = screenToWorld(screenPos);
    
    // Make a small box around the touched point to query for overlapping fixtures
    b2AABB aabb;
    b2Vec2 d(0.001f, 0.001f);
    aabb.lowerBound = worldPos - d;
    aabb.upperBound = worldPos + d;
    
    // Query the world for overlapping fixtures (the TouchDownQueryCallback simply
    // looks for any fixture that contains the touched point)
    TouchDownQueryCallback callback(worldPos);
    m_world->QueryAABB(&callback, aabb);
    
    // Check if we found something, and it was a dynamic body (can't drag static bodies)
    if (callback.m_fixture && callback.m_fixture->GetBody()->GetType() == b2_dynamicBody)
    {
        // The touched point was over a dynamic body, so make a mouse joint
        b2Body* body = callback.m_fixture->GetBody();
        b2MouseJointDef md;
        md.bodyA = m_mouseJointGroundBody;
        md.bodyB = body;
        md.target = worldPos;
        md.maxForce = 2500.0f * body->GetMass();
        m_mouseJoint = (b2MouseJoint*)m_world->CreateJoint(&md);
        body->SetAwake(true);
        m_mouseJointTouch = touch;
    }
}


// Standard Cocos2d method
void BasicRUBELayer::ccTouchesMoved(CCSet* touches, CCEvent* event)
{
    if ( touches->count() > 1 ) {
        // At least two touches are moving at the same time
        if ( ! allowPinchZoom() )
            return;
        
        // Take the first two touches and use their movement to pan and zoom the scene.
        CCSetIterator it = touches->begin();
        CCTouch *touch0 = (CCTouch*)(*it++);
        CCTouch *touch1 = (CCTouch*)(*it);
        CCPoint screenPos0 = touch0->getLocationInView();
        CCPoint screenPos1 = touch1->getLocationInView();
        CCPoint previousScreenPos0 = touch0->getPreviousLocationInView();
        CCPoint previousScreenPos1 = touch1->getPreviousLocationInView();
        
        CCPoint layerOffset = getPosition();
        float layerScale = getScale();
        
        // Panning
        // The midpoint is the point exactly between the two touches. The scene
        // should move by the same distance that the midpoint just moved.
        CCPoint previousMidpoint = ccpMidpoint(previousScreenPos0, previousScreenPos1);
        CCPoint currentMidpoint = ccpMidpoint(screenPos0, screenPos1);
        CCPoint moved = ccpSub(currentMidpoint, previousMidpoint);
        moved.y *= -1;
        layerOffset = ccpAdd(layerOffset, moved);

        // Zooming
        // The scale should change by the same ratio as the previous and current
        // distance between the two touches. Unfortunately simply setting the scale
        // has the side-effect of moving the view center. We want to keep the midpoint
        // of the touches unchanged by scaling, so we need to look at what it was
        // before we scale...
        b2Vec2 worldCenterBeforeScaling = screenToWorld(currentMidpoint);
        
        // ... then perform the scale change...
        float previousSeparation = ccpDistance(previousScreenPos0, previousScreenPos1);
        float currentSeparation = ccpDistance(screenPos0, screenPos1);
        if ( previousSeparation > 10 ) { //just in case, prevent divide by zero
            layerScale *= currentSeparation / previousSeparation;
            setScale(layerScale);
        }

        // ... now check how that affected the midpoint, and cancel out the change:
        CCPoint screenCenterAfterScaling = worldToScreen(worldCenterBeforeScaling);
        CCPoint movedCausedByScaling = ccpSub(screenCenterAfterScaling, currentMidpoint);
        movedCausedByScaling.y *= -1;
        layerOffset = ccpSub(layerOffset, movedCausedByScaling);       
        
        setPosition(layerOffset);
    }
    else if ( m_mouseJoint ) {
        // Only one touch is moving. If it is the touch that started the mouse joint
        // move the target position of the mouse joint to the new touch position
        CCTouch *touch = (CCTouch*)touches->anyObject();
        if ( touch == m_mouseJointTouch ) {
            CCPoint screenPos = touch->getLocationInView();
            b2Vec2 worldPos = screenToWorld(screenPos);
            m_mouseJoint->SetTarget(worldPos);
        }
    }
}


// Standard Cocos2d method
void BasicRUBELayer::ccTouchesEnded(CCSet* touches, CCEvent* event)
{
    // Check if one of the touches is the one that started the mouse joint.
    // If so we need to destroy the mouse joint and reset some variables.
    if ( m_mouseJoint ) {
        for (CCSetIterator it = touches->begin(); it != touches->end(); ++it) {
            CCTouch* touch = (CCTouch*)*it;
            if ( touch != m_mouseJointTouch )
                continue;
            m_world->DestroyJoint(m_mouseJoint);
            m_mouseJoint = NULL;
            m_mouseJointTouch = NULL;
            break;
        }
    }
}


// Standard Cocos2d method
void BasicRUBELayer::ccTouchesCancelled(CCSet* touches, CCEvent* event)
{
    ccTouchesEnded(touches, event);
}

b2Fixture* BasicRUBELayer::getTouchedFixture(CCTouch* touch)
{
    CCPoint screenPos = touch->getLocationInView();
    b2Vec2 worldPos = screenToWorld(screenPos);
    
    // Make a small box around the touched point to query for overlapping fixtures
    b2AABB aabb;
    b2Vec2 d(0.001f, 0.001f);
    aabb.lowerBound = worldPos - d;
    aabb.upperBound = worldPos + d;
    TouchDownQueryCallback callback(worldPos);
    m_world->QueryAABB(&callback, aabb);
    return callback.m_fixture;
}

bool BasicRUBELayer::allowPinchZoom()
{
    return true;
}















