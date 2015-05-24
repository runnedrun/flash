function Challenge(properties){
  var self = this;
  self.id = Number(properties.id);
  self.text = properties.text;
  self.hint = properties.hint;
  self.ef = properties.ef;
  self.firstShow = properties.firstShow;
  self.nextShow = properties.nextShow;

  self.save = function(q){

  }

  self.refresh = function(){
    API.refreshNote();
  }
}