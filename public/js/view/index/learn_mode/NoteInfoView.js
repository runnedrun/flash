NoteInfoView = function() {
  var hintIcon = $("#hint_icon");
  var hintDiv = $('#hint');
  var linkDiv = $('#note_link');
  var noteInfoDiv = $('#note_info');

  function showInfo(e) {
    linkDiv.attr("href", e.link);
    hintDiv.html(e.hint);
    ViewUtil.fadeIn(noteInfoDiv);
  }

  function hideInfo(e) {
    ViewUtil.fadeOut(noteInfoDiv);
  }

  Respond.toCommand("view.note-info.show", showInfo);
  Respond.toCommand("view.note-info.hide", hideInfo);

  hintIcon.click(hintDiv.toggle);

  noteInfoDiv.hide();
  hintDiv.hide();
}