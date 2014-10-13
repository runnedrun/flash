exports.index = function(req, res) {
  console.log("hehehe")
  res.render('index');
}

exports.demo = function(req, res) {
    res.render('demo');
}