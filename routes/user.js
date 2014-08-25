var db = require('../models')

exports.signInPage = function(req, res) {
    res.render("user/sign_in")
}

exports.signInAction = function(req, res) {
    var usernameToSignIn = req.body.username;
    
    db.User.find({where: {username: usernameToSignIn}}).then(function(user) {
        if (user) {
            console.log("signing in user: " + usernameToSignIn);
            req.session.username = usernameToSignIn;
            res.json( {success : true} );
        } else {
            res.json({err: "user: " + String(usernameToSignIn) + " not found"}, 403);
        }
    })

}

exports.signUpAction = function(req, res) {
    var usernameToSignUp = req.body.username;
    db.User.find({where: {username: usernameToSignUp}}).then(function(user) {
        if(user) {
            res.redirect("/user/sign_in?error=username%20already%20taken")
        } else {
            console.log("signing up user: " + usernameToSignUp);
            db.User.create({username: usernameToSignUp}).then(function(user) {
                req.session.username = usernameToSignUp;
                res.redirect("/user")                           
            }).error(function(){
                res.render(500)                           
            })
        }
    })

    
}

exports.show = function(req, res) {
    var userToShow = req.user
    console.log("user is", req.user);
    res.render("user/show", {user: userToShow});
}