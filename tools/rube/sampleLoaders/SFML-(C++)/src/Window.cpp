
#include <SFML/Window.hpp>
#include <SFML/Graphics.hpp>
#include <SFML/OpenGL.hpp>
#include <iostream>
#include <sstream>
#include <stdio.h>

#include "RUBEScene.h"
#include "DestroyBodyScene.h"
#include "PinballScene.h"
#include "PlanetCuteScene.h"

using namespace std;


// The window dimensions are necessary for functions that convert between
// pixel and physics world coordinates. The window instance is a local
// variable inside the main() function, but we can access via a function
// like this. I guess a simple global variable would also suffice.
sf::RenderWindow* windowPtr;
sf::RenderWindow* getWindow()
{
    return windowPtr;
}

// The currently running scene
int currentTestNum = 0;
RUBEScene* scene = NULL;

// This function sets up the appropriate scene, using currentTestNum as
// an id number to select scenes.
#define NUM_TESTS 5
void changeTest(int incOrDec)
{
    // get rid of the old scene if there was one
    if ( scene )
        delete scene;
    scene = NULL;

    // change the current test number
    currentTestNum = (currentTestNum + NUM_TESTS + incOrDec) % NUM_TESTS;

    // load the appropriate scene type
    if ( currentTestNum == 0 ) {
        scene = new RUBEScene();
        scene->load("jointTypes.json");
        scene->setViewCenter( b2Vec2(0,3) );
        scene->setViewVerticalSpan( 10 );
    }
    else if ( currentTestNum == 1 ) {
        scene = new RUBEScene();
        scene->load("images.json");
        scene->setViewCenter( b2Vec2(0,0) );
        scene->setViewVerticalSpan( 32 );
    }
    else if ( currentTestNum == 2 ) {
        scene = new DestroyBodyScene();
        scene->load("images.json");
        scene->setViewCenter( b2Vec2(0,0) );
        scene->setViewVerticalSpan( 32 );
    }
    else if ( currentTestNum == 3 ) {
        scene = new PinballScene();
        scene->load("pinball.json");
        scene->setViewCenter( b2Vec2(0,24) );
        scene->setViewVerticalSpan( 50 );
    }
    else if ( currentTestNum == 4 ) {
        scene = new PlanetCuteScene();
        scene->load("planetcute.json");
        scene->setViewCenter( b2Vec2(0,0) );
        scene->setViewVerticalSpan( 8 );
    }
}

// a convenience function to display something useful about each scene
string getInfoString()
{
    switch (currentTestNum) {
    case 0: return "Simple scene to check joint types and coordinate conversions (world/pixel).";
    case 1: return "Simple scene to check image loading.";
    case 2: return "This scene demonstrates removing bodies. Click dynamic bodies to remove them.";
    case 3: return "Simple pinball game - use Z and X keys to play.";
    case 4: return "Simple platform game.";
    default:;
    }
    return "";
}


int main()
{
    sf::RenderWindow window( sf::VideoMode(800, 600, 32), "rube-SFML", sf::Style::Default);

    // after creating the window, set the reference to it so that the size can be
    // checked from other parts of the source code
    windowPtr = &window;

    sf::Clock stepClock;
    sf::Clock fpsClock;

    int frameNumber = 0;
    int lastFPSFrame = 0;

    sf::Font MyFont;
    const char* fontfile = "UbuntuMono-R.ttf";
    if ( ! MyFont.loadFromFile(fontfile) )
        cout << "Could not load font file: " << fontfile << endl;
    else
        cout << "Loaded font file: " << fontfile << endl;

    sf::Text displayText("", MyFont);
    displayText.setColor( sf::Color(0, 192, 0) );
    displayText.setPosition(5, 0);
    displayText.setCharacterSize(16);

    // load the first scene
    changeTest(0);

    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            // detect quit condition
            if (event.type == sf::Event::Closed)
                window.close();
            if ((event.type == sf::Event::KeyPressed) && (event.key.code == sf::Keyboard::Escape))
                window.close();

            // detect scene change
            if ((event.type == sf::Event::KeyPressed) && (event.key.code == sf::Keyboard::Left))
                changeTest(-1);
            if ((event.type == sf::Event::KeyPressed) && (event.key.code == sf::Keyboard::Right))
                changeTest(1);

            if (event.type == sf::Event::Resized)
                glViewport(0, 0, event.size.width, event.size.height);

            // pass important events on to the scene to handle
            if (event.type == sf::Event::KeyPressed)
                scene->keyDown(event.key);
            else if (event.type == sf::Event::KeyReleased)
                scene->keyUp(event.key);
            else if (event.type == sf::Event::MouseButtonPressed)
                scene->mouseDown(event.mouseButton);
            else if (event.type == sf::Event::MouseButtonReleased)
                scene->mouseUp(event.mouseButton);
            else if (event.type == sf::Event::MouseMoved)
                scene->mouseMove(event.mouseMove);
            else if (event.type == sf::Event::MouseWheelMoved)
                scene->mouseWheel(event.mouseWheel);
        }

        if ( window.isOpen()) { // window might actually be closed here, due to the window.close() calls in the loop above

            // check if enough time has passed to do a physics step
            if ( stepClock.getElapsedTime().asMilliseconds() >= 1000/60.0f) {
                scene->step();
                stepClock.restart();
            }
            else
                sf::sleep( sf::milliseconds(1) );

            // Activate the window for OpenGL rendering
            window.setActive();
            window.clear();

            // draw the scene
            window.pushGLStates();
            scene->render();
            window.popGLStates();

            // draw the fps counter and scene info
            window.pushGLStates();
            window.setView( sf::View( sf::FloatRect(0,0,window.getSize().x,window.getSize().y) ) );
            window.draw(displayText);
            window.popGLStates();

            // present
            window.display();

            // update fps counter and scene info every one second
            if ( fpsClock.getElapsedTime().asMilliseconds() > 1000 ) {
                char buf[256];
                sprintf(buf, "%s\n%s\nFPS: %d", getInfoString().c_str(), "Use left/right arrow keys to change scenes, R to reset.", frameNumber - lastFPSFrame);
                displayText.setString( buf );
                lastFPSFrame = frameNumber;
                fpsClock.restart();
            }
        }

        frameNumber++;
    }

    if ( scene )
        delete scene;

    return EXIT_SUCCESS;
}



