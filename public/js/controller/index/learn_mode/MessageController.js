MessageController = function() {
  var self = this;
  self.messageView = new MessageView(self);

  function viewComplete() {
    self.messageView.hideMesssage();
    Fire.command("controller.message.complete");
  }

  function showMessage(e) {
    self.messageView.displayMessage(e.message);
  }

  Respond.toCommand("controller.message.show", showMessage);
}