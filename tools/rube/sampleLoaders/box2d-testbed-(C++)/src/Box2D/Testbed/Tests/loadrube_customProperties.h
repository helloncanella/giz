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

#ifndef LOADRUBE_CUSTOMPROPERTIES_H
#define LOADRUBE_CUSTOMPROPERTIES_H

#include "rubestuff/b2dJson.h"

struct WobblyProperties {
    b2Vec2 basePos;         //starting position
    float horizontalRange;  //oscillation range
    float verticalRange;    //oscillation range
    float speed;            //oscillation speed
};

// This example demonstrates how you can access the custom property values
// in your own program. After loading the world from JSON, all bodies with
// a custom string property matching "wobbly" are obtained, and they are
// also checked for some float properties specifying a range of movement.
// and a speed. These ranges and speed are stored and used to move the bodies.

class LoadRUBE_CustomProperties : public Test
{
public:
    LoadRUBE_CustomProperties()
	{
		b2dJson json;
        string errorMsg;
        b2World* world = json.readFromFile( "rubeRawInfoOutput_customProperties.json", errorMsg );
        if ( world ) {
            //replace testbed world
            delete m_world;
            m_world = world;

            //re-set standard testbed stuff
            m_world->SetDestructionListener(&m_destructionListener);
            m_world->SetContactListener(this);
            m_world->SetDebugDraw(&m_debugDraw);

            //re-create body needed for testbed mousejoint
            b2BodyDef bodyDef;
            m_groundBody = m_world->CreateBody(&bodyDef);

            //find all bodies with custom property 'category' value matching 'wobbly'
            vector<b2Body*> wobblyBodies;
            json.getBodiesByCustomString("category", "wobbly", wobblyBodies);

            //look at some other custom properties of these bodies and store them
            for (int i = 0; i < (int)wobblyBodies.size(); i++) {
                b2Body* b = wobblyBodies[i];
                WobblyProperties wp;
                wp.basePos = b->GetPosition();
                wp.horizontalRange = json.getCustomFloat(b, "horzRange", 0);
                wp.verticalRange = json.getCustomFloat(b, "vertRange", 0);
                wp.speed = json.getCustomFloat(b, "speed", 0);
                m_wobblyBodyPropertiesMap[b] = wp;
            }
        }
        else {
            printf("Could not load JSON file.\n"); fflush(stdout);
        }
    }

    void Step(Settings* settings)
    {
        Test::Step(settings);

        m_timePassed += 1 / settings->hz;

        //use the custom properties to move the wobbly bodies around
        std::map<b2Body*, WobblyProperties>::iterator it = m_wobblyBodyPropertiesMap.begin();
        std::map<b2Body*, WobblyProperties>::iterator end = m_wobblyBodyPropertiesMap.end();
        while (it != end) {
            b2Body* b = it->first;
            WobblyProperties& wp = it->second;
            b2Vec2 pos = wp.basePos + b2Vec2( sin(m_timePassed*wp.speed) * wp.horizontalRange, cos(m_timePassed*wp.speed) * wp.verticalRange );
            b->SetTransform(pos, 0);
            ++it;
        }

    }

	static Test* Create()
	{
        return new LoadRUBE_CustomProperties;
    }

    std::map<b2Body*, WobblyProperties> m_wobblyBodyPropertiesMap;
    float m_timePassed;
};

#endif

