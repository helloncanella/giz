//
//  UIControlsRUBELayer.m
//  check9_v1
//
//  Created by chris on 16/09/13.
//
//

#import "UIControlsRUBELayer.h"
#include "b2dJson.h"

@implementation UIControlsRUBELayer

// Standard Cocos2d method, simply returns a scene with an instance of this class as a child
+(CCScene *) scene
{
	CCScene *scene = [CCScene node];
	
	UIControlsRUBELayer *layer = [UIControlsRUBELayer node];
	[scene addChild: layer];
    
    layer->m_drawerShowing = false;
    layer->m_lastDialValue = FLT_MAX;
    layer->m_lastSliderValue = FLT_MAX;
    
	return scene;
}

// Override superclass to load different RUBE scene
-(NSString*)getFilename
{
    return @"uicontrols.json";
}

-(void)afterLoadProcessing:(class b2dJson *)json
{
    [super afterLoadProcessing:json];
    
    // find the UI control items in the scene
    m_dialJoint = (b2RevoluteJoint*)json->getJointByName("dial");
    m_sliderJoint = (b2PrismaticJoint*)json->getJointByName("slider");
    m_drawerBody = json->getBodyByName("drawer");
}

-(void)toggleDrawer
{
    m_drawerShowing = !m_drawerShowing;
}

-(void)tick:(ccTime)dt
{
    [super tick:dt];
    
    // Log movements of the dial
    if ( m_dialJoint ) {
        float currentDialValue = m_dialJoint->GetJointAngle();
        if ( currentDialValue != m_lastDialValue ) {
            m_lastDialValue = currentDialValue;
            CCLOG(@"Dial moved to %f degrees", CC_RADIANS_TO_DEGREES(m_lastDialValue));
        }
    }
    
    // Log movements of the slider
    if ( m_sliderJoint ) {
        float currentSliderValue = m_sliderJoint->GetJointTranslation();
        if ( currentSliderValue != m_lastSliderValue ) {
            m_lastSliderValue = currentSliderValue;
            CCLOG(@"Slider moved to %f", m_lastSliderValue);
        }
    }
    
    // Update the position of the drawer
    if ( m_drawerBody ) {
        if ( m_drawerShowing && m_drawerBody->GetPosition().y < 2 )
            m_drawerBody->SetLinearVelocity( b2Vec2(0,4) );
        else if ( !m_drawerShowing && m_drawerBody->GetPosition().y > 0 )
            m_drawerBody->SetLinearVelocity( b2Vec2(0,-4) );
        else
            m_drawerBody->SetLinearVelocity( b2Vec2(0,0) );
    }
}

@end
