// Scorecard
//
// Keep track of how we're doing



function Scorecard(){
  var self = this;

  var currentNote = {};
  var scorecardDiv = $("#scorecard");
  var scoreElement = '<a href="#" class="score glyphicon glyphicon-leaf gray"></a>';
  self.scores = [];

  self.init = function(total_notes){
  	for (var i=0; i<total_notes; i++){
  	  var score = $(scoreElement);
  	  self.scores.push(score);
  	  scorecardDiv.append(score);
  	}

  }

  // Register for Events
  $(document).on('notes.result', function(e){
  	var newClass = e.q ? "green" : "red"
    self.scores[e.index].addClass(newClass);
    if (e.q == 0){
    	var score = $(scoreElement);
    	self.scores.push(score);
    	scorecardDiv.append(score);
    }
    var ellipsis = currentNote.highlight.length > 15 ? "..." : ""
    self.scores[e.index].attr('title', currentNote.highlight.substring(0,15) + ellipsis);
  });
  $(document).on('notes.received', function(e){
    var total_notes = e.notes.length;
    self.init(total_notes);
  });
  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
  });

}