var fakeUser = {
    userName: "porky",
    points: 1232
}

exports.signIn = function(req, res) {
    var resp = {
        user: fakeUser
    };
    res.send(resp, 200)
}