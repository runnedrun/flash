debug = true;
verbose = false;

$( function(){
  $('.background').hide();
  NotecardView = new NotecardView();
  MessageView = new MessageView();
  ResultView = new ResultView();
  NoteInfoView = new NoteInfoView();
  ScorecardView = new ScorecardView();
  BackgroundView = new BackgroundView();

  LearnModeController = new LearnModeController();
  BackgroundController = new BackgroundController();
  MessageController = new MessageController();
  NotecardController = new NotecardController();
  ResultController = new ResultController();
  ScoreCardController = new ScoreCardController();
})