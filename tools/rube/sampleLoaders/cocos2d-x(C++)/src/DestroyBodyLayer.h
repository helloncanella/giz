//  Author: Chris Campbell - www.iforce2d.net
//  -----------------------------------------
//
//  DestroyBodyLayer
//
//  Just to demonstrate removing bodies from the world. The only thing
//  different to the superclass is the ccTouchesBegan method.
//

#ifndef DESTROY_BODY_LAYER
#define DESTROY_BODY_LAYER

#include "RUBELayer.h"

class DestroyBodyLayer : public RUBELayer
{
public:    
    static cocos2d::CCScene* scene();    
    void ccTouchesBegan(cocos2d::CCSet* touches, cocos2d::CCEvent* event);
};

#endif /* DESTROY_BODY_LAYER */
