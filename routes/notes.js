var db = require('../models')

var fakeNote = {
    highlight: "Europe's most interesting new king came into power in the late 18th century",
    id: "442223402",
    hint: "he is interesting because of his affiliation with the church",
    pageUrl: "https://s3.amazonaws.com/TrailsSitesProto/40/411/stackoverflow_.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps/0",
    "ef": "4.3",
    nextShow: "171788282",
    firstShow: "112123123"
}
var fakeNote2 = {
    highlight: "Europe's most interesting new queen was a fine old lady",
    id: "442223403",
    hint: "she is interesting because of her affiliation with the king",
    pageUrl: "https://s3.amazonaws.com/TrailsSitesProto/40/411/stackoverflow_.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps/0",
    "ef": "4.3",
    nextShow: "171788282",
    firstShow: "112123123"
}

exports.new = function(req, res) {
    var resp;
//    var filter = req.query.filter;
//
//    if (filter == "all") {
//        resp = {
//            notes: [
//                fakeNote,
//                fakeNote2,
//                fakeNote,
//                fakeNote2
//            ]
//        };
//    } else {
//        resp = {
//            notes: [
//                fakeNote,
//                fakeNote2
//            ]
//        };
//    }

    res.send(resp, 200)
}
