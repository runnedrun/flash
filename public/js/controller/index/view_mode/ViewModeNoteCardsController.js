/*
  This controller manages all the notes for view mode. It has nextNoteCardController and
  previousNoteCardController methods, which take in the id of the previous note which was
  displayed. Then they return the controller for the next or previous note.
 */

ViewModeNoteCardsController = function(updateViewModeStatus) {
  var self = this;
  var notes = [];

  self.addNote = function(note) {
    console.log("adding note to view mode", note.id);
    notes.push(note);
    notes.sort(function(note1, note2) {
      return (note1.id - note2.id)
    })
    updateViewModeStatus();
  }

  self.nextNoteCardController = function(idOfPreviousNote) {
    var note = getNextNote(idOfPreviousNote);
    return note && new ViewModeNoteCardController(note);
  }

  self.previousNoteCardController = function(idOfPreviousNote) {
    var note = getPrevNote(idOfPreviousNote);
    return note && new ViewModeNoteCardController(note);
  }

  function getNextNote(prevNoteId) {
    var newNote;

    console.log("prev id", prevNoteId)

    var prevId = prevNoteId || Number.MIN_VALUE
    $.each(notes, function(i, note) {
      if (note.id > prevId) {
        newNote = note;
        return false;
      }
    })

    return newNote;
  }

  self.noteCount = function() {
    return notes.length
  }

  function getPrevNote(prevNoteId) {
    console.log("getting prev")
    var newNote;

    var revNotes = notes.reverse().slice();
    notes.reverse();

    var prevId = prevNoteId || Number.MAX_VALUE
    console.log("rev notes", revNotes)
    $.each(revNotes, function(i, note) {
      if (note.id < prevId) {
        newNote = note;
        return false
      }
    })

    return newNote;
  }
};