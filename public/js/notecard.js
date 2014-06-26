//  NoteCard
//
//  Object that keeps track of the current note in the UI,
//  and what the user has done to it.

//  Responsibilities:
//    Send notecard to notecard view
//    Fire events upon user interaction with the notecard view


function Notecard(){
  var self = this;

  var current_note = {};
  var notecardDiv = $('#highlighted');
  var hintDiv = $('#hint');
  var linkDiv = $('#note_link');

  // Register for Events
  $(document).on('notes.new_current_note', function(e){
  	current_note = e.note;
  	updateHighlight(e.note.highlight);
  	updateHint(e.note.hint);
  	updateLink(e.note.pageUrl);
  });

  $(document).on('notes.finished', function(){
    current_note = null;
    updateHighlight("DONE!");
    updateHint("");
    updateLink("");
  });

  $("#next_note").on('click', function(){
    notemanager.nextNote();
  })

  self.updateHighlight = function(text){
  	notecardDiv.html(text);
  }

  self.updateHint = function(text){
    hintDiv.html(text);
  }

  self.updateLink = function(text){
    linkDiv.html(text);
  }

}
