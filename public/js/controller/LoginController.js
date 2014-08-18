LoginController = new function() {
  var username;

  function login(usernameToLogin) {
    username = usernameToLogin;
    Fire.command("manager.notes.refresh");
    Fire.command("view.login-view.hide");
    Fire.command("controller.login.complete");
  }

  function showViewIfNecessary(e) {
    if (!username) {
      Fire.command("view.login-view.show");
    } else {
      login(username);
    }
  }

  Respond.toCommand('controller.login.start', showViewIfNecessary)
  Respond.toRequest("user.login", function(e) { login(e.username) });
};