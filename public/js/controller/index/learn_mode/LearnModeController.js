LearnModeController = function() {
  var self = this;
  var notes = {};  // Today's notes
  var notesToShow = []; // the list of notes which still need to be shown

  var State = {
    login: 0,
    message: 1,
    waitForNotes : 2,
    showNote: 3,
    finish: 4
  };

  var progress = 0;
  var failedNotes = [];  // To be randomized and reviewed at end of session
  var currentNote = {};
  var currentState;


  function finish() {
    Fire.command("controller.background.change", { background: BackgroundView.Background.review })
  }

  function showNextNoteOrFinish() {
    if (notesToShow.length > 0) {
      var index = Util.random(0, notesToShow.length - 1);
      var noteToShow = notesToShow[index];
      notesToShow.splice(index, 1);
      Fire.command("controller.note-card.new", { note: noteToShow });
    } else {
      finish();
    }
  }

  // rename this function once we know all that it does
  function respondToMessageComplete() {
    if (notesToShow.length > 0) {
      var index = Util.random(0, notesToShow.length - 1);
      var noteToShow = notesToShow[index];
      notesToShow.splice(index, 1);
      Fire.command("controller.note-card.new", { note: noteToShow });
    }
  }

  function getNotes() {
    NoteManager.getTodaysNotes();
  }

  function addNote(e) {
    var newNote = e.note;
    var filter = e.filter;
    var hasNotes = Object.keys(notes).length > 0;

    if (filter === NoteManager.Filter.today) {
      notes[newNote.id] = newNote;
      notesToShow.push(newNote);
    }

    if (!hasNotes) {
      showNextNoteOrFinish(newNote);
    }
  }

  Respond.toCommand("controller.message.complete", respondToMessageComplete);
  Respond.toEvent("note.new", addNote);
  Respond.toRequest("result.complete", showNextNoteOrFinish);
  Respond.toRequest("message.view.complete", respondToMessageComplete);
  Respond.toCommand("controller.note.completed", showNextNoteOrFinish);

  getNotes();
//  Fire.command("view.note-card.show", {note: {}});
//  Fire.command("view.note-card.hide");
//  Fire.command("view.note.new", {note: {}});
//  Fire.command("view.result-view.show", {resultsMesage: ""});
//  Fire.command("view.note.started", {note: {}});
//  Fire.command("view.message-view.show", {message: "Hola you're back!"})
//  Fire.command("view.note-info.show", {info: "", link: ""})
//  Fire.command("view.background-view.show`", { background: BackgroundView.Background.learn, fadeTime: 2000 });

//  self.advanceState();
}