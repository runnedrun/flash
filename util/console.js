#!/usr/local/bin/node

var repl = require("ultra-repl");
console.log(repl)
var context = repl.createREPL()
process.env.DATABASE_URL = "postgres://flash:password@localhost:5432/flash";

// Configure what’s available in the REPL
context.util        = require("util");
context.express     = require('express');
context.user        = require('../routes/user');
context.notes       = require('../routes/notes');
context.flash       = require('../routes/flash');
context.http        = require('http');
context.path        = require('path');
context.RedisStore  = require('connect-redis')(context.express);
context.Sequelize   = require('sequelize');
context.db          = require('../models');
context.note        = {};
context.user        = {};

context.getUser= function(conditions) {
    context.db.User.find({where: conditions, include: [ context.db.Note ]}).then(function(user) { context.user = user; })
}

context.getNote = function(conditions) {
    context.db.Note.find({where: conditions, include: [ context.db.User ]}).then(function(note) { context.note = note; })
}

context.getChallenge = function(conditions) {
  context.db.Challenge.find({where: conditions, include: [ context.db.User, context.db.Note ]}).then(function(note) { context.challenge = note; })
}