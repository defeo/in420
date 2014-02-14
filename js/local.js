(function() {
    $$(".collapsible").forEach(function(c) {
	c.addEventListener('click', function(e) {
	    e.currentTarget.classList.toggle('collapsed');
	}, false);
    });
})();

