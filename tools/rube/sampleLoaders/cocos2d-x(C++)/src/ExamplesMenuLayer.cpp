//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  only for this demo project, you can remove this in your own app
//

#include "ExamplesMenuLayer.h"

#include "BasicRUBELayer.h"
#include "RUBELayer.h"
#include "DestroyBodyLayer.h"
#include "PinballRUBELayer.h"
#include "PlanetCuteRUBELayer.h"
#include "MenuScreenRUBELayer.h"
#include "UIControlsRUBELayer.h"

using namespace cocos2d;

CCScene* ExamplesMenuLayer::scene()
{
    CCScene *scene = CCScene::create();
    
    // add layer as a child to scene
    CCLayer* layer = new ExamplesMenuLayer();
    layer->init();
    scene->addChild(layer);
    layer->release();
    
    return scene;
}

bool ExamplesMenuLayer::init()
{
	if ( CCLayer::init() ) {
        
        setTouchEnabled( true );
        
        CCMenuItem* basicItem = CCMenuItemFont::create("Basic load", this, menu_selector(ExamplesMenuLayer::loadBasic));
        CCMenuItem* imagesItem = CCMenuItemFont::create("Images load", this, menu_selector(ExamplesMenuLayer::loadImages));
        CCMenuItem* destroyItem = CCMenuItemFont::create("Destroy bodies", this, menu_selector(ExamplesMenuLayer::loadDestroy));
        CCMenuItem* pinballItem = CCMenuItemFont::create("Pinball demo", this, menu_selector(ExamplesMenuLayer::loadPinball));
        CCMenuItem* planetCuteItem = CCMenuItemFont::create("PlanetCute demo", this, menu_selector(ExamplesMenuLayer::loadPlanetCute));
        CCMenuItem* simpleMenuItem = CCMenuItemFont::create("Simple menu demo", this, menu_selector(ExamplesMenuLayer::loadSimpleMenu));
        CCMenuItem* uiControlsItem = CCMenuItemFont::create("UI controls demo", this, menu_selector(ExamplesMenuLayer::loadUIControls));
        
        CCMenu* menu = CCMenu::create(basicItem,imagesItem,destroyItem,pinballItem,planetCuteItem,simpleMenuItem,uiControlsItem,NULL);
        menu->alignItemsVertically();
        addChild(menu);
        
	}
	return true;
}

void ExamplesMenuLayer::loadBasic()
{
    CCDirector::sharedDirector()->replaceScene( BasicRUBELayer::scene() );
}

void ExamplesMenuLayer::loadImages()
{
    CCDirector::sharedDirector()->replaceScene( RUBELayer::scene() );
}

void ExamplesMenuLayer::loadDestroy()
{
    CCDirector::sharedDirector()->replaceScene( DestroyBodyLayer::scene() );
}

void ExamplesMenuLayer::loadPinball()
{
    CCDirector::sharedDirector()->replaceScene( PinballRUBELayer::scene() );
}

void ExamplesMenuLayer::loadPlanetCute()
{
    CCDirector::sharedDirector()->replaceScene( PlanetCuteRUBELayer::scene() );
}

void ExamplesMenuLayer::loadSimpleMenu()
{
    CCDirector::sharedDirector()->replaceScene( MenuScreenRUBELayer::scene() );
}

void ExamplesMenuLayer::loadUIControls()
{
    CCDirector::sharedDirector()->replaceScene( UIControlsRUBELayer::scene() );
}



