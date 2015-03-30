/*
  This view renders note content in a card. Given a jquery card element it defines a render, shouldSwitchFocus, focus
  and destroy method. The methods are called just in time by the scroll card view when this note needs to render. It
  takes a noteCardController at initialization, which has a generate challenge method. This method produces a challenge
  object which has missingWord, postfix and prefix property. These properties are used to render a challenge
  for the user of the form:

  fill in the missing word:

  postfix _________ prefix.

  When the user hits enter to submit the challenge the submitted word is passed to the noteCardController, which will
  evaluate the answer for correctness.
 */

LearnModeNoteCardView = function(noteCardController, cardEl, onComplete) {
  var self = this;

  var noteChallenge = noteCardController.generateChallenge()
  var noteCard = $("#learn-mode-note-card-model").clone().removeAttr("id");
  cardEl.html(noteCard);

  var preUnderline = noteCard.find('.pre-underline');
  var underline = noteCard.find('.underline');
  var postUnderline  = noteCard.find('.post-underline');
  var hint = noteCard.find('.hint');

  var challenge = noteCard.find('.challenge');
  var result = noteCard.find('.result');

  var submitBinding;

  function submitNote() {
    var missingWord = underline.val();
    if(missingWord) {
      noteCardController.submitNote(missingWord);
      onComplete();
    }

  }

  self.render = function () {
    submitBinding = KeyBinding.keydown(KeyCode.enter, $(cardEl), submitNote);

    underline.val("");
    underline.attr("size", noteChallenge.missingWord.length - 1);

    postUnderline.html(noteChallenge.postfix);
    preUnderline.html(noteChallenge.prefix);

    hint.html(noteCardController.hint);
  }

  self.shouldSwitchFocus = function(container) {
    var should = ViewUtil.isElementInContainerViewportVertically(underline[0], container);
    return should;
  }

  self.focus = function() {
    underline.focus();
  }

  self.destroy = function() {
    submitBinding && submitBinding.unbind();
    noteCard.remove();
  }

  // learn mode cards don't have cursors
  self.getCursor = function() { }
}