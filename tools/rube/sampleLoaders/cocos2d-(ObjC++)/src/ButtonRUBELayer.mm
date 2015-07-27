//
//  ButtonRUBELayer.m
//  mtb
//
//  Created by chris on 10/04/13.
//
//

#import <objc/runtime.h>
#import "ButtonRUBELayer.h"
#include "b2dJson.h"
#include "b2dJsonImage.h"
#import "SimpleAudioEngine.h"
//#include "objcUtils.h"
using namespace std;

@implementation ButtonRUBELayer

+(id)initWithJSONFile:(NSString*)jsonFile
{
    return [[[self alloc] initWithJSONFile:jsonFile] autorelease];
}

-(id)initWithJSONFile:(NSString *)jsonFile
{
    self = [ButtonRUBELayer alloc];
    m_filename = jsonFile;
	self = [super init];
	return self;
}

-(NSString*)getFilename
{
    return m_filename;
}

-(CGPoint)initialWorldOffset
{
    CGSize s = [[CCDirector sharedDirector] winSize];
    float w = s.width;
    if ( w < s.height )
        w = s.height;
    return CGPointMake( w * 0.5, 0 );
}

-(float)initialWorldScale
{
    CGSize s = [[CCDirector sharedDirector] winSize];
    float h = s.height;
    if ( h > s.width )
        h = s.width;
    return h / 6.4; 
}

int getAllImagesOnBody( std::vector<b2dJsonImage*>& images, b2Body* b, std::vector<b2dJsonImage*>& result )
{
    for (int i = 0; i < images.size(); i++)
        if ( images[i]->body == b )
            result.push_back(images[i]);
    return result.size();
}

-(void)setupButtonActions:(class b2dJson *)json
{
    std::vector<b2dJsonImage*> allImages;
    json->getAllImages(allImages);

    for (b2Body* b = m_world->GetBodyList(); b; b = b->GetNext()) {
        for (b2Fixture* f = b->GetFixtureList(); f; f = f->GetNext()) {
            
            _buttonInfo bi;
            bi.fixture = f;
            bi.selectorName = json->getCustomString(f, "selectorButton", "");
            bi.sceneName = json->getCustomString(f, "sceneButton", "");
            bi.selector = nil;
            bi.sceneClassType = nil;
            bi.imageFile_normal = "";
            bi.imageFile_hover = "";
            bi.highlighted = false;
            bi.sprite = nil;
            
            //look for all images on this body
            vector<b2dJsonImage*> imagesOnBody;
            if ( getAllImagesOnBody(allImages, b, imagesOnBody) > 0 ) {
                b2dJsonImage* baseImage = imagesOnBody[0];
                bi.sprite = [self getAnySpriteOnBody:b];
                if ( imagesOnBody.size() > 1 && f->GetType() == b2Shape::e_polygon ) {
                    b2PolygonShape* poly = (b2PolygonShape*)f->GetShape();
                    float bestDist = FLT_MAX;
                    for (uint i = 0; i < imagesOnBody.size(); i++) {
                        float dist = (imagesOnBody[i]->center - poly->m_centroid).Length();
                        if ( dist < bestDist ) {
                            bestDist = dist;
                            baseImage = imagesOnBody[i];
                            bi.sprite = [self getSpriteWithImageName:imagesOnBody[i]->name];
                        }
                    }
                }
                string baseImageName = baseImage->name;
                b2dJsonImage* hoverImage = json->getImageByName(baseImageName + "_hover");
                bi.imageFile_normal = baseImage->file;
                memcpy(bi.colorTint_normal, baseImage->colorTint, 4 * sizeof(int));
                if ( hoverImage ) {
                    bi.imageFile_hover = hoverImage->file;
                    memcpy(bi.colorTint_hover, hoverImage->colorTint, 4 * sizeof(int));
                }
            }
            
            if ( !bi.selectorName.empty() ) {
                bi.selector = NSSelectorFromString( [NSString stringWithUTF8String:bi.selectorName.c_str()] );
                if ( !bi.selector )
                    CCLOG(@"Failed to find selector for %s", bi.selectorName.c_str());
            }
            
            if ( !bi.sceneName.empty() ) {
                bi.sceneClassType = NSClassFromString( [NSString stringWithUTF8String:bi.sceneName.c_str()] );
                if ( ! bi.sceneClassType )
                    CCLOG(@"Failed to find class for %s", bi.sceneName.c_str());
            }
            
            if ( bi.selector || bi.sceneClassType || !bi.imageFile_hover.empty() )
                m_buttons.push_back(bi);
        }
    }
}

-(void)afterLoadProcessing:(class b2dJson *)json
{
    [super afterLoadProcessing:json];
    
    [self setupButtonActions:json];
    
    [[SimpleAudioEngine sharedEngine] preloadEffect:@"button.wav"];
}

-(void) draw
{
    //no debug draw
}

