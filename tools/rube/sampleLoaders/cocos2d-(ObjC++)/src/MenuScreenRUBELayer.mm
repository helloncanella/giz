//
//  MenuScreenRUBELayer.m
//  check8_v2
//
//  Created by chris on 16/09/13.
//  Copyright (c) 2013 chris. All rights reserved.
//

#import "MenuScreenRUBELayer.h"

@implementation MenuScreenRUBELayer

// Standard Cocos2d method, simply returns a scene with an instance of this class as a child
+(CCScene *) scene
{
	CCScene *scene = [CCScene node];
	
	MenuScreenRUBELayer *layer = [MenuScreenRUBELayer node];
	[scene addChild: layer];
    
	return scene;
}

// Override superclass to load different RUBE scene
-(NSString*)getFilename
{
    return @"simplemenu.json";
}

@end
