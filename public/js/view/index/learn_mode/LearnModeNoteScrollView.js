/*
  This view manages the list of notes which are shown to the user in learn mode. It initializes a ScrollCardView, which
  allows for infinite scrolling of content cards. It passes nextNote and previous to the ScrollCardView for that view's
  fillNextCard and fillPreviousCard methods. previousNote is unimplemented here, as during learn mode the user should
  never go back to the previous note. Next note initializes a NoteCardView, with the card jquery element passes to it
  by ScrollCardView, and returns that.
 */

LearnModeNoteScrollView = function(nextNoteCardController) {
  var self = this;
  var cardsContainer = $(".card-container");

  var infoCardView = new ScrollCardView(cardsContainer, nextNote, previousNote);

  self.refreshNoteList = function() {
    infoCardView.refreshMissingCards();
  }

  function nextNote(cardEl) {
    console.log("making next note");
    var controller = nextNoteCardController();

    if (controller) {
      return new LearnModeNoteCardView(controller, cardEl);
    } else {
      return false
    }
  }

  function previousNote(cardEl) {
    // this should never be called
  }

  function scrollForwardOneNote() {
    console.log("scrolling forward one note");
    infoCardView.scrollToPrevious();
  }
}