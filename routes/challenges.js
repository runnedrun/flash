var db = require('../models')
var _ = require('lodash');

var fakeChallenge1 = {
  text: "Europe's most interesting new king came into power in the late 18th century. But alas multi line note is real.",
  id: "442223402",
  hint: "he is interesting because of his affiliation with the church",
  pageUrl: "https://s3.amazonaws.com/TrailsSitesProto/40/411/stackoverflow_.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps/0",
  numberShows: 0,
  nextShow: "171788282",
  lastShow: "112123123"
}
var fakeChallenge2 = {
  text: "Europe's most interesting new queen was a fine old lady",
  id: "442223403",
  hint: "she is interesting because of her affiliation with the king",
  pageUrl: "https://s3.amazonaws.com/TrailsSitesProto/40/411/stackoverflow_.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps/0",
  EF: 2.5,
  numberShows: 2,
  nextShow: "171788282",
  lastShow: "112123123"
}

function ChallengeMissingException() {}

exports.index = function(req, res) {
  var limit = req.query.limit || 20;

  var fakeChallenges = [
    fakeChallenge1,
    fakeChallenge2
  ];


  db.Challenge.findAll({where: {UserId: req.user.id, deleted: false, nextShow: {lte: new Date()}}, limit: limit, order: ['createdAt']}).then(function(challenges) {
//    res.send({notes: fakeChallenges}, 200);
    console.log(challenges);
    res.send({challenges: challenges.concat(fakeChallenges)}, 200);
//      res.send({notes: notes}, 200);
  })
}

exports.new = function(req, res) {
  var d = new Date();
  var currentTime = d.getTime();
  db.Challenge.create(_.extend(req.body.challenge, { nextShow: currentTime, UserId: req.user.id })).then(function(challenge) {
    res.send({ challenge: challenge, id: challenge.id }, 200)
  })
}

exports.delete = function(req, res) {
  db.Challenge.find({where: {id: req.body.id}})
    .then(function(challenge) {
      if(challenge) {
        return challenge.updateAttributes({deleted: true})
      } else {
        res.send(404)
        throw ChallengeMissingException
      }
    })
    .then(function(challenge) {
      res.send(200)
    })
}

// This function takes a challenge and it's grade (q), and determines the
// next show date.
// The algorithm is based on http://www.supermemo.com/english/ol/sm2.htm
// Step 7 of the algorithm is implemented client-side.
// The initial pass for challenge.nextShow should be implemented at instantiation.
exports.solve = function(req, res) {
  console.log("body is ", req.body);
  db.Challenge.find({where: {id: req.body.id}})
    .then(function(challenge) {
      if (!challenge) {
        res.send(404);
        throw ChallengeMissingException()
      }

      var data = challenge.dataValues
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
      return challenge.updateAttributes(data);
    })
    .then(function(challenge) {
      res.send(200);
    })
}
