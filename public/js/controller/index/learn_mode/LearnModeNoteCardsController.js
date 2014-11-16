/*
  This controller manages all the note cards which are to be shown to a user. note are added to it's queue by calling
  the createNoteCard method. At initialization it creates a LearnModeNoteScrollView. This view will call back to the
  nextNoteCardController method to get a new LearnModeNoteCardController, for the next note, when it needs to display it.
  submitNoteScore is passed to the LearnModeNoteCardController as a callback. It is called when the child controller
  needs to submit a score for a note, after a use solves a challenge. The method persists the score if necessary using
  the NoteManager. When all notes have been attempted the controller calls out to the LearnModeController with its
  successful and failed notes.
 */

LearnModeNoteCardsController = function() {
  var self = this;

  var scrollView = new LearnModeNoteScrollView(self);
  var notes = [];
  var attemptedNotes;

  self.addNote = function(note) {
    console.log("adding new note");
    notes.push(note);
  }

  function nextNoteCardController() {
    console.log("Getting next note card");
    if (notes.length) {
      var noteIndex = Util.random(0, notes.length);
      var note = notes[noteIndex];

      return new LearnModeNoteCardController(note, submitNoteScore);
    } else {
      return false
      LearnModeController
    }
  }

  function submitNoteScore(note, score) {
    if (attemptedNotes.indexOf(note) < 0) {
      attemptedNotes.push(note);

      NoteManager.solveNote(note, score);
    }
  }

}