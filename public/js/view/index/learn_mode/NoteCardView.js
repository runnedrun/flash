

var NoteCardView = function() {

}


var NoteCardController = function() {

}

var infoCard = function(challenge, infoCardController) {
  // note display constants in percentage of view port height
  var margin = 20;
  var height = 20;

  var flashCard = $("#flash-card-model").clone.removeAttr("id").hide();
  flashCard.css({
    "margin-bottom": margin + "vh",
    "height": height + "vh"
  });

  var preUnderline = flashCard.find('.pre-underline');
  var underline = flashCard.find('.underline');
  var postUnderline  = flashCard.find('.post-underline');

  var challenge = flashCard.('.challenge');
  var result = flashCard.('.result');

  self.showChallenge = function(textObject) {

    submitBinding = KeyBinding.keypress(KeyCode.enter, $(document), submitNote);
    updateNoteText(textObject);
    challenge.show();
    underline.focus();
  }

  self.hideChallenge = function() {
    challenge.hide();
  }

  function submitNote() {
    var missingWord = underline.val();
    infoCardController.submitNote(missingWord);
  }

  self.showCard = function() {
    flashCard.show();
  }

  self.hideCard = function() {
    submitBinding.unbind();
    flashCard.hide();
  }

  function updateNoteText(text) {
    underline.val("");
    underline.attr("size", text.missingWord.length - 1);

    postUnderline.html(text.postfix);
    preUnderline.html(text.prefix)
  }
}