//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  PanZoomScene
//
//  See header file for description.
//

#include "PanZoomScene.h"
#include "Window.h"

PanZoomScene::PanZoomScene()
{    
    m_viewCenter.Set(0,0);
    m_viewVerticalSpan = 32;

    m_lmbDown = false;
    m_rmbDown = false;

    m_lmbDownPosPixel = sf::Vector2i(0,0);
    m_rmbDownPosPixel = sf::Vector2i(0,0);

    m_mousePosPixel = sf::Vector2i(0,0);
    m_mousePosWorld.SetZero();
}

PanZoomScene::~PanZoomScene()
{
}

void PanZoomScene::setViewCenter(b2Vec2 center)
{
    m_viewCenter = center;
}

void PanZoomScene::setViewVerticalSpan(float span)
{
    m_viewVerticalSpan = span;
}

// Sets up the OpenGL modelview matrix ready for rendering the current view area
void PanZoomScene::applyView()
{
    sf::Vector2u windowSize = getWindow()->getSize();
    float aspect = windowSize.x / (float)windowSize.y;
    float viewHorizontalSpan = m_viewVerticalSpan * aspect;
    float lx = m_viewCenter.x - 0.5f * viewHorizontalSpan;
    float ux = m_viewCenter.x + 0.5f * viewHorizontalSpan;
    float ly = m_viewCenter.y - 0.5f * m_viewVerticalSpan;
    float uy = m_viewCenter.y + 0.5f * m_viewVerticalSpan;

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho( lx, ux, ly, uy, -1, 1 );

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}

float PanZoomScene::pixelToWorldDimension(float pixelDimension)
{
    return pixelDimension * m_viewVerticalSpan / (float)getWindow()->getSize().y;
}

float PanZoomScene::worldToPixelDimension(float worldDimension)
{
    return worldDimension * getWindow()->getSize().y / m_viewVerticalSpan;
}

// Converts a position in screen pixels to a location in the physics world
b2Vec2 PanZoomScene::pixelToWorld(sf::Vector2i pixelLocation)
{
    sf::Vector2u windowSize = getWindow()->getSize();
    float ww = windowSize.x;
    float wh = windowSize.y;
    float aspect = ww / (float)wh;
    float viewHorizontalSpan = m_viewVerticalSpan * aspect;

    float xf = pixelLocation.x / (float)ww;
    float yf = (wh - pixelLocation.y) / (float)wh;

    float lx = m_viewCenter.x - 0.5f * viewHorizontalSpan;
    float ly = m_viewCenter.y - 0.5f * m_viewVerticalSpan;
    return b2Vec2( lx + xf * viewHorizontalSpan, ly + yf * m_viewVerticalSpan );
}

// Converts a location in the physics world to a position in screen pixels
sf::Vector2i PanZoomScene::worldToPixel(b2Vec2 worldLocation)
{
    sf::Vector2u windowSize = getWindow()->getSize();
    float ww = windowSize.x;
    float wh = windowSize.y;
    float aspect = ww / (float)wh;
    float viewHorizontalSpan = m_viewVerticalSpan * aspect;

    float lx = m_viewCenter.x - 0.5f * viewHorizontalSpan;
    float ly = m_viewCenter.y - 0.5f * m_viewVerticalSpan;

    float xf = (worldLocation.x - lx) / viewHorizontalSpan;
    float yf = (worldLocation.y - ly) / m_viewVerticalSpan;
    return sf::Vector2i( xf * ww, wh - yf * wh );
}

void PanZoomScene::mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent)
{
    if ( mouseButtonEvent.button == sf::Mouse::Left ) {
        m_lmbDown = true;
        m_lmbDownPosPixel = sf::Vector2i(mouseButtonEvent.x, mouseButtonEvent.y);
    }
    else if ( mouseButtonEvent.button == sf::Mouse::Right ) {
        m_rmbDown = true;
        m_rmbDownPosPixel = sf::Vector2i(mouseButtonEvent.x, mouseButtonEvent.y);
    }
}

void PanZoomScene::mouseUp(sf::Event::MouseButtonEvent mouseButtonEvent)
{
    if ( mouseButtonEvent.button == sf::Mouse::Left )
        m_lmbDown = false;
    else if ( mouseButtonEvent.button == sf::Mouse::Right )
        m_rmbDown = false;
}

void PanZoomScene::mouseMove(sf::Event::MouseMoveEvent mouseMoveEvent)
{
    sf::Vector2i newPosPixel = sf::Vector2i(mouseMoveEvent.x, mouseMoveEvent.y);
    if ( m_rmbDown ) {
        b2Vec2 delta = m_mousePosWorld - pixelToWorld(newPosPixel);
        setViewCenter( m_viewCenter + delta );
    }

    m_mousePosPixel = newPosPixel;
    m_mousePosWorld = pixelToWorld( m_mousePosPixel );
}

void PanZoomScene::mouseWheel(sf::Event::MouseWheelEvent mouseWheelEvent)
{
    b2Vec2 oldMousePos = m_mousePosWorld;

    if ( mouseWheelEvent.delta > 0 )
        m_viewVerticalSpan *= 1.1;
    else if ( mouseWheelEvent.delta < 0 )
        m_viewVerticalSpan /= 1.1;

    b2Vec2 newMousePos = pixelToWorld( m_mousePosPixel );
    setViewCenter( m_viewCenter + oldMousePos - newMousePos );
}
