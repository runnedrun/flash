//  NoteCard
//
//  Object that keeps track of the current note in the UI,
//  and what the user has done to it.

//  Responsibilities:
//    Send notecard to notecard view
//    Fire events upon user interaction with the notecard view


/*
TODO
add sidebar with all notes
notes are searchable/ditable inline 
prettify ui
q is evaluated more than boolean, maybe
maybe: resultdiv just replaces input with the word in red/green, pre and post just stay there.
(strikethrough, with correct answer above it? That's hard, but maybe cooler than the wrong answer disappearingn)
*/

function Notecard(){
  var self = this;

  self.init = function(){
    noteDiv.hide();
  }

  var currentNote = {};
  var missing_word = null;

  // dynamic content
  var preUnderlineDiv = $('#pre_underline');
  var underlineDiv = $('#underline');
  var postUnderlineDiv = $('#post_underline');

  var noteDiv = $('#highlighted');

  // Register for Events
  $(document).on('state.note', function(){
    setTimeout(function(){
      self.activate();
    }, 820);

    fadeIn(noteDiv);
    setTimeout(function(){underlineDiv.focus();}, 450);
  })

  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
    self.updateHighlight(e.note.highlight);
  });

  self.activate = function(){
      $(document).on('keypress', function(e){
        var code = e.keyCode || e.which;
        if(code == 13) {        // 13 = Enter key
          $(document).off('keypress');
          notecard.progress++;
          var q = self.evaluate();
          notemanager.handleResult(q);
          notemanager.states.push({"state" : "result", "data" : {"q":q}});
          notemanager.advanceState();
          fadeOut(noteDiv);
        }
      });
  }

  self.updateHighlight = function(text){
    if (text){
      text = removeWord(text);
      missing_word = text[1]
  	  preUnderlineDiv.html(text[0]);
      underlineDiv.val("");
      underlineDiv.attr("size", text[1].length - 1)
      postUnderlineDiv.html(text[2]);
    }
  }

  self.evaluate = function(){
    // TODO expand q range
    return underlineDiv.val().toLowerCase() == missing_word.toLowerCase() ? 1 : 0;
  }

  self.init();
}

var easy_words = ["the", "of", "a", "in"]
removeWord = function(text, depth, easy_indices){
  //  Remove a random word from text, using easy_words only as a last resort
  //  TODO: refactor
  depth = depth || 0
  easy_indices = easy_indices || []
  var words = text.split(" ");
  var underlined_index = Math.floor(Math.random() * words.length);
  var underlined_word = words[underlined_index];
  if (easy_words.indexOf(underlined_word) == -1 || depth >= words.length){
    var pre_underline = words.slice(0, underlined_index).join(" ");
    var underline = words[underlined_index];
    var post_underline = words.slice(underlined_index + 1).join(" ");
    return [pre_underline, underline, post_underline];
  }
  else{
    if (easy_indices.indexOf(underlined_index) == -1){
      depth++;
      easy_indices.push(underlined_index);
    }
    return removeWord(text, depth, easy_indices);
  }
}