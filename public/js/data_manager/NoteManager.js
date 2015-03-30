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
    }
  };

  function formatNoteFields(note) {
    note.id = Number(note.id)
    return note
  }

  function createNotesAndFireEvents(notes, filter) {
    console.log("creating notes!", notes);
    var events = $.map(notes, function(note, i) {
      var newNote = new Note(note);
      var eventData = { note: formatNoteFields(newNote), filter: filter };
      Fire.event("note.new", eventData);
      return eventData;
    });

    return { "note.new": events };
  }

  function updateNote(data) {
    console.log("updating note");
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
}();
