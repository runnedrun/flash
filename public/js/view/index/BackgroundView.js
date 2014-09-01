BackgroundView = function() {
  this.Background = {
    learn: 0,
    review: 1
  }

  function show(e) {
    switch(e.background) {
      case Background.learn:
        $("#tunnel_vision").fadeIn(e.fadeTime);
        $("#background_lost").fadeIn(e.fadeTime);
        break;
      case Background.review:
        $("#background_found").fadeIn(e.fadeTime);
        break;
    }
  }

  function hide(e) {
    switch(e.background) {
      case Background.learn:
        $("#tunnel_vision").fadeOut(e.fadeTime);
        $("#background_lost").fadeOut(e.fadeTime);
        break;
      case Background.review:
        $("#background_found").fadeOut(e.fadeTime);
        break;
    }
  }

  Respond.toCommand("view.background-view.hide", hide);
  Respond.toCommand("view.background-view.show", show)
}