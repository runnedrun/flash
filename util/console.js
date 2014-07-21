#!/usr/local/bin/node

var repl = require("repl");
var context = repl.start("$ ").context;

// Configure what’s available in the REPL
context.util        = require("util");
context.express     = require('express')
context.user        = require('../routes/user')
context.notes       = require('../routes/notes')
context.flash       = require('../routes/flash')
context.http        = require('http')
context.path        = require('path')
context.RedisStore  = require('connect-redis')(context.express)
context.db          = require('../models');
context.note        = {}
context.user        = {}

context.getNote = function(id) {
    context.db.Note.find({where: {id: id}, include: [ context.db.User ]}).then(function(note) { context.note = note; })
}

context.getUser = function(id) {
    context.db.User.find({where: {id: id}, include: [ context.db.Note ]}).then(function(user) { context.user = user; })
}