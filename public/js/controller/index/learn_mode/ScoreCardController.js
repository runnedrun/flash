ScoreCardController = function() {
  var self = this;
  self.scoreCardView = new ScoreCardView(self);

  function newIndicator(e) {
    self.scoreCardView.addNewScoreIndicator(e.note.id);
  }

  function updateIndicatorOnNoteComplete(e) {

    // 0 = Failed, 1 = Succeeded, 2 = Redemption
    var status = e.note.attempted ? 2 : 1;
    status = e.q > 3 ? status : 0;
    self.scoreCardView.updateIndicator(status, e.note.id, e.note.highlight);
  }

  Respond.toEvent("note.new", newIndicator);
  Respond.toCommand("controller.note.completed", updateIndicatorOnNoteComplete);
}