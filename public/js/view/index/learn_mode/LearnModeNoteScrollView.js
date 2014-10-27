LearnModeNoteScrollView = function(noteCardController) {
  var cardsContainer = $(".card-container");

  var infoCardView = new InfoCardView(cardsContainer, nextNote, previousNote);

  function nextNote(cardEl) {
    console.log("making next note");
    var noteChallenge = noteCardController.nextNoteChallenge();

    if (noteChallenge) {
      return new NoteCardView(noteCardController, cardEl, noteChallenge);
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