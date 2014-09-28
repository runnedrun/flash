// Scorecard
//
// Keep track of how we're doing

ScoreCardView = function() {
  var self = this;

  var colors = ["red", "green", "blue"]; // Failure, Success, Redemption
  var scorecardDiv = $("#scorecard");
  var indicatorSelector = "score-indicator";
  var scoreElement = '<a href="#" class= "' + indicatorSelector + ' glyphicon glyphicon-leaf gray"></a>';

  self.addNewScoreIndicator = function(id) {
    var newScoreIndicator = $(scoreElement).addClass(id);
    scorecardDiv.append(newScoreIndicator);
  }

  self.updateIndicator = function(success, indicatorId, preview){
    var newColor = colors[success];
    var indicatorToChange = $("." + indicatorSelector + "." + indicatorId);

    for (var i=0; i<colors.length; i++) {
      indicatorToChange.removeClass(colors[i]);
    }
    indicatorToChange.addClass(newColor);

    var ellipsis = preview.length > 25 ? "..." : ""
    indicatorToChange.attr('title', preview.substring(0,15) + ellipsis);
  }
}