function Note(properties){
  var self = this;
  self.id = Number(properties.id);
  self.text = properties.text;

  self.save = function(q){

  }

  self.refresh = function(){
    API.refreshNote();
  }
}