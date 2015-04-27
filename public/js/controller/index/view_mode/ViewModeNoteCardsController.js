/*
  This controller manages all the notes for view mode. It has nextNoteCardController and
  previousNoteCardController methods, which take in the id of the previous note which was
  displayed. Then they return the controller for the next or previous note.
 */

var notes

ViewModeNoteCardsController = function(updateViewModeStatus) {
  var self = this;
  notes = [];

  self.addNote = function(note) {
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
    var prevId = prevNoteId || Number.MIN_VALUE
    $.each(notes, function(i, note) {
      if (note.id > prevId) {
        newNote = note;
        return false;
      }
    })

    if (!newNote) {
//      console.log(notes);
    }

    return newNote;
  }

  self.noteCount = function() {
    return notes.length
  }

  function getPrevNote(prevNoteId) {
    var newNote;

    var revNotes = notes.reverse().slice();
    notes.reverse();

    var prevId = prevNoteId || Number.MAX_VALUE
    $.each(revNotes, function(i, note) {
      if (note.id < prevId) {
        newNote = note;
        return false
      }
    })

    return newNote;
  }
};