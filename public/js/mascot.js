// Mascot
//
// Object that keeps track of messages from Stephen

function Mascot(){
	mascotDiv = $("#mascot");
	messageDiv = $("#message");

  // Register for Events
  $(document).on('notes.note', function(){
    mascotDiv.hide();
  })
  $(document).on('notes.result', function(){
    mascotDiv.hide();
  })
  $(document).on('notes.welcome', function(){
    mascotDiv.show();
  })
  $(document).on('notes.finished', function(){
  	messageDiv.html('Congrats! How did you do? I have no idea!')
    mascotDiv.show();
  });
}