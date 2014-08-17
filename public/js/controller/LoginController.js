LoginController = new function() {
  function login(e) {
    var username = e.username
    Fire.command("manager.notes.refresh");
    Fire.command("view.user.login", {user: username});
    // notemanager.advanceState();
  }

  function activateViewIfNecessary(e) {
    var newState = e.newState;

    if (newState == ViewModeState.login) {
      submitBinding = KeyBinding.keypress(KeyCode.enter, inputDiv, onSubmit);
      setTimeout(function(){inputDiv.focus();}, 450);
    } else {
      submitBinding.unbind();
      fadeIn(loginDiv);
    }
  }

  Respond.toCommand('state.change', onStateChange)
  Respond.toRequest("user.login", login);
}