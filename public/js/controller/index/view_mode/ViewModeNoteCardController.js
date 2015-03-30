ViewModeNoteCardController = function(note) {
  var self = this;

  self.getCursor = function() {
    return note.id
  }

  self.getText = function() {
    return note.highlight
  }

  self.getHint = function() {
    return note.hint
  }
}