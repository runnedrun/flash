/*
  This controller manages all the note cards which are to be shown to a user. note are added to it's queue by calling
  the createNoteCard method. At initialization it creates a LearnModeNoteScrollView. This view will call back to the
  nextNoteCardController method to get a new LearnModeNoteCardController, for the next note, when it needs to display it.
  submitNoteScore is passed to the LearnModeNoteCardController as a callback. It is called when the child controller
  needs to submit a score for a note, after a use solves a challenge. The method persists the score if necessary using
  the NoteManager. When all notes have been attempted the controller calls out to the LearnModeController with its
  successful and failed notes.
 */

LearnModeNoteCardsController = function(learnModeController, resultsView, handleFinishedNote, onNotesExhausted) {
  var self = this;
  var notesDisplayed = 0;
  var notesAttempted = 0;
  var notes = [];
  var attemptedNotes = [];

  self.addNote = function(note) {
    console.log("adding note");
    var numberOfNotesBeforeAdding = notes.length
    notes.push(note);

    notesDisplayed += 1;


    // if there were less than 3 notes to begin with try to refresh  the note card list
    if (numberOfNotesBeforeAdding < 3 ) {
      console.log("refreshing note list");
      scrollView.refreshNoteList();
    }
  }

  function nextNoteCardController() {
    if (notes.length) {
      var noteIndex = Util.random(0, notes.length);
      var note = notes[noteIndex];
      notes.splice(notes.indexOf(note), 1);
      return new LearnModeNoteCardController(note, submitNoteScore);
    } else {
      onNotesExhausted();
      return false
    }
  }

  function submitNoteScore(note, score) {
    console.log("submitting!!!!;");
    if (attemptedNotes.indexOf(note) < 0) {
      attemptedNotes.push(note);
      NoteManager.solveNote(note, score);
    }
    notesAttempted += 1;
    console.log(notesAttempted, notesDisplayed)
    var complete = (notes.length == 0) && (notesAttempted == notesDisplayed);
    handleFinishedNote(note, score, complete);
  }

  var scrollView = new LearnModeNoteScrollView(nextNoteCardController, resultsView);
}