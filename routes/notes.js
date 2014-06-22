var fakeNote = {
    highlight: "Europe's most interesting new king",
    id: "442223402",
    hint: "he is interesting because of his affiliation with the church",
    pageUrl: "https://s3.amazonaws.com/TrailsSitesProto/40/411/stackoverflow_.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps/0",
    "ef": "4.3",
    nextShow: "171788282",
    firstShow: "112123123"
}

exports.new = function(req, res) {
    var resp;
    var filter = req.query.filter;

    if (filter == "all") {
        resp = {
            notes: [
                fakeNote,
                fakeNote,
                fakeNote
            ]
        };
    } else {
        resp = {
            notes: [
                fakeNote
            ]
        };
    }

    res.send(resp, 200)
}
