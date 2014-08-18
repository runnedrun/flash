// fires:
// result.view.complete

ResultView = function() {
  var resultDiv = $("#result");
  var submitBinding;

  function resultViewingComplete() {
    Fire.request("result.view.complete");
  }

  function displayResults(e) {
    setTimeout( self.activate, 820 );


    }

    resultDiv.html(result);

    submitBinding = KeyBinding.keypress(KeyCode.enter, document, resultViewingComplete);
    ViewUtil.fadeIn(resultDiv)
  }

  function hideResults() {
    submitBinding.unbind;
    ViewUtil.fadeOut(resultDiv);
  }

  Respond.toCommand("view.result-view.show", displayResults);
  Respond.toCommand("view.result-view.hide", hideResults)

  self.init = function(){
    resultDiv.hide();
  }

  self.activate = function(){
    $(document).on('keypress', function(e){
      var code = e.keyCode || e.which;
      if(code == 13) {        // 13 = Enter key
        $(document).off('keypress');
        var nextState = notemanager.nextNote()? "note" : "finished";
        notemanager.states.push({"state":nextState});
        notemanager.advanceState();
        fadeOut(resultDiv);
      }
    });
  }

  self.init();
}