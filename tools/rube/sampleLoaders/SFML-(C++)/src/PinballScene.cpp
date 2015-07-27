//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PinballScene
//
//  See header file for description.
//

#include "PinballScene.h"
#include "rubestuff/b2dJson.h"
#include "b2dJsonImage_SFML.h"

using namespace std;

// use some names for fixture tags to keep things understandable
enum {
    PFT_LEVEL1  = 1,    // level-switch sensor for lower level
    PFT_LEVEL2  = 2,    // level-switch sensor for upper level
    PFT_BALL    = 3,    // the ball
    PFT_DROP    = 4,    // the vertical drop at the end of those chute thingies in the upper level
    PFT_GUTTER  = 5,    // the gutter at the bottom of the table

    PFT_MAX
};
const char* fixtureNames[] = {
    "level1",
    "level2",
    "ball",
    "drop",
    "gutter"
};


//--------------------------------------------------------------


PinballScene::PinballScene()
{
    m_leftFlipperOn = false;
    m_rightFlipperOn = false;
    m_ballFixture = NULL;
}

// This is called after the Box2D world has been loaded, and while the b2dJson information
// is still available to do extra loading. Here is where we obtain the named items in the scene.
void PinballScene::afterLoadProcessing(b2dJson* json)
{
    // call superclass method to load images etc
    RUBEScene::afterLoadProcessing(json);

    // find the ball fixture
    m_ballFixture = json->getFixtureByName("ball");

    // record the initial position of the ball body
    if ( b2Body* ballBody = json->getBodyByName("ball") )
        m_ballStartPosition = ballBody->GetPosition();

    // find flipper joints
    json->getJointsByName("flip_left", m_leftFlipperJoints);
    json->getJointsByName("flip_right", m_rightFlipperJoints);

    // find the imageInfo for the ball image
    m_ballImage = NULL;
    for (int i = 0; i < m_images.size(); i++)
        if ( m_images[i]->name == "ball" )
            m_ballImage = m_images[i];

    // look for fixtures that will be used in the collision callback, and
    // give them a 'tag' by setting their user data. Usually, the user data
    // would be a pointer to some type of object or structure with more
    // information (see the PlanetCute demo for an example) but for this
    // case we can simply set the user data to a plain old integer to denote
    // the type of each fixture.
    int numFixtureNames = sizeof(fixtureNames) / sizeof(char*);
    for (int i = 0; i < numFixtureNames; i++) {

        // get a list of fixtures with this name
        vector<b2Fixture*> switchFixtures;
        json->getFixturesByName(fixtureNames[i], switchFixtures);

        // set the 'tag' of all fixtures - note that this will give fixtures on
        // level1 and level2 tags of 1 and 2 respectively.
        for (int k = 0; k < switchFixtures.size(); k++)
            switchFixtures[k]->SetUserData((void*)(unsigned long)(i+1));
    }

    // Let the Box2D world know that this class is the contact listener
    m_world->SetContactListener( this );

    // set the initial states for the contact listener info
    m_needToSetLevel = 0;
    m_needToHaltVelocity = false;
    m_needToResetGame = false;

    // set initial flipper states to off
    m_leftFlipperOn = false;
    m_rightFlipperOn = false;
}


// This method should undo anything that was done by afterLoadProcessing, and make sure
// to call the superclass method so it can do the same
void PinballScene::clear()
{
    m_leftFlipperJoints.clear();
    m_rightFlipperJoints.clear();

    RUBEScene::clear();
}


