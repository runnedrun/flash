////  NoteCard
////
////  Object that keeps track of the current note in the UI,
////  and what the user has done to it.
//
////  Responsibilities:
////    Send notecard to notecard view
////    Fire events upon user interaction with the notecard view
//
//
///*
// TODO
// add sidebar with all notes
// notes are searchable/ditable inline
// prettify ui
// q is evaluated more than boolean, maybe
// maybe: resultdiv just replaces input with the word in red/green, pre and post just stay there.
// (strikethrough, with correct answer above it? That's hard, but maybe cooler than the wrong answer disappearingn)
// */
//
//NoteCardView = function(noteCardController){
//  var submitBinding;
//  var self = this;
//
//  var note1 = $("#flash-card-1"); // the note which is not showing at all
//  var note2 = $("#flash-card-2"); // the note which is partially showing on top
//  var note3 = $("#flash-card-3"); // the note which is fully showing
//  var note4 = $("#flash-card-4"); // the note which is partially showing on bottom
//
//  // dynamic content
//  var preUnderline = note3.find('.pre-underline');
//  var underline = note3.find('.underline');
//  var postUnderline  = note3.find('.post-underline');
//
//  var noteDivSelector = note3.('.highlighted');
//
//  /**
//   *
//   * @param textObject {object}
//   * @param showMoreNotes {boolean}: whether to show a partial next note.
//   * @param showPreviousNote {boolean}: whether to show a partial  previous note.
//   *
//   */
//  self.showNote = function(textObject, showMoreNotes, showPreviousNote) {
//    submitBinding = KeyBinding.keypress(KeyCode.enter, $(document), submitNote);
//    updateNoteText(textObject);
//    ViewUtil.fadeIn(noteDiv);
//    setTimeout(function(){ underlineDiv.focus();}, 450);
//  }
//
//  function submitNote() {
//    var missingWord = underlineDiv.val();
//    noteCardController.submitNote(missingWord);
//  }
//
//  self.hideDisplay = function() {
//    submitBinding.unbind();
//    noteDiv.ghi
//  }
//
//  function updateNoteText(text) {
//    underline.val("");
//    underline.attr("size", text.missingWord.length - 1);
//
//    postUnderline.html(text.postfix);
//    preUnderline.html(text.prefix)
//  }
//}
//
