MessageController = function() {
  function viewComplete(e) {
    Fire.command("view.message-view.hide");
    Fire.command("controller.message.complete");
  }

  function showMessage(e) {
    Fire.command("view.message-view.show", {
      message: e.message
    })
  }

  Respond.toCommand("controller.message.show", showMessage);
  Respond.toRequest("message.view.complete", viewComplete);
}