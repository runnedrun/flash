// fires:
// result.view.complete

ResultView = function() {
  var resultDiv = $("#result");
  var submitBinding;

  function resultViewingComplete() {
    Fire.request("results.complete");
  }

  function displayResults(e) {
    resultDiv.html(e.result);
    submitBinding = KeyBinding.keypress(KeyCode.enter, document, resultViewingComplete);
    ViewUtil.fadeIn(resultDiv)
  }

  function hideResults() {
    submitBinding.unbind();
    ViewUtil.fadeOut(resultDiv);
  }

  Respond.toCommand("view.result-view.show", displayResults);
  Respond.toCommand("view.result-view.hide", hideResults);

  resultDiv.hide();
}