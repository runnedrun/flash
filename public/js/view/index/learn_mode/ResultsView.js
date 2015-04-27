ResultsView = function(resultsController, cardEl, onFinishedViewing) {
  var self = this;
  var resultCard = $("#result-card-model").clone().removeAttr("id");
  var successEl = resultCard.find(".successful");
  var failedEl = resultCard.find(".failed");

  self.render = function() {
    var finishedViewingBinding = KeyBinding.keydown(KeyCode.enter, $(resultCard), onFinishedViewing);

    var results = resultsController.getResults();

    var failedNoteCount = results.failedNotes.length;
    var successfullNoteCount = results.successfulNotes.length;
    cardEl.css({"border": "1px solid black", visibility: "shown"});
    failedEl.html("Failed: " + failedNoteCount);
    successEl.html("Successful: "+ successfullNoteCount);
    cardEl.append(resultCard);
  }

  self.shouldSwitchFocus = function(container) {
    var should = ViewUtil.isElementInContainerViewportVertically(cardEl[0], container);
    return should;
  }

  self.focus = function() {
    resultCard.attr("tabindex", -1);
    resultCard.focus();
  }

  self.destroy = function() {
    resultCard.remove();
  }

  self.hide = function() {
    resultCard.hide();
  }

  self.getCursor = function() {
    return Number.MIN_VALUE;
  }
}