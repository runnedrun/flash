debug = true;
verbose = false;

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
  new NotecardController();
  new ResultController();
  new ScoreCardController();
})