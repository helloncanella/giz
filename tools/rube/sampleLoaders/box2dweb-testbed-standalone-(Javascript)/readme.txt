The debug draw used here is slightly different to the standard box2deb one, in
an attempt to improve the overall speed of the simulation.
Only the outlines of shapes are drawn so that the fill area does not need to be
calculated, and all polygons can be drawn as a single path.
Additionally, QueryAABB is used so that only shapes in the visible region of 
the scene are drawn.
