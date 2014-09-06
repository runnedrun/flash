// controller for the results view, it stores the current results being viewed, then
// submits

ResultController = function() {
  var currentNote;
  var currentQ;

  function showResult(e) {
    currentNote = e.note;
    currentQ = e.q;
    var results = e.q > 0 ? "good job" : "actual answer is" +  e.note.highlight;
    Fire.command("view.result-view.show", {
      results: results  // this can't be called result, its a reserved property
    })

    Fire.command("view.note-info.show", {
      hint: e.note.hint,
      link: e.note.archiveUrl
    });
  }

  function onViewFinished(e) {
    Fire.command("controller.note.completed", {
      note: currentNote,
      q: currentQ
    })

    Fire.command("view.result-view.hide");
    Fire.command("view.note-info.hide");
  }

  Respond.toCommand("controller.result.show", showResult)
  Respond.toRequest("result.complete", onViewFinished)
}