$.ctrl = function(key, callback, args) {
	$(document).keydown(function(e) {
		if(!args) args=[]; 
		if(e.keyCode == key.charCodeAt(0) && e.ctrlKey) {
			callback.apply(this, args);
			return false;
		}
	});        
};
