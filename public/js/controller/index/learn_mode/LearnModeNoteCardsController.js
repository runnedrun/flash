/*
  This controller manages all the note cards which are to be shown to a user. note are added to it's queue by calling
  the createNoteCard method. At initialization it creates a LearnModeNoteScrollView. This view will call back to the
  nextNoteCardController method to get a new LearnModeNoteCardController, for the next note, when it needs to display it.
  submitNoteScore is passed to the LearnModeNoteCardController as a callback. It is called when the child controller
  needs to submit a score for a note, after a use solves a challenge. The method persists the score if necessary using
  the NoteManager. When all notes have been attempted the controller calls out to the LearnModeController with its
  successful and failed notes.
 */

LearnModeNoteCardsController = function(refreshStatus) {
  var self = this;
  var uniqueNotes = {};
  var allFailedNotes = {};
  var allSuccessfulNotes = [];
  var notesDisplayed = 0;
  var notesAttempted = 0;
  var notes = [];
  var attemptedNotes = [];
  var resultsShown = false;

  self.addNote = function(note) {
    notes.push(note);
    uniqueNotes[note.id] = note;

    refreshExternalStatus();
  }

  self.getResults = function() {
    return { successfulNotes: allSuccessfulNotes, failedNotes: Util.objectValues(allFailedNotes) };
  }

  self.getResultsController = function() {
    if (notesComplete() && !resultsShown) {
      resultsShown = true;
      return self;
    }
  }

  self.nextNoteCardController = function() {
    var noteIndex = Util.random(0, notes.length);
    var note = notes[noteIndex];
    notes.splice(notes.indexOf(note), 1);
    if (note) {
      notesDisplayed += 1;
      return new LearnModeNoteCardController(note, submitNoteScore);
    }
  }

  function notesComplete() {
    return (notes.length == 0) && (notesAttempted > 0) && (notesAttempted == notesDisplayed)
  }

  // this is used to refresh the background, and update the note count
  function refreshExternalStatus() {
    refreshStatus(allSuccessfulNotes.length, Object.keys(uniqueNotes).length)
  }

  function submitNoteScore(note, score) {
    if (attemptedNotes.indexOf(note) < 0) {
      attemptedNotes.push(note);
      NoteManager.solveNote(note, score);
    }

    notesAttempted += 1;

    if (score <= 3) {
      allFailedNotes[note.id] = note;
      notes.push(note);
    } else if (!allFailedNotes[note]) {
      allSuccessfulNotes.push(note);
    }

    refreshExternalStatus();
  }
}