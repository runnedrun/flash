/*
  This controller manages all the LearnMode. It initializes the LearnModeNoteCardsController, to manage
  the note card challenge activity. That controller is passed the handleFinishedNote method which will be called
  whenever it get's a score for a note. The LearnModeController decides what note score qualify as failing, and track
  all failing notes. When the onNotesExhaustedMethod is called if there are any more failed notes the LearnModeController
  will add them back into the LearnModeNotesController's queue. If there are no failed notes when onNotesExhausted is
  called then the learn mode is complete, and finish is called to change the background to review mode.
 */

ModeController = function() {
  var self = this;
  var mode = "learn";

  var notesView = new NotesView();

  // passing 2 indicates that the scroll view should start centered on the last card;
  var scrollCardView = new ScrollCardView(nextNoteToRender, function() {}, 2);
  var learnModeNoteCardsController = new LearnModeNoteCardsController(readyToShowLearnModeResults, updateLearnModeStatus);
  var viewModeNoteCardsController = new ViewModeNoteCardsController();
  var backgroundView = new BackgroundView();
  var statusView = new StatusView();

  function updateLearnModeStatus(numberComplete, total) {
    var percentDone = numberComplete / total;
    backgroundView.moveBackgroundToPercent(percentDone);
    statusView.update(total - numberComplete);
  }

  function getNotes() {
    NoteManager.getTodaysNotes();
  }

  function addNote(e) {
    var newNote = e.note;
    var filter = e.filter;

    if (filter === NoteManager.Filter.today) {
      learnModeNoteCardsController.addNote($.extend(newNote, {id: newNote.id}));
    }

    viewModeNoteCardsController.addNote($.extend(newNote, {id: newNote.id}));

    scrollCardView.refreshCards();
  }

  function nextNoteToRender(cardEl, cursor) {
    if (mode === "learn") {
      // if there are results, let's show them
      var resultsController = learnModeNoteCardsController.getResultsController();

      if (resultsController) {
        console.log("returning results");
        return new ResultsView(resultsController, cardEl, switchToViewMode);
      } else {
        var noteCardController = learnModeNoteCardsController.nextNoteCardController();
        return noteCardController && new LearnModeNoteCardView(noteCardController, cardEl, scrollCardView.scrollToPrevious)
      }
    } else {
      var noteCardController = viewModeNoteCardsController.nextNoteCardController(cursor);
      return noteCardController && new ViewModeNoteCardView(noteCardController, cardEl);
    }
  }

  function previousNoteToRender(cardEl, cursor) {
    if (mode = "view") {
      var noteCardController = viewModeNoteCardsController.previousNoteCardController(cursor);
      return noteCardController && new ViewModeNoteCardView(noteCardController, cardEl);
    }
  }


  function readyToShowLearnModeResults() {
    scrollCardView.refreshCards();
  }

  function switchToViewMode() {
    console.log("switching modes");
    mode = "view";
    statusView.hide();
    backgroundView.moveBackgroundToPercent(100);
    scrollCardView.refreshCards();
    scrollCardView.scrollNCards(-1 * viewModeNoteCardsController.noteCount());
  }

  Respond.toEvent("note.new", addNote);
  notesView.render(scrollCardView);

  getNotes();
}