//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  DestroyBodyScene
//
//  Just to demonstrate removing bodies from the world. The only thing
//  different to the superclass is the mouseDown method.
//

#ifndef DESTROYBODYSCENE_H
#define DESTROYBODYSCENE_H

#include "RUBEScene.h"

class DestroyBodyScene : public RUBEScene
{
public:
    DestroyBodyScene();

    void mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent);
};

#endif // DESTROYBODYSCENE_H
