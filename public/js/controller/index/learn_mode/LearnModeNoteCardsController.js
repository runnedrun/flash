/*
  This controller manages all the note cards which are to be shown to a user. note are added to it's queue by calling
  the createNoteCard method. At initialization it creates a LearnModeNoteScrollView. This view will call back to the
  nextNoteCardController method to get a new LearnModeNoteCardController, for the next note, when it needs to display it.
  submitNoteScore is passed to the LearnModeNoteCardController as a callback. It is called when the child controller
  needs to submit a score for a note, after a use solves a challenge. The method persists the score if necessary using
  the NoteManager. When all notes have been attempted the controller calls out to the LearnModeController with its
  successful and failed notes.
 */

LearnModeNoteCardsController = function(learnModeController, handleFinishedNote, onNotesExhausted) {
  var self = this;
  var notes = [];
  var attemptedNotes;

  self.addNote = function(note) {
    console.log("adding new note");
    notes.push(note);

    // if there were less than 3 notes to begin with try to refresh  the note card list
    if (notes.length <= 3 ) {
      scrollView.refreshNoteList();
    }
  }

  function nextNoteCardController() {
    console.log("Getting next note card");
    if (notes.length) {
      var noteIndex = Util.random(0, notes.length);
      var note = notes[noteIndex];

      return new LearnModeNoteCardController(note, submitNoteScore);
    } else {
//      onNotesExhausted();
      return false
    }
  }

  function submitNoteScore(note, score) {
    if (attemptedNotes.indexOf(note) < 0) {
      attemptedNotes.push(note);
      notes.splice(notes.indexOf(note), 1);
      handleFinishedNote(note);
      NoteManager.solveNote(note, score);
    }
  }

  var scrollView = new LearnModeNoteScrollView(nextNoteCardController);
}