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

  var failedNotes = [];

  function finish() {
    Fire.command("controller.background.change", { background: BackgroundView.Background.review })
  }

  function handleFinishedNote(note) {
    var q = e.q;
    if (q <= 3) {
      failedNotes.push(note);
    }
  }

  function onNotesExhausted() {
    if (failedNotes.length > 0) {
      $.each(failedNotes, function(i, note) {
        noteCardsController.addNote(note);
      })
    } else {
      finish();
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

  var noteCardsController = new LearnModeNoteCardsController(self, handleFinishedNote, onNotesExhausted);
  getNotes();
}