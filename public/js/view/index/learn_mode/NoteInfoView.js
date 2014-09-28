NoteInfoView = function(noteInfoController) {
  var hintIcon = $("#hint_icon");
  var hintDiv = $('#hint');
  var linkDiv = $('#note_link');
  var noteInfoDiv = $('#note_info');
  var self = this;

  self.showInfo = function(hint, link) {
    linkDiv.attr("href", link);
    hintDiv.html(hint);
    ViewUtil.fadeIn(noteInfoDiv);
  }
  self.hideInfo = function() {
    ViewUtil.fadeOut(noteInfoDiv);
  }

  self.revealHint = function() {
    hintIcon.hide();
    hintDiv.show();
  }
  self.concealHint = function() {
    hintDiv.hide();
    hintIcon.show();
  }

  noteInfoDiv.hide();
  hintDiv.hide();
}