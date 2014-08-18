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
//  var states = [
//    {"state" : State.login, events: [
//      { name: "controller.login.start" }
//    ]},
//    {"state": State.message, events: [
//      { name: "view.message-view.show", "data" : { message: "I've got to remember..." } }
//    ]},
//    {"state" : State.waitForNotes, events: [
//      {name: "view.loading-screen.show"}
//    ]}
//  ];

  var currentState;

//  function addState(state, events) {
//    states.push({ state: state, events: events});
//  }
//
//  function addShowNoteState(note) {
//    addState(State.shownNote, [
//      { name: "view.note-card.show"}
//    ])
//  }

  //  Advance the state
//  function advanceState() {
//    var nextState = states.shift();
//    $(document).trigger($.extend({'type' : 'state.' + nextState.state}, nextState.data));
//  }

  function handleNoteResult(q) {
    var id = self.currentNote.id;
    API.sendResult(id, q);
    if (q<1){
      self.failedNotes.push(id);
    }
    $(document).trigger($.extend({'type' : 'notes.progress'}, {'q' : q, "index" : self.progress})); // Why extend here?
    return // ? necessary
  }

  function finish() {
    Fire.command("controller.background.change", { background: BackgroundView.Background.review })
  }

  function updateCurrentNote(id) {
    self.currentNote = self.notes[id];
  }

  function nextNote() {
    if (!self.order.length) {
      if (self.failedNotes.length) {
        self.states.push( {"state" : "message", "data" : {"message" : "Something's still missing..."}})
      }
      self.failedNotes = randomize(self.failedNotes);
      self.order = self.order.concat(self.failedNotes);
      self.failedNotes = [];
    }
    var noteID = self.order.pop();
    if (noteID) {
      self.updateCurrentNote(noteID);
    }
    return noteID;
  };

  function showNextNoteOrFinish() {
    if (notesToShow.length > 0) {
      var index = Util.random(0, notesToShow.length - 1);
      var noteToShow = notesToShow[index];
      notesToShow.splice(index, 1);
      Fire.command("view.note-card.show", { note: noteToShow });
    } else {

    }
  }

  function getNotes(id) {
    NoteManager.getTodaysNotes();
  }

  function addNote(e) {
    var newNote = e.note;
    var filter = e.filter;

    if (filter === NoteManager.Filter.today) {
      notes[newNote.id] = newNote;
      notesToShow.push(newNote);
    }

    if (currentState == State.waitForNotes) {
      showNote(newNote);
    }
  }

//  function removeWaitAndAdvanceState(notesToAdd) {
//    var notesToAdd
//    if (currentState == State.waitForNotes) {
//      advanceState();
//    }
//  }


  Respond.toEvent("note.new", addNote)
  Respond.toRequest("result.view.complete");
  Respond.toRequest("message.view.complete");
  Fire.command("view.note-card.show", {note: {}});
  Fire.command("view.note-card.hide");
  Fire.command("view.note.new", {note: {}});
  Fire.command("view.result-view.show", {resultsMesage: ""});
  Fire.command("view.note.started", {note: {}});
  Fire.command("view.message-view.show", {message: "Hola you're back!"})
  Fire.command("view.note-info.show", {info: "", link: ""})

  Fire.command("view.background-view.show`", { background: BackgroundView.Background.learn, fadeTime: 2000 });

//  self.advanceState();
}