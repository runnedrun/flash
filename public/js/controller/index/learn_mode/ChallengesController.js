/*
  This controller manages all the note cards which are to be shown to a user. note are added to it's queue by calling
  the createNoteCard method. At initialization it creates a LearnModeNoteScrollView. This view will call back to the
  nextNoteCardController method to get a new LearnModeNoteCardController, for the next note, when it needs to display it.
  submitNoteScore is passed to the LearnModeNoteCardController as a callback. It is called when the child controller
  needs to submit a score for a note, after a use solves a challenge. The method persists the score if necessary using
  the NoteManager. When all notes have been attempted the controller calls out to the LearnModeController with its
  successful and failed notes.
 */

ChallengesController = function(refreshStatus) {
  var self = this;
  var uniqueNotes = {};
  var allFailedChallenges = {};
  var allSuccessfulChallenges = [];
  var challengesDisplayed = 0;
  var challengesAttempted = 0;
  var challenges = [];
  var attemptedChallenges = [];
  var resultsShown = false;

  self.addChallenge = function(note) {
    challenges.push(note);
    uniqueNotes[note.id] = note;
    refreshExternalStatus();
  }

  self.getResults = function() {
    return { successfulNotes: allSuccessfulChallenges, failedNotes: Util.objectValues(allFailedChallenges) };
  }

  self.getResultsController = function() {
    if (notesComplete() && !resultsShown) {
      resultsShown = true;
      return self;
    }
  }

  function noteNoLongerDisplayed(challenge) {
    if (allSuccessfulChallenges.indexOf(challenge) == -1 && !allFailedChallenges[challenge.id]) {
      challenges.push(challenge);
    }
  }

  self.nextNoteCardController = function() {
    var noteIndex = Util.random(0, challenges.length);
    var note = challenges[noteIndex];
    challenges.splice(challenges.indexOf(note), 1);
    if (note) {
      challengesDisplayed += 1;
      return new ChallengeController(note, submitNoteScore, noteNoLongerDisplayed);
    }
  }

  function notesComplete() {
    return (challenges.length == 0) && (challengesAttempted > 0) && (challengesAttempted == challengesDisplayed)
  }

  // this is used to refresh the background, and update the note count
  function refreshExternalStatus() {
    refreshStatus(allSuccessfulChallenges.length, Object.keys(uniqueNotes).length)
  }

  function submitNoteScore(note, score) {
    if (attemptedChallenges.indexOf(note) < 0) {
      attemptedChallenges.push(note);
      NoteManager.solveChallenge(note, score);
    }

    challengesAttempted += 1;

    if (score <= 3) {
      allFailedChallenges[note.id] = note;
      challenges.push(note);
    } else if (!allFailedChallenges[note]) {
      allSuccessfulChallenges.push(note);
    }

    refreshExternalStatus();
  }
}