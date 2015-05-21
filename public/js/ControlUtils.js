Respond = new function() {
  // commands come from controllers
  this.toCommand = function(commandName, callback) {
    return new Binding("command." + commandName, $(document), callback);
  }

  // events come from models
  this.toEvent = function(eventName, callback) {
    return new Binding("event." + eventName, $(document), callback);
  }
}();

Fire = new function() {
  this.command = function(commandName, data) {
    var id = Util.incrementingString();
    var eventType = "command." + commandName;
    debug && console.log("firing command: " + eventType, data);
    $(document).trigger($.extend({ 'type' : eventType, id: id }, data));
  }

  this.event = function(eventName, data) {
    var id = Util.incrementingString();
    var eventType = "event." + eventName;
    debug && console.log("firing event: " + eventType, data);
    $(document).trigger($.extend({ 'type' : eventType, id: id }, data));
  }
}