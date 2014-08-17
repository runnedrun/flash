//  NoteManager
// 
//  Object that keeps track of note information and disseminates it.

//  Responsibilities:
//    Get notes from API
//    Send updates to API when notes change
//
//    Disseminate note information/updates to UI elements, via events


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


  self.init = function(){
    self.advanceState();
  }
  self.notes = {};  // Today's notes
  self.order = [];  // Notes in order (random)
  self.progress = 0;
  self.failedNotes = [];  // To be randomized and reviewed at end of session
  self.currentNote = {};  
  self.states = [{"state" : "login"},
    {"state":"message", "data" : {"message" : "I've got to remember..."}},
    {"state" : "note"}];

  //  Advance the state
  self.advanceState = function(){
    var nextState = self.states.shift();
    $(document).trigger($.extend({'type' : 'state.' + nextState.state}, nextState.data));

  }

  self.handleResult = function(q){
    var id = self.currentNote.id;
    API.sendResult(id, q);
    if (q<1){
      self.failedNotes.push(id);
    }
    $(document).trigger($.extend({'type' : 'notes.progress'}, {'q' : q, "index" : self.progress})); // Why extend here?
    return // ? necessary
  }



  self.getNotes = function(){
  	API.getNotes(function(data){
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
    if (!self.order.length){
      if (self.failedNotes.length){
        self.states.push( {"state" : "message", "data" : {"message" : "Something's still missing..."}})
      }
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

  self.finish = function(){
    $("#tunnel_vision").fadeOut(2000);
    $("#background_lost").fadeOut(2000);
    $("#background_found").fadeIn(2000);
  }

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