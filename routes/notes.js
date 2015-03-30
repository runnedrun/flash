var db = require('../models')
var _ = require('lodash');

var fakeNote = {
    highlight: "Europe's most interesting new king came into power in the late 18th century. But alas multi line note is real.",
    id: "442223402",
    hint: "he is interesting because of his affiliation with the church",
    pageUrl: "https://s3.amazonaws.com/TrailsSitesProto/40/411/stackoverflow_.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps/0",
    numberShows: 0,
    nextShow: "171788282",
    lastShow: "112123123"
}
var fakeNote2 = {
    highlight: "Europe's most interesting new queen was a fine old lady",
    id: "442223403",
    hint: "she is interesting because of her affiliation with the king",
    pageUrl: "https://s3.amazonaws.com/TrailsSitesProto/40/411/stackoverflow_.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps/0",
    EF: 2.5,
    numberShows: 2,
    nextShow: "171788282",
    lastShow: "112123123"
}

exports.index = function(req, res) {
    var resp ;
    var limit = req.query.limit;

    var fakeNotes = [
        fakeNote,
        fakeNote2
    ];

    db.Note.findAll({where: {UserId: req.user.id, nextShow: {lte: new Date()}}, limit: limit, order: ['createdAt']}).then(function(notes) {
        res.send({notes: notes.concat(fakeNotes)}, 200);
//        res.send({notes: notes}, 200);
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

// This function takes a note and it's grade (q), and determines the
// next show date.
// The algorithm is based on http://www.supermemo.com/english/ol/sm2.htm
// Step 7 of the algorithm is implemented client-side.
// The initial pass for note.nextShow should be implemented at instantiation.
exports.solve = function(req, res) {
    console.log("body is ", req.body);
    db.Note.find({where: {id: req.body.id}})
    .then(function(note) {
        if (!note) {
            res.send(404);
            return;
        }

        var data = note.dataValues
        var q = req.body.q;

        data.EF = data.EF == null ? 2.5 : data.EF;
        data.EF = data.EF - 0.8 + 0.28*q - 0.02*Math.pow(q, 2);
        data.EF = data.EF < 1.3 ? 1.3 : data.EF;

        data.numberShows = data.numberShows || 0;
        data.numberShows++;
        data.numberShows = q < 3 ?  0 : data.numberShows;

        // Interval represents days between now and note.nextShow
        switch( data.numberShows ){
            case 0:
                data.interval = 1;
                break;
            case 1:
                data.interval = 6;
                break;
            default:
                data.interval = Math.round(data.interval * data.EF);
        }
        data.lastShow = new Date();
        data.nextShow = new Date().setDate(data.lastShow.getDate() + data.interval);
        return note.updateAttributes(data);
    })
    .then(function(note) {
        res.send(200);
    })
}
