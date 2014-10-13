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
        { filter: 'today' },
        function(data) {
          callback(data)
        }
      );
    },

    solveNote: function(note, q, callback) {
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
    console.log("creating notes!", notes);
    var events = $.map(notes, function(note, i) {
      var newNote = new Note(note);
      var eventData = { note: newNote, filter: self.Filter.today };
      Fire.event("note.new", eventData);
      return eventData;
    });

    return { "note.new": events };
  }

  function updateNote(data) {
    console.log("updating note");
    Fire.event("note.updated", data.note);
  }

  this.getTodaysNotes = function() {
    var deferred = $.Deferred();
    API.getNotes(function(resp) {
      var events = createNotesAndFireEvents(resp.notes);
      deferred.resolve(events);
    });
    return deferred.promise();
  }

  this.solveNote = function(note, q) {
    API.solveNote(note, q, updateNote);
  }
}();
