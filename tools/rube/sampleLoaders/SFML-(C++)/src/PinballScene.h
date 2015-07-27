//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PinballScene
//
//  Extends RUBEScene to demonstrate how specific items in
//  the RUBE scene can be obtained and controlled. Also shows
//  simple use of a contact listener to detect collisions.
//
//  To be more specific, we want to obtain these items after loading:
//   - flipper joints
//   - flipper button fixtures
//   - ball fixture
//   - gutter fixture
//   - sensors to switch ball between lower and upper levels
//
//  The reason we want the flipper joints and buttons should be obvious.
//  The gutter fixture at the bottom of the table is used to check for
//  collisions with the ball, and reset the game.
//
//  Parts of the table have overlapping tracks/walls which in the real
//  world are on separate levels vertically. When the ball is on the
//  lower level it does not collide with any of the tracks and walls
//  of the upper level, and vice versa. To replicate this in 2d we have
//  to keep track of the current level the ball is on, and ignore any
//  collisions with the other level.
//
//  In this demo, we are changing the collision filter (mask bits) of
//  the ball fixture, and this will take care of ignoring tracks/walls
//  of the other level. All fixtures on the lower level have their
//  category bits set to 1, and the upper level fixtures are all set
//  to 2.
//
//  To know when the mask bits of the ball should be changed, there
//  are sensors placed around the table at important places to detect
//  when the ball has changed levels. (Around these areas the category
//  bits of the walls are set to 3 so that the ball always collides
//  with them.)
//
//  Here are the filter categories used:
//   1 - lower level walls
//   2 - upper level walls
//   4 - level-switch sensors

#ifndef PINBALLSCENE_H
#define PINBALLSCENE_H

#include <vector>
#include <Box2D/Box2D.h>
#include "RUBEScene.h"

class PinballScene : public RUBEScene, public b2ContactListener
{
    std::vector<b2Joint*> m_leftFlipperJoints;                  // used to make the flippers... flip (this is a vector to make it easy to add more flippers later)
    std::vector<b2Joint*> m_rightFlipperJoints;                 // used to make the flippers... flip (this is a vector to make it easy to add more flippers later)

    bool m_leftFlipperOn;                                       // used to keep track of which flipper buttons are currently pressed
    bool m_rightFlipperOn;                                      // used to keep track of which flipper buttons are currently pressed

    b2Fixture* m_ballFixture;                                   // need this to change the collision filter mask bits when switching levels
    b2Vec2 m_ballStartPosition;                                 // need this to know where to put the ball when resetting the table

    b2dJsonImage_SFML* m_ballImage;                             // need this to reorder the ball image when the ball changes levels, to make it look like it is going under the upper level properly

    int m_needToSetLevel;                                       // when the ball touches a level-switch sensor, this will be set to the level to switch to, otherwise it will be zero
    bool m_needToHaltVelocity;                                  // when the ball touches the end of one of the upper level tracks, this will be set to true, so we know to momentarily halt it (so it looks like it dropped vertically)
    bool m_needToResetGame;                                     // when the ball touches the gutter fixture at the bottom of the table, this will be set to true

public:
    PinballScene();

    void clear();

    void afterLoadProcessing(b2dJson* json);
    void step();
    void render();

    void keyDown(sf::Event::KeyEvent keyEvent);
    void keyUp(sf::Event::KeyEvent keyEvent);

    virtual void BeginContact(b2Contact* contact);      // called by Box2D during the Step function when two fixtures begin touching
};

#endif // PINBALLSCENE_H
