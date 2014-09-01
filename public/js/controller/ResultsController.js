// controller for the results view, it stores the current results being viewed, then
// submits

ResultsController = function() {
  var currentNote;
  var currentQ;

  function showResults(e) {
    var currentNote = e.note;
    var currentQ = e.q;
    var result = e.q > 0 ? "good job" : "actual answer is" +  e.note.highlight;
    Fire.command("view.results-view.show", {
      result: result
    })
  }

  function onViewFinished(e) {
    Fire.command("controller.note.completed", {
      note: currentNote,
      q: currentQ
    })
  }

  Respond.toCommand("controller.results.show", showResults)
  Respond.toRequest("results.complete", onViewFinished)
}