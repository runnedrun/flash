BackgroundController = function() {
  var currentBackground;

  function changeBackground(e) {
    var backgroundToChangeTo = e.background

    if (!currentBackground == backgroundToChangeTo) {
      Fire.command("view.background-view.hide", { background: currentBackground, fadeTime: 2000 });
      Fire.command("view.background-view.show", { background: backgroundToChangeTo, fadeTime: 2000 });
      currentBackground = backgroundToChangeTo;
    }
  }

  Respond.toCommand("controller.background.change")
}