(function($) {
    var fo = $.getElementById('file-opener');

    var encodings = { 'utf-8'          : 'utf-8',
		      'utf-16'         : 'utf-16be',
		      'utf-16le'       : 'utf-16le',
		      'utf-16-default' : 'utf-16',
		      'us-ascii'       : 'us-ascii',
		      'iso-8859-1'     : 'iso-8859-1', 
		      'iso-8859-15'    : 'iso-8859-15',
		      'windows-1252'   : 'windows-1252',
		    };

    if (fo) {
	fo.classList.add('dont-print');

	fo.innerHTML = 	'<p>\
            <label for="file">Fichier : </label><input type="file" id="file" />\
            <label for="enc">Encodage : </label><select id="enc"></select></p>'
	fo.innerHTML += '<textarea id="ed" readonly></textarea>'

	var file = fo.querySelector('#file');
	var enc = fo.querySelector('#enc');
	var ed = fo.querySelector('#ed');

	ed.style.width = '100%';
	ed.style.height = '30ex';
	ed.style.display = 'block';
	ed.style.backgroundColor = '#fff';

	for (e in encodings) {
	    var opt = document.createElement('option');
	    opt.value = encodings[e];
	    opt.innerHTML = e;
	    enc.appendChild(opt);
	}

	file.onchange = enc.onchange = function(e) {
	    if (file.files[0]) {
		console.log("Reading " + file.files[0].name + " as " + enc.value);
		reader.readAsText(file.files[0], enc.value);
	    }
	}

	var reader = new FileReader();
	reader.onload = function(e) {
	    ed.value = reader.result;
	}
    }
})(document);
