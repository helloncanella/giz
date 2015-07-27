#!/bin/sh

here="${0%/*}"

LD_LIBRARY_PATH="$here/lib-lin32":"$LD_LIBRARY_PATH"
export LD_LIBRARY_PATH
cd $here
exec ./rube-sfml-lin32 "$@"

