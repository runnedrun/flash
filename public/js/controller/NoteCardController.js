// this controller will keep state for the note card. It will track what the missing
// word is, then evaluate q based on the result submitted.

NoteCardController = function() {
  var missingWord;
  var currentNote;

  function submitNote(e) {
    var q = evaluate(e.word);
    Fire.command("controller.challenge.complete", { note: currentNote, q: q });
  }

  function createNewNotecard(e) {
    var note = e.note;
    currentNote = note;
    var textToShow = removeWord(note.highlight);
    Fire.command("view.learn.note.show", {text: textToShow});
  }

  Respond.toRequest("missing.word.submit", submitNote);
  Respond.toCommand("controller.notecard.new");

  function evaluate(answer){
    // TODO expand q range
    return answer.toLowerCase() == missingWord.toLowerCase() ? 1 : 0;
  }


  var easyWords = ["the", "of", "a", "in"]
  removeWord = function(text, depth, easyIndices){
    //  Remove a random word from text, using easy_words only as a last resort
    //  TODO: refactor
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