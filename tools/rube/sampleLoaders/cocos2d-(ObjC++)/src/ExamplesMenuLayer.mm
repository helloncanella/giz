//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  only for this demo project, you can remove this in your own app
//

#import "ExamplesMenuLayer.h"

#import "BasicRUBELayer.h"
#import "RUBELayer.h"
#import "DestroyBodyLayer.h"
#import "PinballRUBELayer.h"
#import "PlanetCuteRUBELayer.h"
#import "MenuScreenRUBELayer.h"
#import "UIControlsRUBELayer.h"

@implementation ExamplesMenuLayer

+(CCScene *) scene
{
	CCScene *scene = [CCScene node];
	ExamplesMenuLayer *layer = [ExamplesMenuLayer node];
	
	[scene addChild: layer];
    
	return scene;
}

-(id) init
{
	if( (self=[super init])) {                
        
#if (COCOS2D_VERSION >> 16) == 1
        self.isTouchEnabled = YES;
#else
        self.touchEnabled = YES;
#endif
        
#if (COCOS2D_VERSION >> 16) == 1
#define itemWithString itemFromString
#endif
        CCMenuItem* basicItem = [CCMenuItemFont itemWithString:@"Basic load" target:self selector:@selector(loadBasic:)];
        CCMenuItem* imagesItem = [CCMenuItemFont itemWithString:@"Images load" target:self selector:@selector(loadImages:)];
        CCMenuItem* destroyItem = [CCMenuItemFont itemWithString:@"Destroy bodies" target:self selector:@selector(loadDestroy:)];
        CCMenuItem* pinballItem = [CCMenuItemFont itemWithString:@"Pinball demo" target:self selector:@selector(loadPinball:)];
        CCMenuItem* planetCuteItem = [CCMenuItemFont itemWithString:@"PlanetCute demo" target:self selector:@selector(loadPlanetCute:)];
        CCMenuItem* simpleMenuItem = [CCMenuItemFont itemWithString:@"Simple menu demo" target:self selector:@selector(loadSimpleMenu:)];
        CCMenuItem* uiControlsItem = [CCMenuItemFont itemWithString:@"UI controls demo" target:self selector:@selector(loadUIControls:)];
        CCMenu* menu = [CCMenu menuWithItems:basicItem,imagesItem,destroyItem,pinballItem,planetCuteItem,simpleMenuItem,uiControlsItem,nil];
        [menu alignItemsVertically];
        [self addChild:menu];
        
	}
	return self;
}

-(void)loadBasic:(id)item
{
    [[CCDirector sharedDirector] replaceScene:[BasicRUBELayer scene]];
}

-(void)loadImages:(id)item
{
    [[CCDirector sharedDirector] replaceScene:[RUBELayer scene]];
}

-(void)loadDestroy:(id)item
{
    [[CCDirector sharedDirector] replaceScene:[DestroyBodyLayer scene]];
}

-(void)loadPinball:(id)item
{
    [[CCDirector sharedDirector] replaceScene:[PinballRUBELayer scene]];
}

-(void)loadPlanetCute:(id)item
{
    [[CCDirector sharedDirector] replaceScene:[PlanetCuteRUBELayer scene]];
}

-(void)loadSimpleMenu:(id)item
{
    [[CCDirector sharedDirector] replaceScene:[MenuScreenRUBELayer scene]];
}

-(void)loadUIControls:(id)item
{
    [[CCDirector sharedDirector] replaceScene:[UIControlsRUBELayer scene]];
}

@end

