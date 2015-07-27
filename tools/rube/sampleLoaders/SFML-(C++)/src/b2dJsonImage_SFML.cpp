/*
* Author: Chris Campbell - www.iforce2d.net
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

#include "b2dJsonImage_SFML.h"
#include "Window.h"

#include <iostream>
using namespace std;

#ifndef DEGTORAD
#define DEGTORAD 0.0174532925199432957f
#define RADTODEG 57.295779513082320876f
#endif

b2dJsonImage_SFML::b2dJsonImage_SFML(const b2dJsonImage *other) : b2dJsonImage(other)
{
    loadImage();
}

b2dJsonImage_SFML::~b2dJsonImage_SFML()
{
}

bool b2dJsonImage_SFML::loadImage()
{
    if (!m_texture.loadFromFile(file)) {
        cout << "Could not load image: " << file << endl;
        return false;
    }

    m_sprite.setTexture(m_texture);

    sf::FloatRect rect = m_sprite.getLocalBounds();
    m_sprite.setOrigin( 0.5 * rect.width, 0.5 * rect.height );
    m_sprite.setColor( sf::Color(colorTint[0], colorTint[1], colorTint[2], colorTint[3] * opacity) );

    cout << "Loaded image: " << file << endl;

    return false;
}

void b2dJsonImage_SFML::render(float ptm, sf::Vector2i worldOrigin)
{
    float s = ptm * scale / (float)m_sprite.getLocalBounds().height;
    m_sprite.setScale(aspectScale * s * (flip?-1:1),s);

    b2Vec2 pos = center;
    float ang = -angle;
    if ( body ) {
        //need to rotate image local center by body angle
        b2Vec2 localPos( pos.x, pos.y );
        b2Rot rot( body->GetAngle() );
        localPos = b2Mul(rot, localPos) + body->GetPosition();
        pos.x = localPos.x;
        pos.y = localPos.y;
        ang += -body->GetAngle();
    }
    m_sprite.setRotation( ang * RADTODEG );
    m_sprite.setPosition( worldOrigin.x + ptm * pos.x,  worldOrigin.y + ptm * -pos.y);

    getWindow()->draw(m_sprite);
}

void b2dJsonImage_SFML::setAlpha(float a)
{
    m_sprite.setColor( sf::Color(colorTint[0], colorTint[1], colorTint[2], colorTint[3] * opacity * a) );
}





