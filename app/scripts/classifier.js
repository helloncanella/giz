/*jshint unused:false*/

'use strict';

function Classifier() {
  this.openedOrClosed = function(body) {
    var first = body[0],
        last = body[body.length-1];

    if(first.x === last.x && first.y && last.y){
      return 'closed';
    }

    return 'opened';

  };
}
