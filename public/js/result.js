// Result
//
// Object that shows immediate feedback on a notecard


function Result(notecard){
  var self = this;
  var current_note = {};
  resultDiv = $("#result");

  self.init = function(){
    resultDiv.hide();
  }

  // Register for Events
  $(document).on('notes.result', function(e){
    $(document).on('keypress', function(e){
      var code = e.keyCode || e.which;
      if(code == 13) {        // 13 = Enter key
        $(document).off('keypress');
        notemanager.advanceState();
        fadeOut(resultDiv);
      }
    });
    if (e.q > 0){
      var result = "Nice!"
    }
    else{
      var result = "Oops. Correct answer: " + e.note.highlight;
    }
    resultDiv.html(result);
    fadeIn(resultDiv)
  })
  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
  });

  self.init();
}