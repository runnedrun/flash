// fires:
// result.view.complete

ResultView = function() {
  var resultDiv = $("#result");
  var submitBinding;

  function resultViewingComplete() {
    Fire.request("result.complete");
  }

  function displayResult(e) {
    console.log("displaying the resultssss");
    resultDiv.html(e.results);
    submitBinding = KeyBinding.keypress(KeyCode.enter, $(document), resultViewingComplete);
    ViewUtil.fadeIn(resultDiv)
  }

  function hideResult() {
    submitBinding.unbind();
    ViewUtil.fadeOut(resultDiv);
  }

  Respond.toCommand("view.result-view.show", displayResult);
  Respond.toCommand("view.result-view.hide", hideResult);

  resultDiv.hide();
}