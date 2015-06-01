// All note cards must implement hide as well as destroy. Hide is used while the page is scrolling,
// as remove during a scroll stops momentum. Once scrolling is complete, destroy is called.

NoteCardView = function(noteCardController, cardEl) {
  var self = this;

  var noteCard = $("#view-mode-note-card-model").clone().removeAttr("id");
  var text = noteCard.find(".static.note-text");
  var hint = noteCard.find(".static.hint");
  var updateText = noteCard.find(".update.note-text");
  var updateHint = noteCard.find(".update.hint");
  var deleteButton = noteCard.find(".delete-button");

  var textFieldSubmitBinding;
  var hintFieldSubmitBinding;

  function updateNote() {
    noteCardController.update(updateText.val(), updateHint.val());
  }

  function renderContent() {
    var textContent = noteCardController.getText();
    var hintContent = noteCardController.getHint();

    text.html(textContent);
    updateText.val(textContent);

    text.show();
    updateText.hide();

    if (hintContent) {
      hint.html(hintContent);
      updateHint.val(hintContent);
      updateHint.hide();
      hint.show();
    } else {
      hint.hide();
      updateHint.show();
    }

    text.click(function() {
      text.hide();
      updateText.show();
      updateText.focus();
    });

    hint.click(function() {
      hint.hide();
      updateHint.show();
      updateHint.focus();
    });

    deleteButton.click(function() {
      noteCardController.delete();
    })
  }

  self.render = function () {
    cardEl.append(noteCard);
    renderContent();
    textFieldSubmitBinding = KeyBinding.keydown(KeyCode.enter, updateText, updateNote);
    hintFieldSubmitBinding = KeyBinding.keydown(KeyCode.enter, updateHint, updateNote);
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

  self.height = 30;

  self.updateContent = function () {
    renderContent();
  }
}