//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PanZoomScene
//
//  This class represents a viewpoint (location and zoom) which can be
//  manipulated with the mouse. Dragging with right mouse button pans
//  the location, and scrolling the mouse wheel changes the zoom.
//
//  There are also useful functions for converting between screen and
//  world coordinates. The member variable m_mousePosWorld will always
//  be updated to hold the current position of the mouse cursor in the
//  physics world.
//
//  The applyView function will set the OpenGL modelview matrix ready
//  for drawing with the current view.

#ifndef PANZOOMSCENE_H
#define PANZOOMSCENE_H

#include <SFML/Graphics.hpp>
#include <SFML/OpenGL.hpp>
#include <Box2D/Box2D.h>

class PanZoomScene
{
protected:
    b2Vec2 m_viewCenter;            // current view center in physics world coordinates
    float m_viewVerticalSpan;       // how many physics units the view currently shows vertically

    bool m_lmbDown;                 // true if left mouse button is currently down
    bool m_rmbDown;                 // true if left mouse button is currently down

    sf::Vector2i m_lmbDownPosPixel; // the location the left mouse button was clicked at (only relevant if m_lmbDown)
    sf::Vector2i m_rmbDownPosPixel; // the location the left mouse button was clicked at (only relevant if m_rmbDown)

    sf::Vector2i m_mousePosPixel;   // the current location of the mouse cursor in screen coordinates
    b2Vec2 m_mousePosWorld;         // the current location of the mouse cursor in physics world coordinates

public:
    PanZoomScene();
    virtual ~PanZoomScene();

    virtual void setViewCenter(b2Vec2 center);
    virtual void setViewVerticalSpan(float span);
    virtual void applyView();

    virtual float pixelToWorldDimension(float pixelDimension);
    virtual float worldToPixelDimension(float worldDimension);
    virtual b2Vec2 pixelToWorld(sf::Vector2i pixelLocation);
    virtual sf::Vector2i worldToPixel(b2Vec2 worldLocation);

    virtual void mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent);
    virtual void mouseUp(sf::Event::MouseButtonEvent mouseButtonEvent);
    virtual void mouseMove(sf::Event::MouseMoveEvent mouseMoveEvent);
    virtual void mouseWheel(sf::Event::MouseWheelEvent mouseWheelEvent);
};

#endif // PANZOOMSCENE_H
