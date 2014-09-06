var KeyCode = {
  enter: 13
}

// contains convenience methods for binding to certain key presses
KeyBinding = new function() {
  var self = this;

  function checkForKeyCode(e, codeExpected) {
    var codeReceived = e.keyCode || e.which;
    return codeReceived === codeExpected
  }

  this.keypress = function(keyCode, $bindTo, callback) {
    bindKeyEvent("keypress", keyCode, $bindTo, callback)
  };

  this.keyup = function(keyCode, $bindTo, callback) {
    bindKeyEvent("keyup", keyCode, $bindTo, callback)
  };

  this.keydown = function(keyCode, $bindTo, callback) {
    bindKeyEvent("keydown", keyCode, $bindTo, callback);
  };

  function bindKeyEvent(eventType, keyCode, $bindTo, callback) {
    return new Binding(eventType, $bindTo, function(e) {
      if (checkForKeyCode(e, keyCode)) { callback(e) }
    })
  }
}();

// a wrapper around an event binding which can manage it's own unbinding
Binding = function(type, $bindTo, callback) {
  var namespace = Util.incrementingString();
  var eventString = type + "." + namespace;

  $bindTo.on(eventString, function(e) {
    if (debug) {
      console.log("received: " + type, e);
    }
    callback(e)
  });

  this.unbind = function() {
    $bindTo.off(eventString)
  }
};