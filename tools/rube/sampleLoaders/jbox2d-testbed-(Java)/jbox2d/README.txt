See the project page online for more information:
http://code.google.com/p/jbox2d/

If you've downloaded this an archive, you should find the built java jars in the 'target' directories of each project.

jbox2d-library - this is the main physics library.  The only dependency is the SLF4J logging library.

jbox2d-serialization - this adds serialization tools.  Requires google's protocol buffer library installed to fully build (http://code.google.com/p/protobuf/).

jbox2d-testbed - A simple framework for creating and running physics tests.





*******************************************************************************************
* The above is the original README from JBox2D. The following was added for R.U.B.E info. *
*******************************************************************************************

json - the org.json implementation of JSON in Java, available at http://www.json.org/java

b2dJson - the Java version of b2dJson - more info at http://www.iforce2d.net/b2djson


Changes to original JBox2D code
===============================

Some members of TestbedTest were made protected to allow the subclass to replace the
ground body and set the debug draw in the newly created world after loading from JSON.


Comments
========

Loading the JSON seems incredibly slow, much slower than Javascript even. I have not
put any effort into finding out why this is, but it would be interesting to know.

