var db = require('../models')
var _ = require('lodash/dist/lodash.underscore');

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

exports.index = function(req, res) {
    var resp ;
    var limit = req.query.limit;

    var fakeNotes = [
        fakeNote,
        fakeNote2
    ];

    db.Note.findAll({where: {UserId: req.user.id}, limit: limit, order: ['createdAt']}).then(function(notes) {
        res.send({notes: notes.concat(fakeNotes)}, 200);
    })
}

exports.new = function(req, res) {
    console.log("body is ", req.body)
    var d = new Date();
    var currentTime = d.getTime();
    db.Note.create(_.extend(req.body.note, { nextShow: currentTime, UserId: req.user.id })).then(function(note) {
        res.send({ id: note.id }, 200)
    })
}

exports.updateEasiness = function(req, res) {
  console.log("updating easiness to: " + req.body.q)
}

exports.update = function(req, res) {
    console.log("body is ", req.body);
    db.Note.find({where: {id: req.body.id}})
    .then(function(note) {
        if(note) {
            return note.updateAttributes(req.body)
        } else {
            res.send(404)
        }
    })
    .then(function(note) {
        res.send(200)
    })
}

exports.delete = function(req, res) {
    console.log("body is ", req.body);
    db.Note.find({where: {id: req.body.id}})
    .then(function(note) {
        if(note) {
            return note.destroy()
        } else {
            res.send(404)
        }
    })
    .then(function(note) {
        res.send(200)
    })
}
