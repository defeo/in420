(function() {
    var style = '<style scoped> \
table {margin: auto; cursor: pointer } \
td, th { font-family: Mono; padding: 0 0.3em; overflow: hidden; } \
th { padding: 0.5em 0 } \
tr :first-child { padding-right: 1em } \
td.selected { background-color: #faa } \
tr+tr+tr+tr~tr { transition: line-height 200ms; line-height: 0.05;} \
#expand:checked + table:hover tr+tr+tr+tr~tr { line-height: 1; } \
</style>';

    function Cipher(div) {
	div.innerHTML = style;
	div.innerHTML += '<button id="toggle">(Dé)Chiffrer</button>';
	div.innerHTML += '<input type="number" id="keylen" style="width:3em">Longuer clef<br>'
	div.innerHTML += '<input type="checkbox" id="expand" checked>La table s\'expand au passage de la souris'
	div.innerHTML += '<table></table>';
	div.innerHTML += '<p>Indice de coincidence: <span id="ic"></span></p>';
	div.innerHTML += '<p>Lettre plus fréquente: <span id="most-freq"></span></p>';
	this.tab = vig.querySelector('table');
	this.ic = vig.querySelector('#ic');
	this.mfreq = vig.querySelector('#most-freq');

	this.text = div.dataset['text'] || 'ATTAQUERALAUBE';
	this.key = div.dataset['key'] || 'VIGEN';
	this.keylen = this.key.length;

	this.cipher = '';
	for (var i = 0 ; i < this.text.length ; i++) {
	    this.cipher += String.fromCharCode((this.text.charCodeAt(i) - 2*'A'.charCodeAt(0) + 
						this.key.charCodeAt(i % this.key.length)) % 26
					       + 'A'.charCodeAt(0))
	};

	this.clear = true;
	this.selected = 0;
	this.draw = function() {
	    this.tab.innerHTML = '<tr>' + (function() {
		var res = '<th>clef</th>';
		for (var i = 0 ; i < this.key.length ; i++)
		    res += '<th>' + this.key.charAt(i) + '</th>';
		return res;
	    })() + '</tr>';
	    var tab = split(this.clear ? this.text : this.cipher, 
			    this.keylen);
	    this.tab.innerHTML += tablize(tab);
	    var col = column(this.clear ? this.text : this.cipher,
			     this.keylen, this.selected);
	    this.ic.innerHTML = ic(col);
	    Array.prototype.forEach.call(this.tab.querySelectorAll('tr td'), function (x) {
		x.classList.remove('selected');
	    });
	    Array.prototype.forEach.call(this.tab.querySelectorAll('tr td:nth-child(' + (this.selected + 2) + ')'), function (x) {
		x.classList.add('selected');
	    });
	    var fr = max(col);
	    this.mfreq.innerHTML = fr[1] + ' (fréq. ' + fr[0] + ')';
	};
    
	var split = function(string, keylen) {
	    var res = [];
	    for (var i = 0 ; i < string.length ; i++) {
		if (i % keylen == 0)
		    res[parseInt(i / keylen)] = [];
		res[parseInt(i / keylen)][i % keylen] = string.charAt(i);
	    }
	    return res;
	};

	var column = function(string, keylen, col) {
	    var res = [];
	    for (var i = 0 ; i < string.length ; i++) {
		if (i % keylen == col)
		    res.push(string.charAt(i));
	    }
	    return res;
	}

	var tablize = function(t) {
	    return t.reduce(function(p, r) {
		return p + '<tr><td></td>' + r.reduce(function(p, c) {
		    return p + '<td>' + c + '</td>';
		}, '') + '</tr>'
	    }, '');
	};

	var freq = function(t) {
	    var fr = [];
	    for (var i = 0 ; i < 26 ; i++) fr[i] = 0;
	    t.forEach(function(x) {
		fr[x.charCodeAt(0) - 'A'.charCodeAt(0)]++;
	    });
	    return fr;
	};
	
	var ic = function(t) {
	    var fr = freq(t);
	    return fr.reduce(function(p, n) { return p + n*(n-1)/(t.length*(t.length-1)); }, 0);
	};

	var max = function(t) {
	    var fr = freq(t);
	    var m = Math.max.apply(null, fr);
	    return [m / t.length,
		    String.fromCharCode(fr.indexOf(m) + 
					'A'.charCodeAt(0))];
	}

	var toggle = div.querySelector('#toggle');
	this.draw();
	toggle.onclick = (function() {
	    this.clear = !this.clear;
	    this.draw();
	}).bind(this);

	var keylen = div.querySelector('#keylen');
	keylen.value = this.keylen;
	keylen.onchange = (function() {
	    this.keylen = keylen.value;
	    this.draw();
	}).bind(this);

	this.tab.onclick = (function(e) {
	    this.selected = -1;
	    var s = e.target
	    while (s = s.previousSibling) this.selected++;
	    if (this.selected < 0) this.selected = 0;
	    this.draw();
	}).bind(this);
    };	

    var vig = document.querySelector('#vigenere');
    var ciph = Cipher(vig);
})();
