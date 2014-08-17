Respond = new function() {
  // commands come from controllers
  this.toCommand = function(commandName, callback) {
    return new Binding("command." + commandName, $(document), callback);
  }

  // events come from models
  this.toEvent = function(eventName, callback) {
    return new Binding("event." + eventName, $(document), callback);
  }

  // requests come from views
  this.toRequest = function(requestName, callback) {
    return new Binding("request." + requestName, $(document), callback);
  }
}();

Fire = new function() {
  this.command = function(commandName, data) {
    $(document).trigger($.extend({ 'type' : "command." + commandName }, data));
  }

  this.event = function(eventName, data) {
    $(document).trigger($.extend({ 'type' : "event." + eventName }, data));
  }

  this.request = function(requestName, data) {
    $(document).trigger($.extend({ 'type' : "request." + requestName }, data));
  }
}