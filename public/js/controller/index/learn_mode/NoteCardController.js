// this controller will keep state for the note card. It will track what the missing
// word is, then evaluate q based on the result submitted.

NoteCardController = function() {
  var missingWord;
  var currentNote;
  var self = this;
  var currentIndex = 0;
  var notes = [];
  var scrollView;

  function createNewNotecard(e) {
    var firstNote = notes.length === 0;

    console.log("adding new note");

    var note = e.note;
    notes.push(note);

    if (firstNote) {
      scrollView = new LearnModeNoteScrollView(self)
    }
  }

  self.nextNoteChallenge = function () {
    var noteIndex = Util.random(0, notes.length);
    var note = notes[noteIndex];
    var highlight = (note && note.highlight) || "";
    var textToShow = removeWord(highlight);
    missingWord = textToShow.missingWord;

    return textToShow
  }

  self.submitNote = function(word){
    var q = evaluate(word);

//    Fire.command("controller.result.show", {
//      q: q,
//      note: currentNote
//    });

    // Only submit solution on the first attempt.
    if (!currentNote.attempted) {
      NoteManager.solveNote(currentNote, q);
    }
  }

  Respond.toCommand("controller.note-card.add", createNewNotecard);

  function evaluate(answer){
    var punctuation = new RegExp('[\.,-\/#!$%\^&\*;:{}=\-_`~()]', 'g');
    var cleanedAnswer = answer.replace(punctuation,"").toLowerCase();
    var cleanedWord = missingWord.replace(punctuation,"").toLowerCase();
    return cleanedAnswer == cleanedWord ? 5 : 0;
  }

  var easyWords = ["the", "of", "a", "in"]
  removeWord = function(text, depth, easyIndices){
    //  Remove a random word from text, using easy_words only as a last resort
    depth = depth || 0
    easyIndices = easyIndices || []
    var words = text.split(" ");
    var missingWordIndex = Math.floor(Math.random() * words.length);
    var wordToRemove = words[missingWordIndex];
    if (easyWords.indexOf(wordToRemove) == -1 || depth >= words.length){
      var preUnderline = words.slice(0, missingWordIndex).join(" ");
      var postUnderline = words.slice(missingWordIndex + 1).join(" ");
      return { prefix: preUnderline, missingWord: wordToRemove, postfix: postUnderline };
    }
    else{
      if (easyIndices.indexOf(missingWordIndex) == -1){
        depth++;
        easyIndices.push(missingWordIndex);
      }
      return removeWord(text, depth, easyIndices);
    }
  }
}
