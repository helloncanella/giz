//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PlanetCuteRUBELayer
//
//  See header file for description.
//


#import "PlanetCuteRUBELayer.h"
#import "PlanetCuteFixtureUserData.h"
#import "SimpleAudioEngine.h"

@implementation PlanetCuteRUBELayer

// Standard Cocos2d method, simply returns a scene with an instance of this class as a child
+(CCScene *) scene
{
	CCScene *scene = [CCScene node];
	
	PlanetCuteRUBELayer *layer = [PlanetCuteRUBELayer node];
	[scene addChild: layer];
    
    // only for this demo project, you can remove this in your own app
	[scene addChild: [layer setupMenuLayer]];
    
	return scene;
}


// Override superclass to load different RUBE scene
-(NSString*)getFilename
{
    return @"planetcute.json";
}


// Override superclass to set different starting offset
-(CGPoint)initialWorldOffset
{
    //place (0,0) of physics world at center of bottom edge of screen
    CGSize s = [[CCDirector sharedDirector] winSize];
    return CGPointMake( s.width/2, 0 );
}


// Override superclass to set different starting scale
-(float)initialWorldScale
{
    CGSize s = [[CCDirector sharedDirector] winSize];
    return s.height / 8; //screen will be 8 physics units high
}


// This is called after the Box2D world has been loaded, and while the b2dJson information
// is still available to do extra loading. Here is where we obtain the named items in the scene.
-(void)afterLoadProcessing:(b2dJson*)json
{
    // call superclass method to load images etc
    [super afterLoadProcessing:json];
    
    // preload the sound effects
    [[SimpleAudioEngine sharedEngine] preloadEffect:@"jump.wav"];
    [[SimpleAudioEngine sharedEngine] preloadEffect:@"pickupgem.wav"];
    [[SimpleAudioEngine sharedEngine] preloadEffect:@"pickupstar.wav"];
    
    // allocate storage for pickup lists
    m_allPickups = [[NSMutableArray arrayWithCapacity:0] retain];
    m_pickupsToProcess = [[NSMutableSet setWithCapacity:0] retain];

    // find player body and foot sensor fixture
    m_playerBody = json->getBodyByName("player");
    m_footSensorFixture = json->getFixtureByName("footsensor");
    
    // find all fixtures in the scene named 'pickup' and loop over them
    std::vector<b2Fixture*> pickupFixtures;
    json->getFixturesByName("pickup", pickupFixtures);
    for (int i = 0; i < pickupFixtures.size(); i++) {
        b2Fixture* f = pickupFixtures[i];
        
        // For every pickup fixture, we create a FixtureUserData to set in
        // the user data.
        PlanetCuteFixtureUserData* fud = [[PlanetCuteFixtureUserData alloc] init];
        [m_allPickups addObject:fud];
        f->SetUserData( fud );

        // set some basic properties of the FixtureUserData
        fud->fixtureType = FT_PICKUP;
        fud->body = f->GetBody();
        fud->originalPosition = f->GetBody()->GetPosition();

        // use the custom properties given to the fixture in the RUBE scene
        fud->pickupType = (_pickupType)json->getCustomInt(f, "pickuptype", PT_GEM);
        fud->bounceSpeedH = json->getCustomFloat(f, "horizontalbouncespeed");
        fud->bounceSpeedV = json->getCustomFloat(f, "verticalbouncespeed");
        fud->bounceWidth  = json->getCustomFloat(f, "bouncewidth");
        fud->bounceHeight = json->getCustomFloat(f, "bounceheight");
        
        // these "bounce deltas" are just a number given to sin when wobbling
        // the pickups. Each pickup has its own value to stop them from looking
        // like they are moving in unison.
        fud->bounceDeltaH = CCRANDOM_0_1() * M_PI_2;
        fud->bounceDeltaV = CCRANDOM_0_1() * M_PI_2;
    }
    
    // find the imageInfos for the text instruction images. Sprites 2 and 3 are
    // hidden initially
    m_instructionsSprite1 = nil;
    m_instructionsSprite2 = nil;
    m_instructionsSprite2 = nil;
    for (RUBEImageInfo* imgInfo in m_imageInfos) {
        if ( [imgInfo->name isEqualToString:@"instructions1"] )
            m_instructionsSprite1 = imgInfo;
        if ( [imgInfo->name isEqualToString:@"instructions2"] ) {
            m_instructionsSprite2 = imgInfo;
            [m_instructionsSprite2->sprite setOpacity:0]; // hide
        }
        if ( [imgInfo->name isEqualToString:@"instructions3"] ) {
            m_instructionsSprite3 = imgInfo;
            [m_instructionsSprite3->sprite setOpacity:0]; // hide
        }
    }
    
    // Create a contact listener and let the Box2D world know about it.
    m_contactListener = new PlanetCuteContactListener();
    m_world->SetContactListener( m_contactListener );

    // Give the listener a reference to this class, to use in the callback
    m_contactListener->m_layer = self;

    // set the movement control touches to nil initially
    m_leftTouch = nil;
    m_rightTouch = nil;
    
    // initialize the values for ground detection
    m_numFootContacts = 0;
    m_jumpTimeout = 0;
    
    // camera will start at body position
    m_cameraCenter = m_playerBody->GetPosition();
}


