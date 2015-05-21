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

  this.objectValues = function(obj) {
    var keys = Object.keys(obj);
    var vals = [];

    for (var i = 0; i < keys.length; i++) {
      vals.push(obj[keys[i]])
    }

    return vals
  }

  this.arraysEqual = function(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
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

  this.isElementInContainerViewportVertically = function(el, container) {
    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= $(container).height();
  }
}();