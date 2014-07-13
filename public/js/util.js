randomize = function(arr) {
  for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr;
};


fadeOut = function(element){
	element.fadeOut(400);
}

fadeIn = function(element){
	setTimeout(function(){
		element.fadeIn(400);
	}, 420);
}