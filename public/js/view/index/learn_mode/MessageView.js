// fires:
// message.view.complete

MessageView = function() {
  var mascotDiv = $("#mascot");
  var messageDiv = $("#message");
  var messsageViewCompleteBinding;

  function messageViewingComplete() {
    Fire.request("message.view.complete");
  }

  function displayMessage(e) {
    var message = e.message;

    ViewUtil.fadeIn(mascotDiv);

    messageDiv.fadeOut(500, function() {
      messageDiv.text(message);
    }).fadeIn(500);

    messsageViewCompleteBinding = KeyBinding.keypress(KeyCode.enter, $(document), messageViewingComplete);
  }

  function hideMessage() {
    ViewUtil.fadeOut(mascotDiv);
    ViewUtil.fadeOut(messageDiv);
    messsageViewCompleteBinding.unbind();
  }

  Respond.toCommand("view.message-view.show", displayMessage);
  Respond.toCommand("view.message-view.hide", hideMessage);
}
