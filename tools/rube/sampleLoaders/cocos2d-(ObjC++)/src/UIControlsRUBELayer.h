//
//  UIControlsRUBELayer.h
//  check9_v1
//
//  Created by chris on 16/09/13.
//
//

#import "ButtonRUBELayer.h"

@interface UIControlsRUBELayer : ButtonRUBELayer
{
    bool m_drawerShowing;
    
    float m_lastDialValue;
    float m_lastSliderValue;
    
    b2RevoluteJoint* m_dialJoint;
    b2PrismaticJoint* m_sliderJoint;
    b2Body* m_drawerBody;
}

@end
