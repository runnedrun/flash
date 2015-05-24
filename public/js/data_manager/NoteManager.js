// managers take requests directly, not through events, then they create models and fire events
// for that. They return all the events they fired through a promise to the caller. This
// allows the caller to ensure proper state before continuing (prevents race conditions).

NoteManager = new function() {
  var self = this;

  this.Filter = {
    today: 1,
    all: 0
  }

  var API = {
    getNotes: function(callback) {
      return $.get(
        '/notes',
        function(data) {
          callback(data)
        }
      );
    },

    createNote: function(content, callback) {
      return $.post(
        '/note',
        { note: {
            text: content
          }
        },
        function(data) {
          callback(data)
        }
      );
    },

    updateNote: function(content, id, callback) {
      return $.post(
        '/note/update',
        {
          text: content,
          id: id
        },
        function(data) {
          callback(data)
        }
      );
    },

    deleteNote: function(id, callback) {
      return $.post(
        '/note/delete',
        {
          id: id
        },
        function(data) {
          callback(data)
        }
      );
    },

    // challenge calls

    createChallenge: function(content, hint, callback) {
      return $.post(
        '/challenge',
        { challenge: {
          challenge: content,
          hint: hint
        }
        },
        function(data) {
          callback(data)
        }
      );
    },

    getChallenges: function(callback) {
      return $.get(
        '/challenges',
        function(data) {
          callback(data)
        }
      );
    },

    deleteChallenge: function(id, callback) {
      return $.post(
        '/challenge/delete',
        {
          id: id
        },
        function(data) {
          callback(data)
        }
      );
    },


    solveChallenge: function(note, q, callback) {
      return $.post(
        '/note/solve',
        {
          q: q,
          id: note.id
        },
        function(data) {
          callback(data)
        }
      );
    }

  };


  function createNotesAndFireEvents(notes) {
    var events = $.map(notes, function(note, i) {
      var newNote = new Note(note);
      var eventData = { note: newNote };
      Fire.event("note.new", eventData);
      return eventData;
    });

    return { "note.new": events };
  }

  function createChallengesAndFireEvents(challenges) {
    var events = $.map(challenges, function(challenge) {
      var newChallenge = new Challenge(challenge);
      var eventData = { challenge: newChallenge };
      Fire.event("challenge.new", eventData);
      return eventData;
    });

    return { "challenge.new": events };
  }

  this.createNote = function(content, hint) {
    var createDeferred = $.Deferred();
    API.createNote(content, function(resp) {
      createNotesAndFireEvents([resp.note]);
      createDeferred.resolve(resp.note);
    });

    return createDeferred.promise()
  }

  this.updateNote = function(content, noteId) {
    var updateDeferred = $.Deferred();
    API.updateNote(content, noteId, function(resp) {
      createNotesAndFireEvents([resp.note]);
      updateDeferred.resolve(resp.note);
    })

    return updateDeferred.promise();
  }

  this.deleteNote = function(noteId) {
    var deferred = $.Deferred();
    API.deleteNote(noteId, function(resp) {
      Fire.event("note.delete", {note: {id: noteId}});
      deferred.resolve();
    })

    return deferred.promise();
  }

  this.getNotes = function() {
    var deferred = $.Deferred();
    API.getNotes(function(resp) {
      var events = createNotesAndFireEvents(resp.notes);
      deferred.resolve(events);
    });

    return deferred.promise();
  }

  this.solveChallenge = function(note, q) {
    API.solveChallenge(note, q);
  }

  this.createChallenge = function(content, hint) {
    var createChallenge = $.Deferred();
    API.createChallenge(content, hint, function(resp) {
      createChallengesAndFireEvents([resp.challenge]);
      createChallenge.resolve(resp.challenge);
    });

    return createChallenge.promise()
  }

  this.deleteChallenge = function(noteId) {
    var deferred = $.Deferred();
    API.deleteChallenge(noteId, function(resp) {
      Fire.event("challenge.delete", {challenge: {id: noteId}});
      deferred.resolve();
    })

    return deferred.promise();
  }

  this.getChallenges = function() {
    var deferred = $.Deferred();
    API.getChallenges(function(resp) {
      var events = createChallengesAndFireEvents(resp.challenges);
      deferred.resolve(events);
    });

    return deferred.promise();
  }
}();
