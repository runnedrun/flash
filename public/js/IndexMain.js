debug = true;
verbose = false;

$(function(){
  $('.background').hide();
  BackgroundView = new BackgroundView();

  LearnModeController = new LearnModeController();
  BackgroundController = new BackgroundController();
  MessageController = new MessageController();
  NoteCardController = new NoteCardController();
  NoteInfoController = new NoteInfoController();
  ResultController = new ResultController();
  ScoreCardController = new ScoreCardController();
})