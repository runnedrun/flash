/*
  This controller manages all the LearnMode. It initializes the LearnModeNoteCardsController, to manage
  the note card challenge activity. That controller is passed the handleFinishedNote method which will be called
  whenever it get's a score for a note. The LearnModeController decides what note score qualify as failing, and track
  all failing notes. When the onNotesExhaustedMethod is called if there are any more failed notes the LearnModeController
  will add them back into the LearnModeNotesController's queue. If there are no failed notes when onNotesExhausted is
  called then the learn mode is complete, and finish is called to change the background to review mode.
 */

LearnModeController = function() {
  var self = this;

  var allFailedNotes = new Set()
  var allSuccessfulNotes = [];
  var currentFailedNotes = [];

  this.getResults = function() {
    return {successfulNotes: allSuccessfulNotes, failedNotes: allFailedNotes};
  }

  function finish() {
    console.log("DONEEE!");
//    Fire.command("controller.background.change", { background: BackgroundView.Background.review })
  }

  function handleFinishedNote(note, score, isComplete) {
    console.log("score:", score);
    if (score <= 3) {
      allFailedNotes.add(note);
      currentFailedNotes.push(note);
    } else if (!allFailedNotes.has(note)) {
      allSuccessfulNotes.add(note);
    }

    isComplete && finish()
  }

  function onNotesExhausted() {
    if (currentFailedNotes.length > 0) {
      $.each(currentFailedNotes, function(i, note) {
        noteCardsController.addNote(note);
      })
      currentFailedNotes = []
    }
  }

  function getNotes() {
    NoteManager.getTodaysNotes();
  }

  function addNote(e) {
    var newNote = e.note;
    var filter = e.filter;

    if (filter === NoteManager.Filter.today) {
      noteCardsController.addNote(newNote);
    }
  }

  Respond.toEvent("note.new", addNote);

  var resultsView = []//new ResultsView(self);
  var noteCardsController = new LearnModeNoteCardsController(self, resultsView, handleFinishedNote, onNotesExhausted);
  getNotes();
}