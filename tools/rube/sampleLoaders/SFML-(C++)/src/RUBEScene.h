//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  RUBEScene
//
//  This class extends PanZoomScene to load in a RUBE scene file.
//  It uses the debug draw display to show the scene, and also loads
//  images. The mouse event functions are used to create a mouse
//  joint to drag dynamic bodies around.
//

#ifndef RUBESCENE_H
#define RUBESCENE_H

#include "PanZoomScene.h"
#include <vector>

class b2World;
class b2dJson;
class b2dJsonImage_SFML;

class RUBEScene : public PanZoomScene
{
protected:
    std::string m_filename;
    b2World* m_world;

    std::vector<b2dJsonImage_SFML*> m_images;

    b2MouseJoint* m_mouseJoint;

public:
    RUBEScene();
    ~RUBEScene();

    virtual bool load(std::string filename);
    virtual void afterLoadProcessing(b2dJson* json);
    virtual void clear();

    virtual void step();
    virtual void render();

    virtual void keyDown(sf::Event::KeyEvent keyEvent);
    virtual void keyUp(sf::Event::KeyEvent keyEvent);
    virtual void mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent);
    virtual void mouseUp(sf::Event::MouseButtonEvent mouseButtonEvent);
    virtual void mouseMove(sf::Event::MouseMoveEvent mouseMoveEvent);

    virtual void removeImage(b2dJsonImage_SFML* image);
    virtual void removeBody(b2Body* body);

    void reorderImages();
};

#endif // RUBESCENE_H

