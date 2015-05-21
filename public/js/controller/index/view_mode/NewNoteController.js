NewNoteController = function() {
  var self = this;

  self.create = function(content, hint) {
    return NoteManager.createNote(content, hint);
  }
}