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

#ifndef LOADRUBE_H
#define LOADRUBE_H

//todo: cleanup textures in destructor

#include "rubestuff/b2dJson.h"
#include "rubestuff/b2dJsonImage_OpenGL.h"

class LoadRUBE : public Test
{
public:
	LoadRUBE()
	{
		b2dJson json;
        string errorMsg;
        b2World* world = json.readFromFile( "rubeRawInfoOutput.json", errorMsg );
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

            //load images
            vector<b2dJsonImage*> images;
            json.getAllImages(images);
            for (int i = 0; i < (int)images.size(); i++) {
                b2dJsonImage* img = new b2dJsonImage_OpenGL( images[i] );
                m_images.push_back( img );
            }
        }
        else {
            printf("Could not load JSON file.\n"); fflush(stdout);
        }
    }

    void Step(Settings* settings)
    {
        Test::Step(settings);

        //draw images
        for (int i = 0; i < (int)m_images.size(); i++) 
			m_images[i]->render();
    }

	static Test* Create()
	{
		return new LoadRUBE;
	}

    vector<b2dJsonImage*> m_images;
};

#endif

