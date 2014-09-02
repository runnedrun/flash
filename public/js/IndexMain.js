$( function(){
  $('.background').hide();
  notemanager = new NoteManager;
  notecard = new NotecardView();
  mascot = new MessageView();
  result = new ResultView();
  noteinfo = new NoteInfo();
  scorecard = new Scorecard();
  login = new Login();

  notemanager.init();
})