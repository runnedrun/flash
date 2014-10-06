// controller for the results view, it stores the current results being viewed, then
// submits

ResultController = function(resultView, infoCardView) {
  var currentNote;
  var currentQ;
  var self = this;

  function showResult(e) {
    currentNote = e.note;
    currentQ = e.q;
    var results = e.q > 3 ? "good job" : "FALSE. Actual answer: " +  e.note.highlight;
    resultView.displayResult(results);  // this can't be called result, its a reserved property in events
  }

  self.onViewFinished = function() {
    Fire.command("controller.note.completed", {
      note: currentNote,
      q: currentQ
    })
    resultView.hideResult()
  }

  Respond.toCommand("controller.result.show", showResult)
}