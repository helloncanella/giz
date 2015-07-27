//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PlanetCuteScene
//
//  See header file for description.
//

#include "PlanetCuteScene.h"
#include "rubestuff/b2dJson.h"
#include "b2dJsonImage_SFML.h"

using namespace std;

PlanetCuteScene::PlanetCuteScene()
{
    m_playerBody = NULL;

    m_footSensorFixture = NULL;
    m_numFootContacts = 0;
    m_jumpTimeout = 0;

    m_leftKeyDown = false;
    m_rightKeyDown = false;
    m_jumpKeyDown = false;

    m_instructionsSprite1 = NULL;
    m_instructionsSprite2 = NULL;
    m_instructionsSprite3 = NULL;
}

// This method should undo anything that was done by afterLoadProcessing, and make sure
// to call the superclass method so it can do the same
void PlanetCuteScene::clear()
{
    m_playerBody = NULL;
    m_footSensorFixture = NULL;

    set<_planetCuteFixtureUserData*>::iterator it = m_allPickups.begin();
    set<_planetCuteFixtureUserData*>::iterator end = m_allPickups.end();
    while (it != end) {
        _planetCuteFixtureUserData* fud = *it;
        delete fud;
        it++;
    }
    m_allPickups.clear();

    RUBEScene::clear();
}

// This is called after the Box2D world has been loaded, and while the b2dJson information
// is still available to do extra loading. Here is where we obtain the named items in the scene.
void PlanetCuteScene::afterLoadProcessing(b2dJson *json)
{
    // call superclass method to load images etc
    RUBEScene::afterLoadProcessing(json);

    // load the sound effects
    if ( !m_soundBuffer_jump.loadFromFile("sounds/jump.wav") ) cout << "Could not load sound jump.wav" << endl;
    if ( !m_soundBuffer_pickupgem.loadFromFile("sounds/pickupgem.wav") ) cout << "Could not load sound pickupgem.wav" << endl;
    if ( !m_soundBuffer_pickupstar.loadFromFile("sounds/pickupstar.wav") ) cout << "Could not load sound pickupstar.wav" << endl;
    m_sound_jump.setBuffer(m_soundBuffer_jump);
    m_sound_pickupgem.setBuffer(m_soundBuffer_pickupgem);
    m_sound_pickupstar.setBuffer(m_soundBuffer_pickupstar);

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
        _planetCuteFixtureUserData* fud = new _planetCuteFixtureUserData;
        m_allPickups.insert(fud);
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
        fud->bounceDeltaH = std::rand() / (float)RAND_MAX * M_PI_2;
        fud->bounceDeltaV = std::rand() / (float)RAND_MAX * M_PI_2;
    }

    // find the imageInfos for the text instruction images. Sprites 2 and 3 are
    // hidden initially
    m_instructionsSprite1 = NULL;
    m_instructionsSprite2 = NULL;
    m_instructionsSprite2 = NULL;
    for (int i = 0; i < m_images.size(); i++) {
        b2dJsonImage_SFML* img = m_images[i];
        if ( img->name == "instructions1" )
            m_instructionsSprite1 = img;
        if ( img->name == "instructions2" ) {
            m_instructionsSprite2 = img;
            m_instructionsSprite2->setAlpha(0); // hide by setting alpha to zero
        }
        if ( img->name == "instructions3" ) {
            m_instructionsSprite3 = img;
            m_instructionsSprite3->setAlpha(0); // hide by setting alpha to zero
        }
    }

    // Let the Box2D world know that this class is the contact listener
    m_world->SetContactListener( this );

    // set the movement control touches to nil initially
    m_leftKeyDown = false;
    m_rightKeyDown = false;
    m_jumpKeyDown = false;

    // initialize the values for ground detection
    m_numFootContacts = 0;
    m_jumpTimeout = 0;

    // camera will start at body position
    setViewCenter( m_playerBody->GetPosition() );
}

