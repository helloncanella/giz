
/*
Steps for adding a new test
1. Rename all occurrences of 'testbed_template' to your own name.
2. Fill in the setup function, and any others you require.
3. Add your file to the include list at the top of index.html
4. Add an entry to the select box in index.html so you can select it.
*/

var testbed_template = function() {
    //constructor
}

testbed_template.prototype.setNiceViewCenter = function() {
    //Optional: called once when the user changes to this test from another test
    PTM = 32;
    setViewCenterWorld( new b2Vec2(0,0), true );
}

testbed_template.prototype.setup = function() {
    //Required: set up the Box2D scene here - the world is already created
    
    //this should be called at the end of this function to kick off the animation
    doAfterLoad();
}

testbed_template.prototype.step = function() {
    //Optional: this function will be called at the beginning of every time step
}

testbed_template.prototype.onKeyDown = function(canvas, evt) {
    //Optional: do something when a key is pressed
    if ( evt.keyCode == 65 ) { // 'a'        
    }
}

testbed_template.prototype.onKeyUp = function(canvas, evt) {
    //Optional: do something when a key is released
    if ( evt.keyCode == 65 ) { // 'a'
    }
}