// after every physics step, we need to check if the collision listener detected
// a collision that we should do something about. This info will be stored in the
// collision listener class itself
void PinballScene::step()
{
    //superclass will Step the physics world
    RUBEScene::step();

    // adjust the motor speed of the flippers according to whether the player
    // is touching them or not.
    float leftFlippersMotorSpeed = m_leftFlipperOn ? 20 : -10;
    float rightFlippersMotorSpeed = m_rightFlipperOn ? -20 : 10;
    for (int i = 0; i < m_leftFlipperJoints.size(); i++)
        ((b2RevoluteJoint*)m_leftFlipperJoints[i])->SetMotorSpeed( leftFlippersMotorSpeed );
    for (int i = 0; i < m_rightFlipperJoints.size(); i++)
        ((b2RevoluteJoint*)m_rightFlipperJoints[i])->SetMotorSpeed( rightFlippersMotorSpeed );

    // if the table needs to be reset, place the ball at the starting position
    if ( m_needToResetGame )
        m_ballFixture->GetBody()->SetTransform(m_ballStartPosition, 0);

    // if the ball should be halted, simply set its velocity to zero
    if ( m_needToHaltVelocity )
        m_ballFixture->GetBody()->SetLinearVelocity(b2Vec2(0,0));

    // if the ball touched a level-switch sensor, update the filter mask bits
    // for the ball fixture according to the level it just entered
    if ( m_needToSetLevel ) {

        // get the current filter
        b2Filter filter = m_ballFixture->GetFilterData();

        // update just the mask bits (the 4 here is to make sure the ball always
        // collides with the level-switch sensors
        filter.maskBits = 4 | m_needToSetLevel;

        // set the updated filter in the fixture, and refilter (the refilter may
        // be necessary in cases where the ball is already touching something that
        // it could collide with but now can't, or vice versa
        m_ballFixture->SetFilterData(filter);
        m_ballFixture->Refilter();
    }

    // if the level was switched, we should also reorder the ball sprite to
    // make it appear to go under the upper level parts of the table
    if ( m_ballImage ) {
        if ( m_needToSetLevel == 1 ) {
            m_ballImage->renderOrder = 15;
            reorderImages();
        }
        if ( m_needToSetLevel == 2 ) {
            m_ballImage->renderOrder = 25;
            reorderImages();
        }
    }

    // reset all the info in the collision listener
    m_needToResetGame = false;
    m_needToHaltVelocity = false;
    m_needToSetLevel = 0;
}

// Override this to skip debug draw
void PinballScene::render()
{
    applyView();

    //don't do debug draw

    //draw images
    for (int i = 0; i < (int)m_images.size(); i++)
        m_images[i]->render( worldToPixelDimension(1), worldToPixel(b2Vec2(0,0)) );
}

void PinballScene::keyDown(sf::Event::KeyEvent keyEvent)
{
    RUBEScene::keyDown(keyEvent);

    if ( keyEvent.code == sf::Keyboard::Z )
        m_leftFlipperOn = true;
    if ( keyEvent.code == sf::Keyboard::X )
        m_rightFlipperOn = true;
}

void PinballScene::keyUp(sf::Event::KeyEvent keyEvent)
{
    RUBEScene::keyUp(keyEvent);

    if ( keyEvent.code == sf::Keyboard::Z )
        m_leftFlipperOn = false;
    if ( keyEvent.code == sf::Keyboard::X )
        m_rightFlipperOn = false;
}


//-------------- Contact listener stuff ------------------------
// This function will be called by Box2D during the Step function. We can
// use the info in the contact to see which two fixtures collided, but we
// cannot fiddle with the Box2D world inside the contact listener.
//
// Instead, we just record what needs to be done after the Step has finished.
//
void PinballScene::BeginContact(b2Contact* contact)
{
    // we know that fixture datas are just integers
    unsigned long tagA = (unsigned long)contact->GetFixtureA()->GetUserData();
    unsigned long tagB = (unsigned long)contact->GetFixtureB()->GetUserData();

    // both fixtures should have a tag otherwise we don't care about them
    if ( tagA == 0 || tagB == 0 )
        return;

    // the repetitive and error-prone nature of these comparisons leads me to
    // make a macro to keep it easier to read...
#define COMPARETAGS( tag1, tag2 ) \
    ( (tagA == tag1 && tagB == tag2) || (tagA == tag2 && tagB == tag1) )


    // check if the ball touched a level-switch sensor
    if ( COMPARETAGS(PFT_BALL, PFT_LEVEL1) )
        m_needToSetLevel = 1;
    if ( COMPARETAGS(PFT_BALL, PFT_LEVEL2) )
        m_needToSetLevel = 2;

    // check if the ball touched the vertical drop at the end of an upper-level chute
    if ( COMPARETAGS(PFT_BALL, PFT_DROP) ) {
        m_needToHaltVelocity = true;
        m_needToSetLevel = 1;
    }

    // check if the ball touched the gutter at the bottom of the table
    if ( COMPARETAGS(PFT_BALL, PFT_GUTTER) ) {
        m_needToHaltVelocity = true;
        m_needToResetGame = true;
        m_needToSetLevel = 2;
    }
}




