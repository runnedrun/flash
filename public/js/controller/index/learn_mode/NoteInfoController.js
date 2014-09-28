// this controller will keep state for the note info. It will show, hide, and conceal
// ancillary info about the note.

NoteInfoController = function() {
  var missingWord;
  var currentNote;
  var self = this;
  self.noteInfoView = new NoteInfoView(self);

  function showNoteInfo(e) {
    self.noteInfoView.concealHint();
    self.noteInfoView.showInfo(e.hint, e.pageUrl);
  }
  function hideNoteInfo(e) {
    self.noteInfoView.hideInfo();
  }
  self.concealHint = function() {
    self.NoteInfoView.concealHint();
  }
  self.revealHint = function() {
    self.NoteInfoView.revealHint();
  }

  Respond.toCommand("controller.note-info.show", showNoteInfo);
  Respond.toCommand("controller.note-info.hide", hideNoteInfo);
}