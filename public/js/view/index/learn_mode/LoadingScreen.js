LoadingScreen = function() {
  var loadingIndicator = $("#loading");

  function showLoadingScreen() {
    loadingIndicator.show();
  }

  function hideLoadingScreen() {
    loadingIndicator.hide();
  }

  Respond.toCommand("view.loading-screen.show", showLoadingScreen);
  Respond.toCommand("view.loading-screen.hide", hideLoadingScreen);
}