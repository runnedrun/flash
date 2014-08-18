LoginView = function() {
  var submitBinding;

  var loginDiv = $("#login");
  var inputDiv = $("#login_input");
  loginDiv.hide();

  $("#background_lost").fadeIn(2000);

  function show() {
    submitBinding = KeyBinding.keypress(KeyCode.enter, inputDiv, loginUser);
    setTimeout(function(){inputDiv.focus();}, 450);
  }

  function hide() {
    submitBinding.unbind();
    ViewUtil.fadeOut(loginDiv);
    $("#background_lost").fadeIn(2000);
  }

  function loginUser(e) {
    var username = inputDiv.html();
    Fire.request("user.login", {username: username});
  }

  Respond.toCommand("view.login-view.hide", hide);
  Respond.toCommand("view.login-view.show", show);
}