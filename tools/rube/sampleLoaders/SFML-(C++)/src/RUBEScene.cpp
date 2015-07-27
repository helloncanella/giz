#include "RUBEScene.h"

#include "rubestuff/b2dJson.h"
#include "b2dJsonImage_SFML.h"
#include "DebugDraw.h"
#include "QueryCallbacks.h"

using namespace std;

DebugDraw debugDraw;

//---------------------------------------

bool compareImagesByRenderOrder_ascending(const b2dJsonImage_SFML* a, const b2dJsonImage_SFML* b)
{
    return a->renderOrder < b->renderOrder;
}

//---------------------------------------

RUBEScene::RUBEScene()
{
    m_filename = "";
    m_world = NULL;

    m_mouseJoint = NULL;
}

RUBEScene::~RUBEScene()
{
    clear();
}

// Attempts to load the world from the .json file given by filename.
// If successful, the function afterLoadProcessing will also be called,
// to allow subclasses to do something extra while the b2dJson information
// is still available.
bool RUBEScene::load(std::string filename)
{
    // The clear method should undo anything that is done in this method,
    // and also whatever is done in the afterLoadProcessing method.
    clear();

    m_filename = filename;

    // Create the world from the contents of the RUBE .json file. If something
    // goes wrong, m_world will remain NULL and errMsg will contain some info
    // about what happened.
    b2dJson json;
    std::string errMsg;
    m_world = json.readFromFile(filename.c_str(), errMsg);

    if ( ! m_world ) {
        cout << "Failed to load scene from " << filename << " : " << errMsg << endl;
        return false;
    }

    // Set up a debug draw so we can see what's going on in the physics engine.
    debugDraw.SetFlags( b2Draw::e_shapeBit );
    m_world->SetDebugDraw(&debugDraw);

    cout << "Loaded scene from " << filename << endl;

    // do whatever else needs to be done when loading
    afterLoadProcessing(&json);

    return true;
}

// Override this in subclasses to do some extra processing (eg. acquire references
// to named bodies, joints etc) after the world has been loaded, and while the b2dJson
// information is still available.
void RUBEScene::afterLoadProcessing(b2dJson *json)
{
    //load images
    vector<b2dJsonImage*> images;
    json->getAllImages(images);
    for (int i = 0; i < (int)images.size(); i++) {
        b2dJsonImage_SFML* img = new b2dJsonImage_SFML( images[i] );
        m_images.push_back( img );
    }
    reorderImages();
}

// This function should undo anything that was done by the load and afterLoadProcessing
// funtions, and return to a state where load can safely be called again.
void RUBEScene::clear()
{
    for (int i = 0; i < (int)m_images.size(); i++)
        delete m_images[i];
    m_images.clear();
    if ( m_world )
        delete m_world;
    m_world = NULL;
}

// Step the physics world with fixed time step length
void RUBEScene::step()
{
    if ( m_world )
        m_world->Step( 1/60.0, 8, 3 );
}

// Draw the scene - just the debug draw and mouse joint line
void RUBEScene::render()
{
    applyView();

    if ( m_world ) {
        m_world->DrawDebugData();

        if ( m_mouseJoint ) {
            b2Vec2 p1 = m_mouseJoint->GetAnchorB();
            b2Vec2 p2 = m_mouseJoint->GetTarget();

            b2Color c;
            c.Set(0.0f, 1.0f, 0.0f);
            debugDraw.DrawPoint(p1, 4.0f, c);
            debugDraw.DrawPoint(p2, 4.0f, c);

            c.Set(0.8f, 0.8f, 0.8f);
            debugDraw.DrawSegment(p1, p2, c);
        }

        glEnable(GL_BLEND);
    }

    //draw images
    for (int i = 0; i < (int)m_images.size(); i++)
        m_images[i]->render( worldToPixelDimension(1), worldToPixel(b2Vec2(0,0)) );
}

// Reload the scene if use has hit the R key
void RUBEScene::keyDown(sf::Event::KeyEvent keyEvent)
{
    switch ( keyEvent.code ) {
    case sf::Keyboard::R: {
        load(m_filename);
    }
        break;
    default:;
    }
}

void RUBEScene::keyUp(sf::Event::KeyEvent keyEvent)
{
}

// Here we make a mouse joint to drag dynamic bodies around
void RUBEScene::mouseDown(sf::Event::MouseButtonEvent mouseButtonEvent)
{
    PanZoomScene::mouseDown(mouseButtonEvent);

    if ( ! m_world )
        return;
    if (m_mouseJoint != NULL)
        return;

    // Make a small box.
    b2AABB aabb;
    b2Vec2 d;
    d.Set(0.001f, 0.001f);
    aabb.lowerBound = m_mousePosWorld - d;
    aabb.upperBound = m_mousePosWorld + d;

    // Query the world for overlapping shapes.
    MouseDownQueryCallback callback(m_mousePosWorld);
    m_world->QueryAABB(&callback, aabb);

    if (callback.m_fixture)
    {
        b2BodyDef bd;
        bd.type = b2_staticBody;
        b2Body* groundBody = m_world->CreateBody(&bd);

        b2Body* body = callback.m_fixture->GetBody();
        b2MouseJointDef md;
        md.bodyA = groundBody;
        md.bodyB = body;
        md.target = m_mousePosWorld;
        md.maxForce = 1000.0f * body->GetMass();
        m_mouseJoint = (b2MouseJoint*)m_world->CreateJoint(&md);
        body->SetAwake(true);
    }
}

// Get rid of the mouse joint if we have one
void RUBEScene::mouseUp(sf::Event::MouseButtonEvent mouseButtonEvent)
{
    //cout << "mouseUp" << endl; fflush(stdout);
    PanZoomScene::mouseUp(mouseButtonEvent);

    if (m_mouseJoint)
    {
        m_world->DestroyBody(m_mouseJoint->GetBodyA()); //this will destroy the joint too
        m_mouseJoint = NULL;
    }
}

// Update the mouse joint target position, if we have one
void RUBEScene::mouseMove(sf::Event::MouseMoveEvent mouseMoveEvent)
{
    //cout << "mouseMove" << endl; fflush(stdout);
    PanZoomScene::mouseMove(mouseMoveEvent);

    if (m_mouseJoint)
    {
        m_mouseJoint->SetTarget(m_mousePosWorld);
    }
}

// Sorts images by renderOrder. You'll need to call this after changing the render
// order of your images.
void RUBEScene::reorderImages()
{
    std::sort(m_images.begin(), m_images.end(), compareImagesByRenderOrder_ascending);
}

// Removes the given image from the scene
void RUBEScene::removeImage(b2dJsonImage_SFML *image)
{
    for (int i = m_images.size() - 1; i >= 0; i--) {
        b2dJsonImage_SFML *img = m_images[i];
        if ( img == image ) {
            m_images.erase( m_images.begin() + i );
            delete img;
        }
    }
}

// Remove one body from the scene, along with any images attached to it
void RUBEScene::removeBody(b2Body* body)
{
    if ( !body )
        return;

    //destroy the body in the physics world
    m_world->DestroyBody( body );

    //remove all images that were attached to the body we just deleted
    for (int i = m_images.size() - 1; i >= 0; i--) {
        b2dJsonImage_SFML *img = m_images[i];
        if ( img->body == body ) {
            m_images.erase( m_images.begin() + i );
            delete img;
        }
    }
}

