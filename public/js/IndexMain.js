$( function(){
  $('.background').hide();
  new NotecardView();
  new MessageView();
  new ResultView();
  new NoteInfoView();
  new ScorecardView();
  new BackgroundView();

  new LearnModeController();
  new BackgroundController();
  new MessageController();
  new NoteCardController();
  new ResultController();
  new ScoreCardController();
})