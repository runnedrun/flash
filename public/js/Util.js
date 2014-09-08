Util = new function() {
    var counter = 0;

    this.randomize = function(arr) {
        for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    };

    this.random = function(lower, upper) {
      var diff = upper - lower;
      var randomAdd = Math.floor((Math.random() * diff));
      return lower + randomAdd;
    }

    this.incrementingString = function() {
      counter += 1;
      return String(counter);
    }

    this.find = function(array, predicateFunc) {
      var res;
      $.each(array, function(i, el) {
        var found = predicateFunc(el);
        if (found) {
          res = el;
          return false
        }
      });
      return res
    }

    this.findAndDelete = function(array, predicateFunc) {
      var indexToDelete;
      $.each(array, function(i, el) {
        var found = predicateFunc(el);
        if (found) {
          indexToDelete = i;
          return false
        }
      });
      return array.splice(i,1);
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