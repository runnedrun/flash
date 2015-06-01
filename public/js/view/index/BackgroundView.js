BackgroundView = function() {
  var backgroundEl = $(".background");

  this.viewMode = function() {
    backgroundEl.animate({"bottom": "-400%"}, {duration: 500});
  }

  this.learnMode = function() {
    backgroundEl.animate({"bottom": "0"}, {duration: 500});
  }

  // moves to a certain percentage position, where -300% is treated as 100%, since the top 100% of the background is for
  // the view mode. -400% is the position for view mode and -300% is where we show results.
  this.moveBackgroundToPercent = function(percent) {
    var percentToMoveTo = -300 * percent;
    backgroundEl.animate({"bottom": percentToMoveTo + "%"}, {duration: 500});
  }
}