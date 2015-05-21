NewNoteView = function(newNoteController, cardEl, onCreate) {
  var self = this;
  var newNoteCard = $("#new-note-model").clone().removeAttr("id");
  var noteEntry = newNoteCard.find(".note-text");
  var hintEntry = newNoteCard.find(".hint");
  var createBinding;

  function create() {
    var noteContent = noteEntry.val();
    var hintContent = hintEntry.val();
    if (noteContent) {
      console.log("creating new note", noteContent, hintContent);
      newNoteController.create(noteContent, hintContent).then(function() {
        noteEntry.val("");
        hintEntry.val("");
      })
    }
  }

  self.render = function() {
    createBinding = KeyBinding.keydown(KeyCode.enter, $(newNoteCard), create);
    cardEl.append(newNoteCard);
  }

  self.shouldSwitchFocus = function(container) {
    var should = ViewUtil.isElementInContainerViewportVertically(cardEl[0], container);
    return should;
  }

  self.focus = function() {
    noteEntry.focus();
  }

  self.destroy = function() {
    createBinding.unbind();
    newNoteCard.remove();
  }

  self.hide = function() {
    newNoteCard.hide();
  }

  self.getCursor = function() {
    return Number.MAX_VALUE;
  }

  self.height = 40;
}