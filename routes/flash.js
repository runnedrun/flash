exports.index = function(req, res) {
    res.render('index', function(err, html) {
    	console.log(html);
    	console.log(err);
    	res.send(html);
    })
}