// This method should undo anything that was done by afterLoadProcessing, and make sure
// to call the superclass method so it can do the same
-(void)clear
{
    [[SimpleAudioEngine sharedEngine] unloadEffect:@"jump.wav"];
    [[SimpleAudioEngine sharedEngine] unloadEffect:@"pickupgem.wav"];
    [[SimpleAudioEngine sharedEngine] unloadEffect:@"pickupstar.wav"];
    
    m_playerBody = NULL;
    m_footSensorFixture = NULL;
    
    delete m_contactListener;
    
    for (PlanetCuteFixtureUserData* fud in m_allPickups)
        [fud release];
    
    [m_allPickups release];
    [m_pickupsToProcess release];
    
    [super clear];
}


// after every physics step, we need to check if the collision listener detected
// a collision that we should do something about. This info will be stored in the
// m_pickupsToProcess set
-(void) tick: (ccTime) dt
{
    // superclass will Step the physics world
    [super tick:dt];
    
    // loop over the list of pickups that were touched
    for (PlanetCuteFixtureUserData* fud in m_pickupsToProcess) {
        
        // play sound effect
        if ( fud->pickupType == PT_GEM )
            [[SimpleAudioEngine sharedEngine] playEffect:@"pickupgem.wav"];
        else if ( fud->pickupType == PT_STAR ) {
            [[SimpleAudioEngine sharedEngine] playEffect:@"pickupstar.wav"];
            // if the player touched the star, we also want to show the "Well done!" sprite
            if ( m_instructionsSprite3 )
                [m_instructionsSprite3->sprite setOpacity:255];
        }
        
        // clean up all references to the pickup that was collected
        [self removeBodyFromWorld:fud->body];
        [m_allPickups removeObject:fud];
        [fud release];
        
        // you would also keep score here, in a real game
    }
    
    // after processing all the pickups in the loop above, we need to clear the list
    [m_pickupsToProcess removeAllObjects];
    
    // make the pickups wobble around
    for (PlanetCuteFixtureUserData* fud in m_allPickups) {
        fud->bounceDeltaH += fud->bounceSpeedH;
        fud->bounceDeltaV += fud->bounceSpeedV;
        b2Vec2 pos = fud->originalPosition + b2Vec2( fud->bounceWidth * sin(fud->bounceDeltaH), fud->bounceHeight * sin(fud->bounceDeltaV) );
        fud->body->SetTransform( pos, 0 );
    }
    
    // decrement the jump timer - if this gets to zero the player can jump again
    m_jumpTimeout--;
    
    // define the sideways force that the player can move with
    float maxSpeed = 4;
    float maxForce = 20;
    if ( m_numFootContacts < 1 )
        maxForce *= 0.25; // reduce sideways force when in the air
    
    // determine whether the player should moved left or right depending
    // on which touches are currently active
    b2Vec2 currentVelocity = m_playerBody->GetLinearVelocity();
    float force = 0;
    bool moving = false;
    if ( m_leftTouch && !m_rightTouch && currentVelocity.x > -maxSpeed ) {
        force = -maxForce;
        moving = true;
    }
    else if ( !m_leftTouch && m_rightTouch && currentVelocity.x < maxSpeed ) {
        force = maxForce;
        moving = true;
    }
    else if ( !m_leftTouch && !m_rightTouch ) {
        // if no touches are active, the player wants to stop. Apply a half-strength
        // force in the opposite direction to current movement, scaled down so that
        // it is zero when actually stopped. This has the unfortunate side-effect of
        // preventing the player from moving together with a moving platform that it
        // is standing on, but that's a problem for another day.
        force = -currentVelocity.x * maxForce * 0.5;
    }
    
    // apply whatever force we decided on above...
    m_playerBody->ApplyForce( b2Vec2(force,0), m_playerBody->GetWorldCenter(), true );
    
    // if we are moving, the user no longer needs to see the "Touch left/right to move" message,
    // so we remove it from the layer. We also show the "Touch both sides to jump" sprite now.
    if ( moving && m_instructionsSprite1 ) {
        [self removeImageFromWorld:m_instructionsSprite1];
        m_instructionsSprite1 = nil;
        if ( m_instructionsSprite2 )
            [m_instructionsSprite2->sprite setOpacity:255];
    }
    
    // if all the conditions are met to allow a jump, use ApplyLinearImpulse to the player body.
    if ( m_leftTouch && m_rightTouch && m_numFootContacts > 0 && m_jumpTimeout <= 0 ) {
        m_playerBody->ApplyLinearImpulse( b2Vec2(0,5), m_playerBody->GetWorldCenter(), true );
        m_jumpTimeout = 15; // 1/4 second at 60 fps (prevents repeated jumps while the foot sensor is still touching the ground)
        [[SimpleAudioEngine sharedEngine] playEffect:@"jump.wav"];
        if ( m_instructionsSprite2 ) {
            // the user no longer needs to see the message explaining how to jump, so remove it
            [self removeImageFromWorld:m_instructionsSprite2];
            m_instructionsSprite2 = nil;
        }
    }

    // decide on a new point for the camera center. Look at where the player will be 2 seconds in the future
    // if they keep moving in the current direction, and move the camera a little bit toward that point.
    float cameraSmooth = 0.012;
    b2Vec2 playerPositionSoon = m_playerBody->GetPosition() + 2 * currentVelocity; //position 2 seconds from now
    m_cameraCenter = (1 - cameraSmooth) * m_cameraCenter + cameraSmooth * playerPositionSoon;
    
    // find out where the camera center is now, in pixels.
    b2Vec2 cameraCenterInPixels = [self scale] * m_cameraCenter;
    
    // we want to put move the layer so that cameraCenterInPixels is at the center of the screen, so
    // the layer needs to move by the difference between the screen center and cameraCenterInPixels
    CGSize s = [[CCDirector sharedDirector] winSize];
    CGPoint sceneOffset = CGPointMake(s.width/2 - cameraCenterInPixels.x, s.height/2 - cameraCenterInPixels.y);
    [self setPosition:sceneOffset];
}


