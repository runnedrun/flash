//  NoteCard
//
//  Object that keeps track of the current note in the UI,
//  and what the user has done to it.

//  Responsibilities:
//    Send notecard to notecard view
//    Fire events upon user interaction with the notecard view


/*
 TODO
 add sidebar with all notes
 notes are searchable/ditable inline
 prettify ui
 q is evaluated more than boolean, maybe
 maybe: resultdiv just replaces input with the word in red/green, pre and post just stay there.
 (strikethrough, with correct answer above it? That's hard, but maybe cooler than the wrong answer disappearingn)
 */

NoteCardView = function(noteCardController){
  var submitBinding;
  var self = this;

  // dynamic content
  var preUnderlineDiv = $('#pre_underline');
  var underlineDiv = $('#underline');
  var postUnderlineDiv = $('#post_underline');

  var noteDiv = $('#highlighted');

  self.showNote = function(textObject) {
    submitBinding = KeyBinding.keypress(KeyCode.enter, $(document), submitNote);
    updateNoteText(textObject);
    ViewUtil.fadeIn(noteDiv);
    setTimeout(function(){ underlineDiv.focus();}, 450);
  }

  function submitNote() {
    var missingWord = underlineDiv.val();
    noteCardController.submitNote(missingWord);
  }

  self.hideDisplay = function() {
    submitBinding.unbind();
    ViewUtil.fadeOut(noteDiv);
  }

  function updateNoteText(text) {
    preUnderlineDiv.html(text.prefix);
    underlineDiv.val("");
    underlineDiv.attr("size", text.missingWord.length - 1);
    postUnderlineDiv.html(text.postfix);
  }
}

