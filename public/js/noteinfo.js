//  NoteInfo
//
//  Details about the note


function NoteInfo(){

  self.init = function(){
  	noteInfoDiv.hide();
  }

  var hintDiv = $('#hint');
  var linkDiv = $('#note_link')
  var noteInfoDiv = $('#note_info');
  var currentNote = {}

  // Register for Events
  $(document).on('notes.note', function(){
  	self.hideHint();
    noteInfoDiv.show();
  })
  $(document).on('notes.result', function(){
    noteInfoDiv.show();
    self.showHint();
  })
  $(document).on('notes.welcome', function(){
    noteInfoDiv.hide();
  })
  $(document).on('notes.finished', function(){
    noteInfoDiv.hide();
  });
  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
    updateHint(e.note.hint);
    updateLink(e.note.pageUrl);
  });

  $("#hint").on('click', function(e){
    showHint();
  });

  self.hideHint = function(){
    updateHint("");
    hintDiv.addClass("glyphicon");
    hintDiv.addClass("glyphicon-question-sign");
  }
  self.showHint = function(){
    hintDiv.removeClass("glyphicon");
    hintDiv.removeClass("glyphicon-question-sign");
    updateHint(currentNote.hint);
  }
  self.updateLink = function(url){
    linkDiv.attr("href", url);
  }
  self.updateHint = function(text){
    hintDiv.html(text);
  }

  self.init();
}
