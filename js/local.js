(function() {
    var c = document.querySelectorAll(".collapsible");
    for (var i = 0; i < c.length; i++) {
	c[i].addEventListener('click', function(e) {
	    e.currentTarget.classList.toggle('collapsed');
	}, false);
    }
})();
