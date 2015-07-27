//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  RUBELayer
//
//  Extends BasicRUBELayer and also loads images. This is the class
//  you would typically extend to make your own layers.
//

#import "BasicRUBELayer.h"
#import "RUBEImageInfo.h"

@interface RUBELayer : BasicRUBELayer
{
    NSMutableArray* m_imageInfos;           // holds some information about images in the scene, most importantly the body they are attached to and their position relative to that body
}

-(void)setImagePositionsFromPhysicsBodies;              // called every frame to move the images to the correct position when bodies move
-(void)removeBodyFromWorld:(b2Body*)body;               // removes a body and its images from the layer
-(void)removeImageFromWorld:(RUBEImageInfo*)imgInfo;    // removes an image from the layer
-(CCSprite*)getAnySpriteOnBody:(b2Body*)body;           // returns the first sprite found attached to the given body, or nil if there are none
-(CCSprite*)getSpriteWithImageName:(std::string)name;   // returns the first sprite found with the give name (as named in the RUBE scene) or nil if there is none

@end
