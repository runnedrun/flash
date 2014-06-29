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
  mascot = Mascot();
  result = Result();
  noteinfo = NoteInfo();

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

  self.state = "welcome";

  $(document).on('keypress', function(e){
    var code = e.keyCode || e.which;
    var newState = "";
    if(code == 13) {        // 13 = Enter key
      if (self.state == "welcome"){
        newState = "note"; 
      }
      else if (self.state == "note"){
        newState = "result";
      }
      else if(self.state == "result"){
        if (order.length){
          self.nextNote();
          newState = "note";
        }
        else{
          newState = "finished";
        }
      }
    self.state = newState;
    $(document).trigger({'type' : 'notes.' + newState})
    }
  });

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
    var noteID = order.pop();
    self.updateCurrentNote(noteID);
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