// Scorecard
//
// Keep track of how we're doing

ScoreCardView = function() {
  var self = this;

  var scorecardDiv = $("#scorecard");
  var indicatorSelector = "score-indicator";
  var scoreElement = '<div><i href="#" class= "' + indicatorSelector + ' glyphicon glyphicon-leaf gray"></i></div>';

  self.addNewScoreIndicator = function(id) {
    var newScoreIndicator = $(scoreElement).addClass(id);
    scorecardDiv.append(newScoreIndicator);
  }

  self.updateIndicator = function(success, indicatorId, preview){
    var newColor = success ? "green" : "red";
    var indicatorToChange = $("." + indicatorSelector + "." + indicatorId);

    indicatorToChange.removeClass("green").removeClass("red");
    indicatorToChange.addClass(newColor);

    var ellipsis = preview.length > 25 ? "..." : ""
    indicatorToChange.attr('title', preview.substring(0,15) + ellipsis);
  }
}