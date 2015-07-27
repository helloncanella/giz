/* Copyright (c) 2007 Scott Lembcke
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#include "chipmunk.h"
#include "ChipmunkDemo.h"

#include "rubestuff/b2dJson.h"
#include "rubestuff/b2dJsonImage_OpenGL.h"

static int sceneLoadCooldownTimer;
static int sceneIndex = 0;

static cpBody* viewCenterBody = NULL;
static std::vector<cpBody*> driveWheelBodies;

const char* sceneFiles[] = {
    "level.json",
    "jack.json",
    "bike.json",
    "tank.json",
    "customProperties.json"
};

const char* genericMessage = "Use the up/down arrow keys to change scenes.";

const char* sceneComments[] = {
    "",
    "\nPull the latch to open the jack-in-the-box.",
    "\nUse the left/right arrow keys to drive the bike.",
    "\nUse the left/right arrow keys to drive the tank."
    "\nThese bodies are moved according to custom property settings."
};

const float driveSpeeds[] = {
    0,
    0,
    40,
    20,
    0
};

struct WobblyProperties {
    cpVect basePos;         //starting position
    float horizontalRange;  //oscillation range
    float verticalRange;    //oscillation range
    float speed;            //oscillation speed
};

std::map<cpBody*, WobblyProperties> wobblyBodyPropertiesMap;
float timePassed;

static char messageString[1024];

static cpSpace *
init(void)
{
    sceneLoadCooldownTimer = 0;

    ChipmunkDemoMessageString = messageString;
    sprintf(messageString, "%s%s", genericMessage, sceneComments[sceneIndex]);

    b2dJson json;
    std::string errorMsg;
    cpSpace* space = json.readFromFile(sceneFiles[sceneIndex], errorMsg);
    if ( ! space ) {
        std::cout << errorMsg << std::endl;
        sprintf(messageString, "Could not load %s !", sceneFiles[sceneIndex]);
        return cpSpaceNew();
    }

    viewCenterBody = json.getBodyByName("viewcenter");
    driveWheelBodies.clear();
    json.getBodiesByName("drivewheel", driveWheelBodies);

    //find all bodies with custom property 'category' value matching 'wobbly'
    std::vector<cpBody*> wobblyBodies;
    json.getBodiesByCustomString("category", "wobbly", wobblyBodies);

    //look at some other custom properties of these bodies and store them
    for (int i = 0; i < (int)wobblyBodies.size(); i++) {
        cpBody* b = wobblyBodies[i];
        WobblyProperties wp;
        wp.basePos = cpBodyGetPos(b);
        wp.horizontalRange = json.getCustomFloat(b, "horzRange", 0);
        wp.verticalRange = json.getCustomFloat(b, "vertRange", 0);
        wp.speed = json.getCustomFloat(b, "speed", 0);
        wobblyBodyPropertiesMap[b] = wp;
    }

    timePassed = 0;
	
	return space;
}

static void
destroy(cpSpace *space)
{
    wobblyBodyPropertiesMap.clear();

    ChipmunkDemoFreeSpaceChildren(space);
	cpSpaceFree(space);
}

static void
update(cpSpace *space)
{
    if ( sceneLoadCooldownTimer > 0 )
        sceneLoadCooldownTimer--;

    if ( sceneLoadCooldownTimer == 0 && ChipmunkDemoKeyboard.y != 0 ) {
        int numScenes = sizeof(sceneFiles) / sizeof(char*);
        if ( ChipmunkDemoKeyboard.y > 0 )
            sceneIndex++;
        else
            sceneIndex += numScenes - 1;
        sceneIndex %= numScenes;
        destroy(space);
        ChipmunkDemoSpace = space = init();
        sceneLoadCooldownTimer = 15;//0.25 sec
    }

    float drive = 0;
    if ( ChipmunkDemoKeyboard.x > 0 )
        drive = -driveSpeeds[sceneIndex];
    else if ( ChipmunkDemoKeyboard.x < 0 )
        drive = driveSpeeds[sceneIndex];
    for (int i = 0; i < driveWheelBodies.size(); i++)
        cpBodySetAngVel(driveWheelBodies[i], drive);

    int steps = 3;
    cpFloat dt = 1.0f/60.0f/(cpFloat)steps;

    for(int i=0; i<steps; i++){
        cpSpaceStep(space, dt);
    }

    if ( viewCenterBody ) {
        ChipmunkDemoViewCenter = ChipmunkDemoViewCenter * 0.95f - cpBodyGetPos(viewCenterBody) * 0.05f;
    }

    timePassed += 1 / 60.0;

    //use the custom properties to move the wobbly bodies around
    std::map<cpBody*, WobblyProperties>::iterator it = wobblyBodyPropertiesMap.begin();
    std::map<cpBody*, WobblyProperties>::iterator end = wobblyBodyPropertiesMap.end();
    while (it != end) {
        cpBody* b = it->first;
        WobblyProperties& wp = it->second;
        cpVect pos = wp.basePos + cpv( sin(timePassed*wp.speed) * wp.horizontalRange, cos(timePassed*wp.speed) * wp.verticalRange );
        cpBodySetPos(b, pos);
        ++it;
    }
}

ChipmunkDemo LoadRube = {
    "Load RUBE",
	init,
	update,
	ChipmunkDemoDefaultDrawImpl,
	destroy,
};
