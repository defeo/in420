(function() {
    function show(sa) {
	sa.classList.toggle('show-after');
    }

    if (document.location.hash == "#solution") {
	$$('.show-after').forEach(show);
    } else {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
	    var d = new Date(xhr.getResponseHeader('Date'));
	    $$('.show-after').forEach(function(sa) {
		var diff = new Date(sa.dataset.showAfter) - d;
		console.log(diff, sa.id);
		if (diff !== NaN && diff < 24*60*60*100) {
		    setTimeout(function() {
			show(sa);
		    }, Math.max(diff, 0));
		}
	    });
	}
	xhr.open('head', document.location.href, true);
	xhr.send();
    }

    window.addEventListener('hashchange', function() {
	if (document.location.hash == "#solution") {
	    $$('.show-after').forEach(show);
	    $('#solution').scrollIntoView();
	}
    }, true);
})();
