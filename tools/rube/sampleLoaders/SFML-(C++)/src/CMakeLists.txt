cmake_minimum_required (VERSION 2.6)
project (rube-sfml)

#the top folder when you checkout the Box2D source - it should contain the 'Box2D' and 'Contributions' folders
set(BOX2D_ROOT /home/chris/src/libs/box2d)

#the main folder of SFML - it should contain the 'include' and 'lib' folders
set(SFML_ROOT /home/chris/src/libs/SFML)


find_package(OpenGL REQUIRED)

add_definitions( -DGLIBCXX_FULLY_DYNAMIC_STRING=1 )

include_directories (
	${OPENGL_INCLUDE_DIR}
	${BOX2D_ROOT}/Box2D
	${SFML_ROOT}/include
)

link_directories(
	${BOX2D_ROOT}/Box2D/Build/Box2D
	${SFML_ROOT}/lib	
)

set(sourcefiles
	Window.cpp 
	PanZoomScene.cpp 
	b2dJsonImage_SFML.cpp 
	DebugDraw.cpp 
	RUBEScene.cpp 
	DestroyBodyScene.cpp 
	PinballScene.cpp 
	PlanetCuteScene.cpp
	rubestuff/jsoncpp.cpp 
	rubestuff/b2dJson.cpp 
	rubestuff/b2dJsonImage.cpp
)

if(APPLE)
	set(BINARY_NAME ../run/rube-sfml.app/Contents/MacOS/rube-sfml-mac-bin)
elseif(WIN32)
	set(BINARY_NAME ../run/rube-sfml-win32)
else()
	if(CMAKE_SIZEOF_VOID_P EQUAL 8)
		set(BINARY_NAME ../run/rube-sfml-lin64)
	else()
		set(BINARY_NAME ../run/rube-sfml-lin32)
	endif()
endif(APPLE)

add_executable(
	${BINARY_NAME}
	${sourcefiles}
)

target_link_libraries (
	${BINARY_NAME}
	sfml-system 
	sfml-window 
	sfml-graphics 
	sfml-audio
	Box2D
	${OPENGL_LIBRARIES}
	${ADDITIONAL_LIBRARIES}
)

