// Login

// Handles user login input


function Login(){
  var loginDiv = $("#login");
  var inputDiv = $("#login_input");
  loginDiv.hide();

  // Register for Events
  $(document).on('state.login', function(){
    $(document).on('keypress', function(e){
      var code = e.keyCode || e.which;
      if(code == 13) {        // 13 = Enter key
        $(document).off('keypress');
        var user = "Drew"; //inputDiv.html();
        $.ajax({
            beforeSend: function(req) {
                req.setRequestHeader("Accept", "application/json");
            },
            data: { username : user },
            type: 'post',
            url: '/user/sign_in',
            success : function(data){
              console.log(data);
            }
        });

        notemanager.logInUser(user);
        notemanager.advanceState();
        fadeOut(loginDiv);
      }
    });

    fadeIn(loginDiv);
    setTimeout(function(){inputDiv.focus();}, 450);
  })
}

