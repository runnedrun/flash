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
  var mode = "view";

  var learnModeNotesLoaded = false;
  var viewModeNotesLoaded = false;

  var notesView = new NotesView();

  // passing 2 indicates that the scroll view should start centered on the last card;
  var scrollCardView = new ScrollCardView(renderCardAbove, renderCardBelow, 1);
  var learnModeNoteCardsController = new LearnModeNoteCardsController(updateLearnModeStatus);
  var viewModeNoteCardsController = new ViewModeNoteCardsController(updateViewModeStatus);
  var backgroundView = new BackgroundView();
  var statusView = new StatusView();
  var notesLoadingView = new NotesLoadingView(switchToViewMode);

  function updateViewModeStatus(numberComplete, total) {
    if (mode == "view"){
      scrollCardView.refreshCards();
    }

    viewModeNotesLoaded = true
  }

  function updateLearnModeStatus(numberComplete, total) {
    scrollCardView.refreshCards();

    if (!learnModeNotesLoaded) {
      learnModeNotesLoaded = true;
      notesLoadingView.hide();
    }

    var percentDone = numberComplete / total;
    backgroundView.moveBackgroundToPercent(percentDone);
    statusView.update(total - numberComplete);
  }

  function addNote(e) {
    var newNote = e.note;
    var filter = e.filter;

    if (filter === NoteManager.Filter.today) {
      learnModeNoteCardsController.addNote(newNote);
    } else {
      viewModeNoteCardsController.addNote(newNote);
    }
  }

  function renderCardAbove(cardEl, cursor) {
    if (mode === "learn") {
      // if there are results, let's show them
      var resultsController = learnModeNoteCardsController.getResultsController();

      if (resultsController) {
        return new ResultsView(resultsController, cardEl, switchToViewMode);
      } else {
        var noteCardController = learnModeNoteCardsController.nextNoteCardController();
        return noteCardController && new LearnModeNoteCardView(noteCardController, cardEl, scrollCardView.scrollToPrevious)
      }
    } else {
      var noteCardController = viewModeNoteCardsController.nextNoteCardController(cursor);

      if (noteCardController) {
        return new ViewModeNoteCardView(noteCardController, cardEl);
      } else if(cursor !== Number.MAX_VALUE) {
        return new NewNoteView(new NewNoteController(), cardEl, function(){
          console.log("createComplete!");
        });
      }
    }
  }

  function renderCardBelow(cardEl, cursor) {
    if (mode == "view") {
      var noteCardController = viewModeNoteCardsController.previousNoteCardController(cursor);
      return noteCardController && new ViewModeNoteCardView(noteCardController, cardEl);
    }
  }


  function switchToViewMode() {
    mode = "view";
    statusView.hide();
    backgroundView.viewMode();
    scrollCardView.refreshCards();
    // we need to add 1 to account for the new-note card
    scrollCardView.scrollNCards(-1 * viewModeNoteCardsController.noteCount() + 1);
  }

  Respond.toEvent("note.new", addNote);
  notesView.render(scrollCardView);

  setTimeout(function() {
    if (!learnModeNotesLoaded && viewModeNotesLoaded) {
      notesLoadingView.displayNoLearnModeNotesLoaded();
    } else if(!learnModeNotesLoaded && !viewModeNotesLoaded) {
      notesLoadingView.displayNoNotesLoaded();
    }
  }, 2000);

  NoteManager.getNotes();
}