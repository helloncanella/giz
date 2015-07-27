//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PlanetCuteScene
//
//  A simple platform game to demonstrate the following:
//   - detecting when a character is on the ground
//   - basic movement control
//   - basic camera following
//   - detecting collision with pickups
//   - simple sound effects
//   - removing bodies and images from world
//   - obtaining named items from RUBE scene
//   - using RUBE custom properties
//
//  The character can move and jump, and collect pickups. There
//  are two types of pickup which each play a different sound.
//
//  The pickups in the game have their category set from a custom
//  property given to them in RUBE, and are wobbled around according to
//  some custom properties as well.
//

#ifndef PLANETCUTESCENE_H
#define PLANETCUTESCENE_H

#include <set>
#include <SFML/Audio.hpp>
#include "RUBEScene.h"
#include "PlanetCuteFixtureUserData.h"

class b2dJsonImage_SFML;

class PlanetCuteScene : public RUBEScene, public b2ContactListener
{
    b2Body* m_playerBody;                               // duh...

    b2Fixture* m_footSensorFixture;                     // a small sensor fixture attached to the bottom of the player body to detect when it's standing on something
    int m_numFootContacts;                              // the current number of other fixtures touching the foot sensor. If this is > 0 the character is standing on something
    int m_jumpTimeout;                                  // decremented every tick, and set to a positive value when jumping. It's ok to jump if this is <= 0 (this is to prevent repeated jumps while the foot sensor is still touching the ground)

    std::set<_planetCuteFixtureUserData*> m_allPickups;         // an array containing every pickup in the scene. This is used to loop through every tick and make them wobble around.
    std::set<_planetCuteFixtureUserData*> m_pickupsToProcess;   // The contact listener will put some pickups in this set when the player touches them. After the Step has finished, the
                                                                //       layer will look in this list and process any pickups (remove them from world, play sound, count score etc).
                                                                //       This is made a set instead of an array because a set prevents duplicate objects from being added. Sometimes
                                                                //       a pickup can collide with more than one other fixture in the same time step (eg. the player and the foot sensor)
                                                                //       and looping through an array with duplicates would result in removing the same body from the scene twice -> crash.

    bool m_leftKeyDown;                                 // used to keep track of when the user is pressing key to move left
    bool m_rightKeyDown;                                // used to keep track of when the user is pressing key to move right
    bool m_jumpKeyDown;                                 // used to keep track of when user pressed jump key

    b2dJsonImage_SFML* m_instructionsSprite1;           // a sprite that says "Touch left/right half of screen to move"
    b2dJsonImage_SFML* m_instructionsSprite2;           // a sprite that says "Touch both sides together to jump"
    b2dJsonImage_SFML* m_instructionsSprite3;           // a sprite that says "Well done!"

    sf::SoundBuffer m_soundBuffer_jump;
    sf::SoundBuffer m_soundBuffer_pickupgem;
    sf::SoundBuffer m_soundBuffer_pickupstar;
    sf::Sound m_sound_jump;
    sf::Sound m_sound_pickupgem;
    sf::Sound m_sound_pickupstar;

public:
    PlanetCuteScene();

    void clear();

    void afterLoadProcessing(b2dJson* json);
    void step();
    void render();

    void keyDown(sf::Event::KeyEvent keyEvent);
    void keyUp(sf::Event::KeyEvent keyEvent);

    //override all the mouse event functions to do nothing
    void mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent);
    void mouseUp(sf::Event::MouseButtonEvent mouseButtonEvent);
    void mouseMove(sf::Event::MouseMoveEvent mouseMoveEvent);
    void mouseWheel(sf::Event::MouseWheelEvent mouseWheelEvent);

    void BeginContact(b2Contact* contact);              // called by Box2D during the Step function when two fixtures begin touching
    void EndContact(b2Contact* contact);                // called by Box2D during the Step function when two fixtures finish touching
};

#endif // PLANETCUTESCENE_H
