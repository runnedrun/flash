function NotesLoadingView(switchToViewMode) {

  var T = {
    noLearnModeNotes: "No notes to learn right now! Hit enter to view all notes.",
    noNotes: "You have no notes! Take some notes using the chrome extension."
  }

  var submitBinding;
  var messageDisplay = $(".notes-loading-display");

  function hideAndSwitchToViewMode() {
    messageDisplay.hide();
    submitBinding && submitBinding.unbind();
    switchToViewMode();
  }

  this.hide = function() {
    messageDisplay.hide();
  }

  this.displayNoNotesLoaded = function(){
    messageDisplay.html(T.noNotes);
  }

  this.displayNoLearnModeNotesLoaded = function(){
    messageDisplay.html(T.noLearnModeNotes);
    submitBinding = KeyBinding.keydown(KeyCode.enter, $(document.body), hideAndSwitchToViewMode);
  }
}