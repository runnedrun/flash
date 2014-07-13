// Login

// Handles user login input


function Login(){
  var loginDiv = $("#login");
  var inputDiv = $("#login_input");
  loginDiv.hide();

  // Register for Events
  $(document).on('notes.login', function(){
    $(document).on('keypress', function(e){
      var code = e.keyCode || e.which;
      if(code == 13) {        // 13 = Enter key
        $(document).off('keypress');
        var username = inputDiv.html();
        notemanager.logInUser(username);
        notemanager.advanceState();
        fadeOut(loginDiv);
      }
    });

    fadeIn(loginDiv);
    setTimeout(function(){inputDiv.focus();}, 450);
  })
}



