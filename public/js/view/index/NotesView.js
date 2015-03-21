/*
  This view manages the list of notes which are shown to the user in learn mode. It initializes a ScrollCardView, which
  allows for infinite scrolling of content cards. It passes nextNote and previous to the ScrollCardView for that view's
  fillNextCard and fillPreviousCard methods. previousNote is unimplemented here, as during learn mode the user should
  never go back to the previous note. Next note initializes a NoteCardView, with the card jquery element passes to it
  by ScrollCardView, and returns that.
 */

NotesView = function() {
  var self = this;
  var scrollContainer = $(".card-container");

  self.render = function(scrollCardView) {
    scrollCardView.render(scrollContainer);
  }

  KeyBinding.keydown(KeyCode.down, $(document.body), scrollForwardOneNote);

  function scrollForwardOneNote(e) {
    scrollCardView.scrollToPrevious();
    return false;
  }
}
