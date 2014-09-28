// fires:
// result.view.complete

ResultView = function(resultController) {
  var resultDiv = $("#result");
  var submitBinding;
  var self = this;

  function resultViewingComplete() {
    resultController.onViewFinished();
  }

  self.displayResult = function(results) {
    console.log("displaying the resultssss");
    resultDiv.html(results);
    submitBinding = KeyBinding.keypress(KeyCode.enter, $(document), resultViewingComplete);
    ViewUtil.fadeIn(resultDiv)
  }

  self.hideResult = function() {
    submitBinding.unbind();
    ViewUtil.fadeOut(resultDiv);
  }

  resultDiv.hide();
}