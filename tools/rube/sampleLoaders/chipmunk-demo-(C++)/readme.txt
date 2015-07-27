
This folder contains source code for the Chipmunk physics engine, 
with a loader for R.U.B.E scenes implemented as a demonstration.

You can find the original source code at: http://chipmunk-physics.net/

The R.U.B.E scene loader here is incomplete and should not be regarded
as a useful tool. It was made mostly to gain experience with using 
Chipmunk itself, and as a test to see how easily the exported JSON could 
be applied, and how compatible the scene tuning parameters are between
Box2D and Chipmunk.

Still, it may be interesting for somebody, so it has been included
here with the other loaders.

Here are some random notes about this implementation...
-----

- Only revolute (pivot), soft distance (damped spring) and wheel (groove
   + damped spring combo) joints have been implemented.
- Friction seems much lower than it should be.
- How to set correct moment for body with multiple shapes?
- How to prevent collisions between bodies with more than one joint?
  Without a similar method to 'collideConnected', and without the 
  category/mask mutual flag test, a lot of messing about is required
  to get just the right flags for the cpLayer setting (the maskBits
  property is used for cpLayer).
- Rendering of springs has been made much smaller to better match the 
  sizes used in the loaded scenes.
- Compiler flags are set to force demo app to compile as C++.


