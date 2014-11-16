/*
  This view manages the list of notes which are shown to the user in learn mode. It initializes a ScrollCardView, which
  allows for infinite scrolling of content cards. It passes nextNote and previous to the ScrollCardView for that view's
  fillNextCard and fillPreviousCard methods. previousNote is unimplemented here, as during learn mode the user should
  never go back to the previous note. Next note initializes a NoteCardView, with the card jquery element passes to it
  by ScrollCardView, and returns that.
 */

LearnModeNoteScrollView = function(noteCardController) {
  var cardsContainer = $(".card-container");

  var infoCardView = new ScrollCardView(cardsContainer, nextNote, previousNote);

  function nextNote(cardEl) {
    console.log("making next note");
    var controller = noteCardController.nextNoteCardController();

    if (controller) {
      return new NoteCardView(controller, cardEl);
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