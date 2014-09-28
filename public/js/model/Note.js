function Note(properties){
  var self = this;
  self.id = properties.id;
  self.highlight = properties.highlight;
  self.hint = properties.hint;
  self.pageUrl = properties.pageUrl;
  self.ef = properties.ef;
  self.firstShow = properties.firstShow;
  self.nextShow = properties.nextShow;

  // The following are functions for updating data, not the DOM
  // They are likely to be used in V2, when we allow editing of notes
  self.updateHighlight = function(){};

  self.updateHint = function(){};

  self.updateEF = function(){};

  self.updateNextShow = function(q){
    /*
     // Update fields
     */

  };

  self.save = function(q){
    API.saveNote();
    // fire event
  }

  self.refresh = function(){
    API.refreshNote();
  }
}