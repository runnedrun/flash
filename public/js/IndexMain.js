$( function(){
  $('.background').hide();
  notemanager = new NoteManager;
  notecard = new Notecard();
  mascot = new Mascot();
  result = new Result();
  noteinfo = new NoteInfo();
  scorecard = new Scorecard();
  login = new Login();

  notemanager.init();
})