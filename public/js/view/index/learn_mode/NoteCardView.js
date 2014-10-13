var NoteCardView = function(noteCardController, cardEl, noteChallenge) {
  var self = this;
  var noteCard = $("#note-card-model").clone().removeAttr("id");
  cardEl.html(noteCard);

  var preUnderline = noteCard.find('.pre-underline');
  var underline = noteCard.find('.underline');
  var postUnderline  = noteCard.find('.post-underline');

  var challenge = noteCard.find('.challenge');
  var result = noteCard.find('.result');

  var submitBinding = KeyBinding.keypress(KeyCode.enter, $(self.cardEl), submitNote);

  underline.val("");
  underline.attr("size", noteChallenge.missingWord.length - 1);

  postUnderline.html(noteChallenge.postfix);
  preUnderline.html(noteChallenge.prefix)

  challenge.focus();

  function submitNote() {
    var missingWord = underline.val();
    noteCardController.submitNote(missingWord);
  }

  self.destroy = function() {
    console.log("destroying")
    submitBinding.unbind();
    noteCard.remove();
  }
}