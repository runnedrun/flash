//  NoteCard
//
//  Object that keeps track of the current note in the UI,
//  and what the user has done to it.

//  Responsibilities:
//    Send notecard to notecard view
//    Fire events upon user interaction with the notecard view


/*
TODO
Format hint/links better
check success
MVP done
refactor

then:
add sidebar with all notes
notes are editable  
prettify ui
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
  $(document).on('notes.note', function(){
    noteDiv.show();
  })
  $(document).on('notes.result', function(){
    noteDiv.hide();
  })
  $(document).on('notes.welcome', function(){
    noteDiv.hide();
  })
  $(document).on('notes.finished', function(){
    noteDiv.hide();
  });
  $(document).on('notes.new_current_note', function(e){
    currentNote = e.note;
    self.updateHighlight(e.note.highlight);
  });

  self.updateHighlight = function(text){
    if (text){
      text = removeWord(text);
      missing_word = text[1]
  	  preUnderlineDiv.html(text[0]);
      underlineDiv.val("");
      underlineDiv.attr("size", text[1].length )
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

String.prototype.repeat = function(times){
    var result="";
    var pattern=this;
    while (times > 0) {
        if (times&1)
            result+=pattern;
        times>>=1;
        pattern+=pattern;
    }
    return result;
};