// record when the user touches the left/right sides of the screen
- (void)ccTouchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    CGSize s = [[CCDirector sharedDirector] winSize];
    int middleOfScreen = s.width / 2;
    
    for (UITouch* touch in touches) {
        // if the touch location was on a side of the screen that we don't already
        // have a touch for, set that touch as the current touch for that side
        CGPoint screenPos = [touch locationInView:[touch view]];
        if ( !m_leftTouch && screenPos.x < middleOfScreen )
            m_leftTouch = touch;
        if ( !m_rightTouch && screenPos.x > middleOfScreen )
            m_rightTouch = touch;
    }
}


- (void)ccTouchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    // dont let the user pan and zoom the scene :)
}


// when a touch ends, we need to check if it was one of the touches for the
// screen sides that we recorded in ccTouchesBegan. If so, set the current
// touch for that screen side to nil
- (void)ccTouchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    for (UITouch* touch in touches) {
        if ( touch == m_leftTouch )
            m_leftTouch = nil;
        if ( touch == m_rightTouch )
            m_rightTouch = nil;
    }
}

@end




//-------------- Contact listener ------------------------

void PlanetCuteContactListener::BeginContact(b2Contact* contact)
{
    PlanetCuteRUBELayer* layer = (PlanetCuteRUBELayer*)m_layer;
    b2Fixture* fA = contact->GetFixtureA();
    b2Fixture* fB = contact->GetFixtureB();
    
    if ( fA == layer->m_footSensorFixture || fB == layer->m_footSensorFixture ) 
        layer->m_numFootContacts++;
    //CCLOG(@"Num foot contacts: %d", layer->m_numFootContacts);
    
    PlanetCuteFixtureUserData* fudA = (PlanetCuteFixtureUserData*)fA->GetUserData();
    PlanetCuteFixtureUserData* fudB = (PlanetCuteFixtureUserData*)fB->GetUserData();
    
    if ( fudA && fudA->fixtureType == FT_PICKUP && fB->GetBody() == layer->m_playerBody ) 
        [layer->m_pickupsToProcess addObject:fudA];
    if ( fudB && fudB->fixtureType == FT_PICKUP && fA->GetBody() == layer->m_playerBody ) 
        [layer->m_pickupsToProcess addObject:fudB];
}

void PlanetCuteContactListener::EndContact(b2Contact* contact)
{
    PlanetCuteRUBELayer* layer = (PlanetCuteRUBELayer*)m_layer;
    b2Fixture* fA = contact->GetFixtureA();
    b2Fixture* fB = contact->GetFixtureB();
    
    if ( fA == layer->m_footSensorFixture || fB == layer->m_footSensorFixture )
        layer->m_numFootContacts--;
    //CCLOG(@"Num foot contacts: %d", layer->m_numFootContacts);
}
















