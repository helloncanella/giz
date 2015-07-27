//
//  ButtonRUBELayer.h
//  mtb
//
//  Created by chris on 10/04/13.
//
//

#import "RUBELayer.h"
#include <string>
#include <vector>

struct _buttonInfo {
    b2Fixture* fixture;
    std::string selectorName;
    std::string sceneName;
    SEL selector;
    Class sceneClassType;
    std::string imageFile_normal;
    std::string imageFile_hover;
    int colorTint_normal[4];
    int colorTint_hover[4];
    bool highlighted;
    CCSprite* sprite;
};

@interface ButtonRUBELayer : RUBELayer
{
    NSString* m_filename;
    std::vector<_buttonInfo> m_buttons;
    
    UITouch* m_buttonTouch;
    _buttonInfo* m_touchedButton;
}

+(id)initWithJSONFile:(NSString*)jsonFile;
-(id)initWithJSONFile:(NSString*)jsonFile;

-(void)setupButtonActions:(class b2dJson *)json;
-(_buttonInfo*)getButtonInfo:(b2Fixture*)fixture;

-(void)setButtonHighlighted:(_buttonInfo*)bi tf:(bool)tf;
-(void)doButtonTouch:(UITouch*)touch;

-(bool)allowButtonPresses;
-(bool)actOnTouchDown;

@end
