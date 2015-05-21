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
    getNotes: function(filter, callback) {
      return $.get(
        '/notes',
        { filter: filter },
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
    },

    createNote: function(content, hint, callback) {
      return $.post(
        '/note',
        { note: {
            highlight: content,
            hint: hint
          }
        },
        function(data) {
          callback(data)
        }
      );
    },

    updateNote: function(content, hint, id, callback) {
      return $.post(
        '/note/update',
        {
          highlight: content,
          hint: hint,
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
    }
  };

  function formatNoteFields(note) {
    note.id = Number(note.id)
    return note
  }

  function createNotesAndFireEvents(notes, filter) {
    var events = $.map(notes, function(note, i) {
      var newNote = new Note(note);
      var eventData = { note: formatNoteFields(newNote), filter: filter };
      Fire.event("note.new", eventData);
      return eventData;
    });

    return { "note.new": events };
  }

  this.updateNote = function(content, hint, noteId) {
    var updateDeferred = $.Deferred();
    API.updateNote(content, hint, noteId, function(resp) {
      createNotesAndFireEvents([resp.note], self.Filter.all);
      updateDeferred.resolve(resp.note);
    })

    return updateDeferred.promise();
  }

  this.deleteNote = function(noteId) {
    var updateDeferred = $.Deferred();
    API.deleteNote(noteId, function(resp) {
      Fire.event("note.delete", {note: {id: noteId}});
      updateDeferred.resolve();
    })

    return updateDeferred.promise();
  }

  this.getNotes = function() {
    var todayDeferred = $.Deferred();
    var allDeferred = $.Deferred();

    API.getNotes(self.Filter.today, function(resp) {
      var events = createNotesAndFireEvents(resp.notes, self.Filter.today);
      todayDeferred.resolve(events);
    });

    API.getNotes(self.Filter.all, function(resp) {
      var events = createNotesAndFireEvents(resp.notes, self.Filter.all);
      allDeferred.resolve(events);
    });

    return $.when(todayDeferred.promise(), allDeferred.promise());
  }

  this.solveNote = function(note, q) {
    API.solveNote(note, q, updateNote);
  }

  this.createNote = function(content, hint) {
    var createDeferred = $.Deferred();
    API.createNote(content,hint, function(resp) {
      createNotesAndFireEvents([resp.note], self.Filter.all);
      createDeferred.resolve(resp.note);
    });

    return createDeferred.promise()
  }
}();
