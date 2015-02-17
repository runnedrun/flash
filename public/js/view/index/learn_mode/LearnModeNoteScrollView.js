/*
  This view manages the list of notes which are shown to the user in learn mode. It initializes a ScrollCardView, which
  allows for infinite scrolling of content cards. It passes nextNote and previous to the ScrollCardView for that view's
  fillNextCard and fillPreviousCard methods. previousNote is unimplemented here, as during learn mode the user should
  never go back to the previous note. Next note initializes a NoteCardView, with the card jquery element passes to it
  by ScrollCardView, and returns that.
 */

LearnModeNoteScrollView = function(nextNoteCardController, getResultsController) {
  var self = this;
  var cardsContainer = $(".card-container");

  var infoCardView = new ScrollCardView(cardsContainer, nextNote, previousNote, 2);

  // This is called when there were less than less than three cards and new ones have been
  // added.
  self.refreshNoteList = function() {
    infoCardView.refreshMissingCards();
  }

  KeyBinding.keydown(KeyCode.down, $(document.body), scrollForwardOneNote);

  function nextNote(cardEl) {
    // if there are results, let's show them
    var resultsController = getResultsController();

    if (resultsController) {
      console.log("returning results");
      return new ResultsView(resultsController, cardEl);
    } else {
      var noteCardController = nextNoteCardController();
      return noteCardController && new LearnModeNoteCardView(noteCardController, cardEl, scrollForwardOneNote)
    }
  }

  function previousNote(cardEl) {
    // this should never be called
  }

  function scrollForwardOneNote(e) {
    infoCardView.scrollToPrevious();
    return false;
  }
}