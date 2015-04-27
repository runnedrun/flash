ScrollCardController = function(nextNoteCardController, getResultsController) {
  var self = this;

  function nextNote(cardEl) {
    // if there are results, let's show them
    var resultsController = getResultsController();

    if (resultsController) {
      return new ResultsView(resultsController, cardEl);
    } else {
      var noteCardController = nextNoteCardController();
      return noteCardController && new LearnModeNoteCardView(noteCardController, cardEl, scrollForwardOneNote)
    }
  }

}
