//
// You can use these functions to customize the appearance and content
// of the labels shown in the editor view. Each function gives you the
// item for the label, and some parameters to set. The parameters are
// passed by reference, so you should assign values to them instead of
// making the function return a value.
//
//     setLabelColors : lets you set the background and foreground color
//     setLabelText   : lets you set the label content text
//
// Uncomment the functions below as necessary to customize your labels.
// Do not change the callsign of the functions, or they will be ignored.
//
// If functions are left commented out, the default behavior is to show the
// name of the item, with black background and white foreground. You can
// set the text to an empty string to prevent the label from showing.
//


// ========== Body labels ==========
/*
void setLabelColors(body b, color &out background, color &out foreground) {
    background.set1(1,0,0,0.5); // red, half opacity
    foreground.set1(0,1,0,0.5); // green, half opacity
}

void setLabelText(body b, string &out text) {
    text = "Name: " + b.getName();
}
*/
// ========== Fixture labels ==========
/*
void setLabelColors(fixture f, color &out background, color &out foreground) {
    background.set1(1,0,0,0.5); // red, half opacity
    foreground.set1(0,1,0,0.5); // green, half opacity
}

void setLabelText(fixture f, string &out text) {
    text = "Name: " + f.getName();
}
*/
// ========== Joint labels ==========
/*
void setLabelColors(joint j, color &out background, color &out foreground) {
    background.set1(1,0,0,0.5); // red, half opacity
    foreground.set1(0,1,0,0.5); // green, half opacity
}

void setLabelText(joint j, string &out text) {
    text = "Name: " + j.getName();
}
*/
// ========== Image labels ==========
/*
void setLabelColors(image i, color &out background, color &out foreground) {
    background.set1(1,0,0,0.5); // red, half opacity
    foreground.set1(0,1,0,0.5); // green, half opacity
}

void setLabelText(image i, string &out text) {
    text = "Name: " + i.getName();
}
*/
// ========== Sampler labels ==========
/*
void setLabelColors(sampler i, color &out background, color &out foreground) {
    background.set1(1,0,0,0.5); // red, half opacity
    foreground.set1(0,1,0,0.5); // green, half opacity
}

void setLabelText(sampler i, string &out text) {
    text = "Name: " + i.getName();
}
*/
// ========== Object labels ==========
/*
void setLabelColors(object i, color &out background, color &out foreground) {
    background.set1(1,0,0,0.5); // red, half opacity
    foreground.set1(0,1,0,0.5); // green, half opacity
}

void setLabelText(object i, string &out text) {
    text = "Name: " + i.getName();
}
*/


// ==========================
// This is to stop the auto-compile of the script panel
// from detecting errors that are not really errors.
void main(){}
