// controller for the results view, it stores the current results being viewed, then
// submits

ResultController = function() {
  var currentNote;
  var currentQ;

  function showResult(e) {
    currentNote = e.note;
    currentQ = e.q;
    var result = e.q > 0 ? "good job" : "actual answer is" +  e.note.highlight;
    Fire.command("view.result-view.show", {
      result: result
    })
  }

  function onViewFinished(e) {
    Fire.command("controller.note.completed", {
      note: currentNote,
      q: currentQ
    })

    Fire.command("view.result-view.hide");
  }

  Respond.toCommand("controller.result.show", showResult)
  Respond.toRequest("result.complete", onViewFinished)
}