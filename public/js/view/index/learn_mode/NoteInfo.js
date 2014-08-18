NoteInfo = function() {
  var hintIcon = $("#hint_icon");
  var hintDiv = $('#hint');
  var linkDiv = $('#note_link');
  var noteInfoDiv = $('#note_info');

  function showHint(e) {
    hintDiv.html(e.info);
    linkDiv.attr("href", e.link);
    ViewUtil.fadeOut(hintIcon);
    ViewUtil.fadeIn(hintDiv);
  }

  function hideHint(e) {
    ViewUtil.fadeIn(hintIcon);
    ViewUtil.fadeOut(hintDiv);
  }

  function hideInfo(e) {
    ViewUtil.fadeOut(noteInfoDiv);
  }

  Respond.toCommand("view.note-info.show.hint", showHint);
  Respond.toCommand("view.note-info.hide.hint", hideHint);
  Respond.toCommand("view.note-info.hide.info", hideInfo);

//  // Register for Events
//  $(document).on('state.note', function(){
//    fadeIn(noteInfoDiv);
//    self.hideHint();
//  })
//  $(document).on('state.result', function(){
//    fadeIn(noteInfoDiv);
//    self.showHint();
//  })
//  $(document).on('state.message', function(){
//    fadeOut(noteInfoDiv);
//  })
//  $(document).on('state.finished', function(){
//    fadeOut(noteInfoDiv);
//  })

  noteInfoDiv.hide();
  hintDiv.hide();
}