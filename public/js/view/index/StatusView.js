// Used to display how many notes are left in learn mode
function StatusView(switchToLearnMode, switchToViewMode) {
  var display = $(".status-display");
  var challengeCount = display.find(".challenge-count");
  var toggleLearnMode = display.find(".toggle-learn-mode");
  var toggleViewMode = display.find(".toggle-view-mode");

  this.update = function(notesRemaining) {
    challengeCount.html(notesRemaining);
  }

  this.hideChallengeCount = function() {
    challengeCount.hide();
  }

  this.showChallengeCount = function() {
    challengeCount.show();
  }

  toggleLearnMode.click(function() {
    toggleViewMode.show();
    toggleLearnMode.hide();
    switchToLearnMode();
  })

  toggleViewMode.click(function() {
    toggleViewMode.hide();
    toggleLearnMode.show();
    switchToViewMode();
  })
}