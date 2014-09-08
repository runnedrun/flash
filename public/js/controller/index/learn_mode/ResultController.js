// controller for the results view, it stores the current results being viewed, then
// submits

ResultController = function() {
  var currentNote;
  var currentQ;
  var self = this;
  self.resultView = new ResultView(self);

  function showResult(e) {
    currentNote = e.note;
    currentQ = e.q;
    var results = e.q > 0 ? "good job" : "FALSE. Actual answer: " +  e.note.highlight;
    self.resultView.displayResult(results);  // this can't be called result, its a reserved property in events
  }

  self.onViewFinished = function() {
    Fire.command("controller.note.completed", {
      note: currentNote,
      q: currentQ
    })
    self.resultView.hideResult()
  }

  Respond.toCommand("controller.result.show", showResult)
}