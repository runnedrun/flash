// fires:
// message.view.complete

MessageView = function(messageController) {
  var mascotDiv = $("#mascot");
  var messageDiv = $("#message");
  var messsageViewCompleteBinding;

  function messageViewingComplete() {
    messageController.viewComplete();
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
}
