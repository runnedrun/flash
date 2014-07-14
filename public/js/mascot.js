// Mascot
//
// Object that keeps track of messages from Stephen

function Mascot(){
	var mascotDiv = $("#mascot");
	var messageDiv = $("#message");
	var stephenDiv = $("#stephen");

  // Register for Events
  $(document).on('state.message', function(e){
    self.updateMessage(e.message);
    fadeIn(mascotDiv);
    setTimeout(function(){
      notemanager.advanceState();
      fadeOut(mascotDiv);
    }, 2400);
  })

  $(document).on('state.finished', function(){
    $(document).on('keypress', function(e){
      var code = e.keyCode || e.which;
      if(code == 13) {        // 13 = Enter key
        $(document).off('keypress');
        notemanager.advanceState();
        fadeOut(mascotDiv);
      }
    });

    notemanager.finish();
    fadeIn(mascotDiv);

  	self.updateMessage("Hola! You're back!")
  	stephenDiv.addClass("flipped");
    fadeIn(mascotDiv);
  });

  self.updateMessage = function(new_message){
    messageDiv.fadeOut(500, function() {
      $(this).text(new_message)
    }).fadeIn(500);
  }
}
