ViewModeNoteCardView = function(noteCardController, cardEl) {
  var self = this;

  var noteCard = $("#view-mode-note-card-model").clone().removeAttr("id");
  var noteCardText = noteCard.find(".note-text .text");

  cardEl.append(noteCard);

  var submitBinding;

  self.render = function () {
    noteCardText.html(noteCardController.getNoteText());
  }


  self.shouldSwitchFocus = function(container) { return false };

  self.focus = function() {};

  self.destroy = function() { noteCard.remove(); };

  self.getCursor = function() { return noteCardController.getCursor() };
}