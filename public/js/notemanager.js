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
  notecard = Notecard();

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

  saveNote : function(){
  },

  refreshNote : function(id){

  },

};

function NoteManager() {
  var self = this;

  var notes = {};  // Today's notes
  var order = [];  // Notes in order (random)
  var failedNotes = [];  // To be randomized and reviewed at end of session
  var currentNote = {};  

  self.getNotes = function(){
  	API.getNotes( function(data){
      for (var i=0; i<data.notes.length; i++){
        notes[data.notes[i].id] = data.notes[i];
        order.push(data.notes[i].id);
      }
      order = randomize(order);
      self.nextNote();
    })
  };

  self.updateCurrentNote = function(id){
    currentNote = notes[id];
    $(document).trigger({'type' : 'notes.new_current_note', 'note': currentNote});
  }

  self.nextNote = function(){ 
    if (order.length){
      var noteID = order.pop();
      self.updateCurrentNote(noteID);
    }
    else{
      $(document).trigger({'type' : 'notes.finished'})
    }
  };


};



function Note(){

  var id;
  var highlight;
  var hint;
  var pageURL;
  var EF;
  var firstShow;
  var nextShow;

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