/*
  This view manages the list of notes which are shown to the user in learn mode. It initializes a ScrollCardView, which
  allows for infinite scrolling of content cards. It passes nextNote and previous to the ScrollCardView for that view's
  fillNextCard and fillPreviousCard methods. previousNote is unimplemented here, as during learn mode the user should
  never go back to the previous note. Next note initializes a NoteCardView, with the card jquery element passes to it
  by ScrollCardView, and returns that.
 */

LearnModeNoteScrollView = function(nextNoteCardController, resultsView) {
  var self = this;
  var cardsContainer = $(".card-container");

  var infoCardView = new ScrollCardView(cardsContainer, nextNote, previousNote, 3, fillTopBumper);

  // This is called when there were less than less than three cards and new ones have been
  // added.
  self.refreshNoteList = function() {
    infoCardView.refreshMissingCards();
  }

  KeyBinding.keydown(KeyCode.down, $(document.body), scrollForwardOneNote);

  function nextNote(cardEl) {
    var controller = nextNoteCardController();
    console.log("controller", controller)
    if (controller) {
      return new LearnModeNoteCardView(controller, cardEl, scrollForwardOneNote);
    } else {
      return false
    }
  }

  function fillTopBumper(cardEl) {
//    return resultsView(cardEl);
  }

  function previousNote(cardEl) {
    // this should never be called
  }

  function scrollForwardOneNote(e) {
    console.log("scrolling forward one note");
    infoCardView.scrollToPrevious();
    return false;
  }
}