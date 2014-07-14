// Result
//
// Object that shows immediate feedback on a notecard


function Result(){
  var self = this;
  var current_note = {};
  resultDiv = $("#result");

  self.init = function(){
    resultDiv.hide();
  }

  // Register for Events
  $(document).on('state.result', function(e){
    setTimeout( self.activate, 820 );
    if (e.q > 0){
      var result = "Nice!"
    }
    else{
      var result = "Oops. Correct answer: " + notemanager.currentNote.highlight;
    }
    resultDiv.html(result);
    fadeIn(resultDiv)
  })
  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
  });

  self.activate = function(){
    $(document).on('keypress', function(e){
        var code = e.keyCode || e.which;
        if(code == 13) {        // 13 = Enter key
          $(document).off('keypress');
          var nextState = notemanager.nextNote()? "note" : "finished";
          notemanager.states.push({"state":nextState});
          notemanager.advanceState();
          fadeOut(resultDiv);
        }
      });
  }

  self.init();
}