LearnModeNoteScrollView = function(noteCardController) {
  var cardsContainer = $(".card-container");

  var infoCardView = new InfoCardView(cardsContainer, nextNote, previousNote);

  function nextNote(cardEl) {
    console.log("making next note");
    var noteChallenge = noteCardController.nextNoteChallenge();
    var noteCard = new NoteCardView(noteCardController, cardEl, noteChallenge)
    return noteCard.destroy
  }

  function previousNote(cardEl) {
    // this should never be called
    console.log("ERROR: should not be calling the previousNote method in the learn mode note scroller.")
  }

  function scrollForwardOneNote() {
    // unimplemented
  }
}