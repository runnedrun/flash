//  NoteInfo
//
//  Details about the note


function NoteInfo(){

  self.init = function(){
  	noteInfoDiv.hide();
    hintDiv.hide();
  }

  var hintIcon = $("#hint_icon");
  var hintDiv = $('#hint');
  var linkDiv = $('#note_link')
  var noteInfoDiv = $('#note_info');
  var currentNote = {}

  // Register for Events
  $(document).on('notes.note', function(){
    fadeIn(noteInfoDiv);
  	self.hideHint();
  })
  $(document).on('notes.result', function(){
    fadeIn(noteInfoDiv);
    self.showHint();
  })
  $(document).on('notes.finished', function(){
    fadeOut(noteInfoDiv);
  })
  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
    updateHint(e.note.hint);
    updateLink(e.note.pageUrl);
  });

  hintIcon.on('click', function(e){
    showHint();
  });

  self.hideHint = function(){
    fadeIn(hintIcon);
    fadeOut(hintDiv);
  }
  self.showHint = function(){
    fadeIn(hintDiv);
    fadeOut(hintIcon);
    updateHint(currentNote.hint);
  }
  self.updateLink = function(url){
    linkDiv.attr("href", url);
  }
  self.updateHint = function(text){
    setTimeout( function(){hintDiv.html(text);}, 450);
  }

  self.init();
}
