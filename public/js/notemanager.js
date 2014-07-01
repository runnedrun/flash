//  NoteManager
// 
//  Object that keeps track of note information and disseminates it.

//  Responsibilities:
//    Get notes from API
//    Send updates to API when notes change
//
//    Disseminate note information/updates to UI elements, via events


$( function(){
  notemanager = new NoteManager;
  notecard = new Notecard();
  mascot = new Mascot();
  result = new Result(notecard);
  noteinfo = new NoteInfo();
  scorecard = new Scorecard();

  notemanager.getNotes();
})

var API = {
  getNotes : function(callback){
    $.get(
      '/notes',
      {filter : 'today'},
      function(data) {
         callback(data)
      }
    );
  },

  sendResult : function(id, q){

  },

  saveNote : function(){

  },

  refreshNote : function(id){

  },

};

function NoteManager() {
  var self = this;

  self.notes = {};  // Today's notes
  self.order = [];  // Notes in order (random)
  self.progress = 0;
  self.failedNotes = [];  // To be randomized and reviewed at end of session
  self.currentNote = {};  

  self.state = "welcome";

  //  Advance the state
  $(document).on('keypress', function(e){
    var code = e.keyCode || e.which;
    var newState = "";
    var data = {};
    if(code == 13) {        // 13 = Enter key
      if (self.state == "welcome"){
        newState = "note"; 
      }
      else if (self.state == "note"){
        newState = "result";
        q = notecard.evaluate();
        data['q'] = q;
        data['index'] = self.progress;
        self.progress++;
        self.handleResult(q);
      }
      else if(self.state == "result"){
        var next = self.nextNote();
        newState = next ? "note" : "finished";
      }
    if (newState){
      self.state = newState;
      $(document).trigger($.extend({'type' : 'notes.' + newState}, data));
    }
    }
  });

  self.handleResult = function(q){
    var id = self.currentNote.id;
    API.sendResult(id, q);
    if (q<1){
      self.failedNotes.push(id);
    }
  }

  self.getNotes = function(){
  	API.getNotes( function(data){
      for (var i=0; i<data.notes.length; i++){
        self.notes[data.notes[i].id] = new Note(data.notes[i]);
        self.order.push(data.notes[i].id);
      }
      self.order = randomize(self.order);
      $(document).trigger({'type' : 'notes.received', 'notes': data.notes});
      self.nextNote();
    })
  };

  self.updateCurrentNote = function(id){
    self.currentNote = self.notes[id];
    $(document).trigger({'type' : 'notes.new_current_note', 'note': self.currentNote});
  }

  self.nextNote = function(){
    if (self.order.length == 0){
      self.failedNotes = randomize(self.failedNotes);
      self.order = self.order.concat(self.failedNotes);
      self.failedNotes = [];
    }
    var noteID = self.order.pop();
    if (noteID){
      self.updateCurrentNote(noteID);
    }
    return noteID;
  };

};



function Note(properties){
  var self = this;
  self.id = properties.id;
  self.highlight = properties.highlight;
  self.hint = properties.hint;
  self.pageUrl = properties.pageUrl;
  self.EF = properties.EF;
  self.firstShow = properties.firstShow;
  self.nextShow = properties.nextShow;

  // The following are functions for updating data, not the DOM
  // They are likely to be used in V2, when we allow editing of notes
  self.updateHighlight = function(){};

  self.updateHint = function(){};

  self.updateEF = function(){};

  self.updateNextShow = function(q){
    /*
    // Update fields
    */

  };

  self.save = function(q){
    API.saveNote();
    // fire event
  }

  self.refresh = function(){
    API.refreshNote();
  }
}