void PlanetCuteScene::step()
{
    // superclass will Step the physics world
    RUBEScene::step();

    // loop over the list of pickups that were touched
    set<_planetCuteFixtureUserData*>::iterator it = m_pickupsToProcess.begin();
    set<_planetCuteFixtureUserData*>::iterator end = m_pickupsToProcess.end();
    while (it != end) {
        _planetCuteFixtureUserData* fud = *it;
        // play sound effect
        if ( fud->pickupType == PT_GEM )
            m_sound_pickupgem.play();
        else if ( fud->pickupType == PT_STAR ) {
            m_sound_pickupstar.play();
            // if the player touched the star, we also want to show the "Well done!" sprite
            if ( m_instructionsSprite3 )
                m_instructionsSprite3->setAlpha(1);
        }

        // clean up all references to the pickup that was collected
        removeBody(fud->body);
        m_allPickups.erase(fud);
        delete fud;

        // you would also keep score here, in a real game

        it++;
    }

    // after processing all the pickups in the loop above, we need to clear the list
    m_pickupsToProcess.clear();

    // make the pickups wobble around
    it = m_allPickups.begin();
    end = m_allPickups.end();
    while (it != end) {
        _planetCuteFixtureUserData* fud = *it;
        fud->bounceDeltaH += fud->bounceSpeedH;
        fud->bounceDeltaV += fud->bounceSpeedV;
        b2Vec2 pos = fud->originalPosition + b2Vec2( fud->bounceWidth * sin(fud->bounceDeltaH), fud->bounceHeight * sin(fud->bounceDeltaV) );
        fud->body->SetTransform( pos, 0 );
        it++;
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
    if ( m_leftKeyDown && !m_rightKeyDown && currentVelocity.x > -maxSpeed ) {
        force = -maxForce;
        moving = true;
    }
    else if ( !m_leftKeyDown && m_rightKeyDown && currentVelocity.x < maxSpeed ) {
        force = maxForce;
        moving = true;
    }
    else if ( !m_leftKeyDown && !m_rightKeyDown ) {
        // if no keys are active, the player wants to stop. Apply a half-strength
        // force in the opposite direction to current movement, scaled down so that
        // it is zero when actually stopped. This has the unfortunate side-effect of
        // preventing the player from moving together with a moving platform that it
        // is standing on, but that's a problem for another day.
        force = -currentVelocity.x * maxForce * 0.5;
    }

    // apply whatever force we decided on above...
    m_playerBody->ApplyForce( b2Vec2(force,0), m_playerBody->GetWorldCenter(), true );

    // if we are moving, the user no longer needs to see the "how to move" message,
    // so we remove it from the layer. We also show the "how to jump" sprite now.
    if ( moving && m_instructionsSprite1 ) {
        removeImage(m_instructionsSprite1);
        m_instructionsSprite1 = NULL;
        if ( m_instructionsSprite2 )
            m_instructionsSprite2->setAlpha(1); // show by setting alpha to full
    }

    // if all the conditions are met to allow a jump, use ApplyLinearImpulse to the player body.
    if ( m_jumpKeyDown && m_numFootContacts > 0 && m_jumpTimeout <= 0 ) {
        m_playerBody->ApplyLinearImpulse( b2Vec2(0,5), m_playerBody->GetWorldCenter(), true );
        m_jumpTimeout = 15; // 1/4 second at 60 fps (prevents repeated jumps while the foot sensor is still touching the ground)
        m_sound_jump.play();
        if ( m_instructionsSprite2 ) {
            // the user no longer needs to see the message explaining how to jump, so remove it
            removeImage(m_instructionsSprite2);
            m_instructionsSprite2 = NULL;
        }
    }

    // decide on a new point for the camera center. Look at where the player will be 2 seconds in the future
    // if they keep moving in the current direction, and move the camera a little bit toward that point.
    float cameraSmooth = 0.012;
    b2Vec2 playerPositionSoon = m_playerBody->GetPosition() + 2 * currentVelocity; //position 2 seconds from now
    b2Vec2 newCameraCenter = (1 - cameraSmooth) * m_viewCenter + cameraSmooth * playerPositionSoon;
    setViewCenter(newCameraCenter);
}

void PlanetCuteScene::render()
{
    applyView();

    //don't do debug draw

    //draw images
    for (int i = 0; i < (int)m_images.size(); i++)
        m_images[i]->render( worldToPixelDimension(1), worldToPixel(b2Vec2(0,0)) );
}

void PlanetCuteScene::keyDown(sf::Event::KeyEvent keyEvent)
{
    RUBEScene::keyDown(keyEvent);

    if ( keyEvent.code == sf::Keyboard::J )
        m_leftKeyDown = true;
    if ( keyEvent.code == sf::Keyboard::K )
        m_rightKeyDown = true;
    if ( keyEvent.code == sf::Keyboard::Space )
        m_jumpKeyDown = true;
}

void PlanetCuteScene::keyUp(sf::Event::KeyEvent keyEvent)
{
    RUBEScene::keyUp(keyEvent);

    if ( keyEvent.code == sf::Keyboard::J )
        m_leftKeyDown = false;
    if ( keyEvent.code == sf::Keyboard::K )
        m_rightKeyDown = false;
    if ( keyEvent.code == sf::Keyboard::Space )
        m_jumpKeyDown = false;
}

void PlanetCuteScene::mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent)
{
    //do nothing
}

void PlanetCuteScene::mouseUp(sf::Event::MouseButtonEvent mouseButtonEvent)
{
    //do nothing
}

void PlanetCuteScene::mouseMove(sf::Event::MouseMoveEvent mouseMoveEvent)
{
    //do nothing
}

void PlanetCuteScene::mouseWheel(sf::Event::MouseWheelEvent mouseWheelEvent)
{
    //do nothing
}

void PlanetCuteScene::BeginContact(b2Contact* contact)
{
    b2Fixture* fA = contact->GetFixtureA();
    b2Fixture* fB = contact->GetFixtureB();

    if ( fA == m_footSensorFixture || fB == m_footSensorFixture )
        m_numFootContacts++;

    _planetCuteFixtureUserData* fudA = (_planetCuteFixtureUserData*)fA->GetUserData();
    _planetCuteFixtureUserData* fudB = (_planetCuteFixtureUserData*)fB->GetUserData();

    if ( fudA && fudA->fixtureType == FT_PICKUP && fB->GetBody() == m_playerBody )
        m_pickupsToProcess.insert(fudA);
    if ( fudB && fudB->fixtureType == FT_PICKUP && fA->GetBody() == m_playerBody )
        m_pickupsToProcess.insert(fudB);
}

void PlanetCuteScene::EndContact(b2Contact* contact)
{
    b2Fixture* fA = contact->GetFixtureA();
    b2Fixture* fB = contact->GetFixtureB();

    if ( fA == m_footSensorFixture || fB == m_footSensorFixture )
        m_numFootContacts--;
}

