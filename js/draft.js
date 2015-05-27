// Generated by CoffeeScript 1.9.2
(function() {
  var Banana, fruit;

  Banana = (function() {
    function Banana() {}

    Banana.prototype.init = function() {
      var start;
      start = null;
      return this.update(start);
    };

    Banana.prototype.fps = 60;

    Banana.prototype.update = function(start) {
      var date, now;
      if (this.start === null) {
        date = new Date();
        start = date.getTime();
      } else {
        console.log('ola');
        now = date.getTime();
        if ((now - start) % 1000 / this.fps === 0) {
          console.log(now - start);
        }
      }
      return requestFrameAnime(this.update);
    };

    return Banana;

  })();

  fruit = new Banana();

  fruit.init();

}).call(this);