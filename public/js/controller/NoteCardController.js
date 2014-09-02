// this controller will keep state for the note card. It will track what the missing
// word is, then evaluate q based on the result submitted.

NoteCardController = function() {
  var missingWord;
  var currentNote;

  function createNewNotecard(e) {
    var note = e.note;
    currentNote = note;
    var textToShow = removeWord(note.highlight);

    // text to show: { prefix: , missingWord: , postfix: }
    Fire.command("view.note-card.show", {textObject: textToShow});
  }

  function submitNote(e) {
    var q = evaluate(e.word);

    NoteManager.submitEasiness(q, currentNote);
    Fire.command("view.note-card.hide");
    Fire.command("controller.result.show", {
      result: q,
      note: currentNote
    });
  }

  Respond.toCommand("controller.notecard.new", createNewNotecard);
  Respond.toRequest("missing-word.submit", submitNote);

  function evaluate(answer){
    return answer.toLowerCase() == missingWord.toLowerCase() ? 1 : 0;
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