-(_buttonInfo*)getButtonInfo:(b2Fixture*)fixture
{
    for (int i = 0; i < m_buttons.size(); i++) {
        _buttonInfo& bi = m_buttons[i];
        if (fixture == bi.fixture)
            return &bi;
    }
    return NULL;
}

-(void)setButtonHighlighted:(_buttonInfo*)bi tf:(bool)tf
{
    if ( ! [self allowButtonPresses])
        return;
    if ( !bi )
        return;
    //CCLOG(@"Setting button highlight for %s to %d", bi->sceneName.c_str(), tf);
    
    bool needsTextureChange = bi->highlighted != tf;
    bi->highlighted = tf;

    if ( !needsTextureChange )
        return;
    if ( !bi->sprite )
        return;
    
    if ( tf && !bi->imageFile_hover.empty() ) {
        [bi->sprite setTexture:[[CCSprite spriteWithFile:[NSString stringWithUTF8String:bi->imageFile_hover.c_str()]] texture]];
        [bi->sprite setColor:ccc3(bi->colorTint_hover[0], bi->colorTint_hover[1], bi->colorTint_hover[2])];
        [bi->sprite setOpacity:bi->colorTint_hover[3]];
    }
    else if ( !tf && !bi->imageFile_normal.empty() ) {
        [bi->sprite setTexture:[[CCSprite spriteWithFile:[NSString stringWithUTF8String:bi->imageFile_normal.c_str()]] texture]];
        [bi->sprite setColor:ccc3(bi->colorTint_normal[0], bi->colorTint_normal[1], bi->colorTint_normal[2])];
        [bi->sprite setOpacity:bi->colorTint_normal[3]];
    }
}

-(void)doButtonTouch:(UITouch*)touch
{
    b2Fixture* f = [self getTouchedFixture:touch];
    _buttonInfo* bi = [self getButtonInfo:f];
    if ( bi && bi == m_touchedButton && [self allowButtonPresses] ) {
        //CCLOG(@"Detected touch on button fixture %08X", bi->fixture);
        if ( bi->selector ) {
            if ( [self respondsToSelector:bi->selector] ) {
                [[SimpleAudioEngine sharedEngine] playEffect:@"button.wav"];
                [self performSelector:bi->selector];
            }
            else
                CCLOG(@"Ignoring selector because class %s will not respond to selector %s", class_getName([self class]), bi->selectorName.c_str());
        }
        else if ( bi->sceneClassType ) {
            [[SimpleAudioEngine sharedEngine] playEffect:@"button.wav"];
            [[CCDirector sharedDirector] replaceScene:[bi->sceneClassType scene]];            
            //[[CCDirector sharedDirector] replaceScene:[CCTransitionCrossFade transitionWithDuration:0.5 scene:[bi->sceneClassType scene]]];
        }
    }
}

- (void)ccTouchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [super ccTouchesBegan:touches withEvent:event];
    
    UITouch *touch = [[touches allObjects] objectAtIndex:0];

    if ( ! m_touchedButton ) {
        m_buttonTouch = touch;
        b2Fixture* f = [self getTouchedFixture:touch];
        m_touchedButton = [self getButtonInfo:f];
        if ( m_touchedButton )
            [self setButtonHighlighted:m_touchedButton tf:true];
        
        if ( [self actOnTouchDown] )
            [self doButtonTouch:touch];
    }
}

- (void)ccTouchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    [super ccTouchesMoved:touches withEvent:event];
    
    UITouch *touch = [[touches allObjects] objectAtIndex:0];
    
    if ( touch == m_buttonTouch ) {
        if ( m_touchedButton ) {
            b2Fixture* f = [self getTouchedFixture:touch];
            _buttonInfo* bi = [self getButtonInfo:f];
            
            [self setButtonHighlighted:m_touchedButton tf:(bi == m_touchedButton)];
        }
    }
}

-(void)ccTouchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    [super ccTouchesEnded:touches withEvent:event];
    
    for (UITouch *touch in touches) {    
        if ( touch == m_buttonTouch ) {
            if ( m_touchedButton )
                [self setButtonHighlighted:m_touchedButton tf:false];
            
            if ( ! [self actOnTouchDown] )
                [self doButtonTouch:touch];
            
            m_buttonTouch = nil;
            m_touchedButton = NULL;
        }
    }
}

/*-(void)addListItemButtonWithFixture:(b2Fixture*)fixture index:(int)i
{
    _buttonInfo bi;
    bi.fixture = fixture;
    bi.selectorName = "";
    bi.sceneName = "";
    bi.selector = nil;
    bi.sceneClassType = nil;
    bi.imageFile_normal = "";
    bi.imageFile_hover = "";
    bi.highlighted = false;
    bi.sprite = nil;
        
    m_buttons.push_back(bi);
}

-(void)triggerListItem:(int)n
{
    CCLOG(@"Triggered list item %d", n);
}*/

-(bool)allowPinchZoom
{
    return false;
}

-(bool)allowButtonPresses
{
    return true;
}

-(bool)actOnTouchDown
{
    return false;
}


@end












