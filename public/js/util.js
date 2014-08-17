Util = new function() {
    var counter = 0;

    this.randomize = function(arr) {
        for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    };

    this.uniqueString = function() {
      counter += 1;
      return String(counter);
    }
}()

ViewUtil = new function() {
  this.fadeOut = function(element) {
    element.fadeOut(400);
  }

  this.fadeIn = function(element) {
    setTimeout(function(){
      element.fadeIn(400);
    }, 420);
  }
}();