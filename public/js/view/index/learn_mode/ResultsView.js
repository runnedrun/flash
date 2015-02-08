ResultsView = function(learnModeController, cardEl) {
  function render () {
    var results = learnModeController.getResults();
    cardEl.css("border", "1px solid black");
    cardEl.html("success: " + results.successfulNotes.length + " failed: " + results.failedNotes.length);
  }
}