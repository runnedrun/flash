ScoreCardController = function() {
  function newIndicator(e) {
    Fire.command("view.score-card.new-indicator", {
      id: e.note.id
    })
  }

  function updateIndicatorOnNoteComplete(e) {
    Fire.command("view.score-card.update-indicator", {
      id: e.note.id,
      preview: e.note.highlight,
      success: e.q > 0
    });
  }

  Respond.toEvent("note.new", newIndicator);
  Respond.toCommand("controller.note.completed", updateIndicatorOnNoteComplete);
}