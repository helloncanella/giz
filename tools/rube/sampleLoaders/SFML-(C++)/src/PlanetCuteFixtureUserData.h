//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PlanetCuteFixtureUserData
//
//  For this example we want to have more information associated
//  with items in the scene than a simple integer tag. This class
//  holds all the info about a fixture, and will be set in the
//  fixture user data for relevant fixtures.
//
//  A lot of the information held in this class actually relates
//  to bodies, so it could just as easily been placed in the user
//  data for bodies instead, especially for this example because
//  we're mostly dealing with the gems, which all have their own
//  body anyway.
//
//  On the other hand, when we have things to collide with that
//  do not have a body each (eg. many fixtures attached to the
//  ground body) then we will need to keep user data in fixtures
//  to differentiate them.
//
//  A body can be obtained from a fixture with GetBody(), so for
//  this demo we will just place all user data in fixtures, and
//  use GetBody() where necessary to use the body itself.
//

#include <Box2D/Box2D.h>

// broad categories to organize fixtures into
enum _fixtureType {
    FT_PLAYER,
    FT_PICKUP
};

// more detailed sub-categories for pickups
enum _pickupType {
    PT_GEM,
    PT_STAR
};

struct _planetCuteFixtureUserData
{
    _fixtureType fixtureType;
    _pickupType pickupType;
    b2Body* body;
    
    b2Vec2 originalPosition;
    float bounceDeltaH;
    float bounceDeltaV;
    float bounceSpeedH;
    float bounceSpeedV;
    float bounceWidth;
    float bounceHeight;
};
