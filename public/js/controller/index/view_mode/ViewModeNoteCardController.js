ViewModeNoteCardController = function(note) {
  var self = this;

  self.getCursor = function() {
    return note.id
  }

  self.getNoteText = function() {
    return note.highlight
  }
}