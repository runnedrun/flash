// Scorecard
//
// Keep track of how we're doing

ScorecardView = function() {
  var scorecardDiv = $("#scorecard");
  var indicatorSelector = "score-indicator";
  var scoreElement = '<a href="#" class= "' + indicatorSelector + 'glyphicon glyphicon-leaf gray"></a>';

  function addNewScoreIndicator(e) {
    var newScoreIndicator = $(scoreElement).addClass(e.id);
    scorecardDiv.append(newScoreIndicator);
  }

  function updateIndicator(e) {
    var newColor = e.success ? "green" : "red";
    var indicatorId = e.id;
    var preview = e.preview;
    var indicatorToChange = $("." + indicatorSelector + "." + indicatorId);

    indicatorToChange.removeClass("green").removeClass("red");
    indicatorToChange.addClass(newColor);

    var ellipsis = preview > 15 ? "..." : ""
    indicatorToChange.attr('title', preview(0,15) + ellipsis);
  }

  Respond.toCommand("view.score-card.new-indicator", addNewScoreIndicator);
  Respond.toCommand("view.score-card.indicator-update", updateIndicator);
}