// All note cards must implement hide as well as destroy. Hide is used while the page is scrolling,
// as remove during a scroll stops momentum. Once scrolling is complete, destroy is called.

ViewModeNoteCardView = function(noteCardController, cardEl) {
  var self = this;

  var noteCard = $("#view-mode-note-card-model").clone().removeAttr("id");
  var noteCardText = noteCard.find(".text");
  var hint = noteCard.find(".hint");

  var submitBinding;

  self.render = function () {
    cardEl.append(noteCard);
    noteCardText.html(noteCardController.getText());
    hint.html(noteCardController.getHint());
  }


  self.shouldSwitchFocus = function(container) { return false };

  self.focus = function() {};

  self.destroy = function() {
    noteCard.remove();
  };

  self.hide = function () {
    noteCard.hide();
  }

  self.getCursor = function() {
    return noteCardController.getCursor()
  };

  self.height = 50;
}