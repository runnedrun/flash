// Scorecard
//
// Keep track of how we're doing

Scorecard = function() {
  var scorecardDiv = $("#scorecard");
  var scoreElement = '<a href="#" class="score glyphicon glyphicon-leaf gray"></a>';
  var scoreIndicators = {};

  function addNewScoreIndicator(e) {
    var newScoreIndicator = $(scoreElement);
    scoreIndicators[e.note.id] = newScoreIndicator;
    scorecardDiv.append(newScoreIndicator);
  }

  function indicateNoteComplete(e) {
    var newColor = e.q > 0 ? "green" : "red";
    var completedNote = e.note;
    var indicatorToChange = scoreIndicators[completedNote];

    indicatorToChange.removeClass("green").removeClass("red");
    indicatorToChange.addClass(newColor);

    var ellipsis = completedNote.highlight > 15 ? "..." : ""
    indicatorToChange.attr('title', completedNote.highlight.substring(0,15) + ellipsis);
  }

  Respond.toCommand("view.note.new", addNewScoreIndicator);
  Respond.toCommand("view.note.complete", indicateNoteComplete);
}