//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  DestroyBodyScene
//
//  See header file for description.
//

#include "DestroyBodyScene.h"
#include "QueryCallbacks.h"

DestroyBodyScene::DestroyBodyScene()
{
}

// Override this to find the body that was touched and remove it
void DestroyBodyScene::mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent)
{
    RUBEScene::mouseDown(mouseButtonEvent); // caution - this might create a mouse joint! Remember to set m_mouseJoint back to NULL if we removed the body (see end of this function)

    if ( ! m_world )
        return;

    // Make a small box around the touched point to query for overlapping fixtures
    b2AABB aabb;
    b2Vec2 d(0.001f, 0.001f);
    aabb.lowerBound = m_mousePosWorld - d;
    aabb.upperBound = m_mousePosWorld + d;

    // Query the world for overlapping fixtures (the TouchDownQueryCallback simply
    // looks for any fixture that contains the touched point)
    MouseDownQueryCallback callback(m_mousePosWorld);
    m_world->QueryAABB(&callback, aabb);

    // Check if we found something, and it was a dynamic body (could also destroy static
    // bodies but we want to keep the pinch-zoom and pan from the superclass, and it's
    // hard not to touch the ground body in this scene)
    if (callback.m_fixture && callback.m_fixture->GetBody()->GetType() == b2_dynamicBody)
    {
        b2Body* touchedBody = callback.m_fixture->GetBody();
        removeBody(touchedBody);
    }

    // If we destroyed a body, we should also set the m_mouseJoint member back to NULL, because
    // the joint will also have been destroyed.
    m_mouseJoint = NULL;
}
