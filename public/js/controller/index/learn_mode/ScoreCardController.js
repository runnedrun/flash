ScoreCardController = function() {
  var self = this;
  self.scoreCardView = new ScoreCardView(self);

  function newIndicator(e) {
    self.scoreCardView.addNewScoreIndicator(e.note.id);
  }

  function updateIndicatorOnNoteComplete(e) {
    self.scoreCardView.updateIndicator(e.q > 0, e.note.id, e.note.highlight);
  }

  Respond.toEvent("note.new", newIndicator);
  Respond.toCommand("controller.note.completed", updateIndicatorOnNoteComplete);
}