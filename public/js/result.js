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
  $(document).on('notes.note', function(){
    resultDiv.hide();
  })
  $(document).on('notes.result', function(e){
  	var q = e.q > 0 ? "Nice!" : "Oops";
  	resultDiv.html(q);
    resultDiv.show();
  })
  $(document).on('notes.welcome', function(){
    resultDiv.hide();
  })
  $(document).on('notes.finished', function(){
    resultDiv.hide();
  });
  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
  });

  self.init();
}