/*
 This controller keeps state for the challenge view. It tracks the missing
 word, then evaluates a score based on the result submitted. The generateChallenge method
 returns a challenge object, which contains a postfix, prefix and missing work property. This is used by the view
 to render the challenge.

 When the user answers the challenge in the view their answer is passed back to this controller
 The correctness of the answer is evaluated by comparing the missing word to the submitted word.
 Upon evaluating a result the controller calls the submitNoteScore callback it is passed at initialization, with
 the note whose challenge was solved.
 */

ChallengeController = function(challenge, submitNoteScore, noLongerDisplayed) {
  var missingWord;
  var self = this;

  self.submitNote = function(word){
    var q = evaluate(word);
    submitNoteScore(challenge, q);
  };

  self.generateChallenge = function() {
    var challengeText = (challenge && challenge.text) || "";
    var challengePrompt = removeWord(challengeText);

    return challengePrompt;
  };

  self.noLongerDisplayed = function() {
    noLongerDisplayed(challenge)
  }

  self.hint = challenge.hint;

  function evaluate(answer){
    var punctuation = new RegExp('[\.,-\/#!$%\^&\*;:{}=\-_`~()]', 'g');
    var cleanedAnswer = answer.replace(punctuation, "").toLowerCase();
    var cleanedWord = missingWord.replace(punctuation, "").toLowerCase();
    return cleanedAnswer == cleanedWord ? 5 : 0;
  }

  var easyWords = ["the", "of", "a", "in"]
  function removeWord(text, depth, easyIndices){
    //  Remove a random word from text, using easy_words only as a last resort
    depth = depth || 0
    easyIndices = easyIndices || []
    var words = text.split(" ");
    var missingWordIndex = Math.floor(Math.random() * words.length);
    var wordToRemove = words[missingWordIndex];
    if (easyWords.indexOf(wordToRemove) == -1 || depth >= words.length){
      var preUnderline = words.slice(0, missingWordIndex).join(" ");
      var postUnderline = words.slice(missingWordIndex + 1).join(" ");
      missingWord = wordToRemove;
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
