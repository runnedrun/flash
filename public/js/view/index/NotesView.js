/*
  This view manages the list of notes which are shown to the user in. It initializes a ScrollCardView, which
  allows for infinite scrolling of content cards.
 */

NotesView = function() {
  var self = this;
  var scrollContainer = $(".card-container");
  var scrollCardView =

  self.render = function(_scrollCardView) {
    scrollCardView = _scrollCardView;
    scrollCardView.render(scrollContainer);
  }

  KeyBinding.keydown(KeyCode.down, $(document.body), scrollForwardOneNote);

  function scrollForwardOneNote(e) {
    scrollCardView.scrollToPrevious();
    return false;
  }
}
