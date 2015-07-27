
*** Important (Linux,Mac) *** 
Make sure that symbolic links have been recreated when you extracted this zipfile.
Some GUI archive programs like to completely ignore them, so the safest way is to
use a terminal:
	unzip rube-C++-sample-SFML.zip
You should see "finishing deferred symbolic links" near the end of the output.



Running the binaries
====================
To run the pre-built samples, use the appropriate file in the 'run' folder:
	run-lin64.sh
	run-lin32.sh
	run-win32.bat
	rube-sfml-mac



Building the source
===================
To build these samples you will need to have the Box2D and SFML headers and libs 
somewhere on your system. The source code was written for Box2D 2.3.0 and SFML 2.0

There is a cmake file included in the 'src' folder which you can use to build with 
cmake. Edit the top part of CMakeLists.txt to set the locations of your Box2D and SFML.

The most convenient way to build is to create a new folder, for example you might
create a folder called 'build' alongside the 'src' folder. You would then run cmake
from inside the 'build' folder, giving the src folder as the target, like this:
	cmake ../src

The cmake file is set up to place the generated binary in the 'run' folder (or inside
the app bundle for Mac) overwriting the existing ones.

Depending on the version of SFML you have, you might find that you need to replace
the included shared libraries with your own ones, to allow correct linking at run-time.

The shared libraries are in:
	lib-lin64
	lib-lin32
	lib-win32
	rube-sfml-mac.app/Contents/Frameworks

