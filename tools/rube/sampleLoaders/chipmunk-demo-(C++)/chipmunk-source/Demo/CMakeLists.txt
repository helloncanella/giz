find_package(OpenGL REQUIRED)
find_package(GLUT REQUIRED)

set(chipmunk_demos_include_dirs
  ${chipmunk_SOURCE_DIR}/include/chipmunk
  ${GLUT_INCLUDE_DIR}
  ${OPENGL_INCLUDE_DIR}
)

set(chipmunk_demos_libraries
  chipmunk_static
  ${GLUT_LIBRARIES}
  ${OPENGL_LIBRARIES}
)

string (REPLACE "-std=gnu99" "" CMAKE_C_FLAGS ${CMAKE_C_FLAGS})
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -x c++ -Wno-write-strings")

file(GLOB chipmunk_demos_source_files "*.c" "*.cpp")

set(rube_loading_source_files
    rubestuff/b2Math_excerpts.h
    rubestuff/b2dJson.cpp
    rubestuff/b2dJsonImage.cpp
    rubestuff/b2dJsonImage_OpenGL.cpp

    rubestuff/jsoncpp.cpp
)

include_directories(${chipmunk_demos_include_dirs})
add_executable(chipmunk_demos ${chipmunk_demos_source_files} ${rube_loading_source_files})
target_link_libraries(chipmunk_demos ${chipmunk_demos_libraries})

if(INSTALL_DEMOS)
  install(TARGETS chipmunk_demos RUNTIME DESTINATION bin)
endif(INSTALL_DEMOS)
