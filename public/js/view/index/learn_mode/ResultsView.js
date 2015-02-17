ResultsView = function(resultsController, cardEl) {
  var self = this;
  var resultCardModel = $("#result-card-model").clone().removeAttr("id");
  var successEl = resultCardModel.find(".successful");
  var failedEl = resultCardModel.find(".failed");

  self.render = function() {
    var results = resultsController.getResults();

    var failedNoteCount = results.failedNotes.length;
    var successfullNoteCount = results.successfulNotes.length;
    cardEl.css({"border": "1px solid black", visibility: "shown"});
    failedEl.html("Failed: " + failedNoteCount);
    successEl.html("Successful: "+ successfullNoteCount);
    cardEl.append(resultCardModel);
  }

  self.shouldSwitchFocus = function(container) {
    var should = ViewUtil.isElementInContainerViewportVertically(cardEl[0], container);
    return should;
  }

  self.focus = function() {
    console.log("focusing");
  }

  self.destroy = function() {
//    submitBinding && submitBinding.unbind();
//    noteCard.remove();
  }
}