// Used to display how many notes are left in learn mode
function StatusView() {
  var display = $(".status-display");

  this.update = function(notesRemaining) {
    display.html(notesRemaining);
  }

  this.hide = function() {
    display.hide();
  }

}