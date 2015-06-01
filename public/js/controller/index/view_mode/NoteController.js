NoteController = function(note) {
  var self = this;

  self.getCursor = function() {
    return note.id
  }

  self.getText = function() {
    return note.text
  }

  self.getId = function() {
    return note.id
  }

  self.getHint = function() {
    return note.hint
  }

  self.update = function(newText, newHint) {
    NoteManager.updateNote(newText, newHint, id);
  }

  self.delete = function() {
    NoteManager.deleteNote(note.id);
  }

  Respond.toCommand("note.update", function(data) {
    if (data.fields.note.id == note.id) {
      note = data.fields.note;
    }
  })
}