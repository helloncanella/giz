/*jshint -W098*/
'use strict';

function Converter(scale) {
  this.scale = scale;
}

Converter.prototype.convert = function(entity, destiny) {

  if (entity instanceof Array) {
    entity.forEach(function(element, i, array) {
      array[i] = this.convert(element, destiny);
    }, this);
  } else if (entity instanceof Object) {
    for (var property in entity) {
      if (entity.hasOwnProperty(property)) {
        var value = entity[property];
        entity[property] = this.convert(value, destiny);
      }
    }
  } else if (typeof entity === 'number') {
    var scale = this.scale;

    if (destiny === 'box2d') {
      entity /= scale;
    } else if (destiny === 'canvas') {
      entity *= scale;
    } else{
      throw 'Problem on the assignment of the variable \'destiny\'';
    }

  }

  return entity;
};
