(function() {
    function Cipher(div) {
	div.innerHTML = '<button id="toggle">(Dé)Chiffrer</button>';
	div.innerHTML += '<input type="number" id="keylen" style="width:3em">Longuer clef'
	div.innerHTML += '<style scoped>table {margin: auto} td { font-family: Mono; padding: 0 0.3em; }</style>';
	div.innerHTML += '<table></table>';
	this.tab = vig.querySelector('table');

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
	this.draw = function() {
	    this.tab.innerHTML = tablize(split(
		this.clear ? this.text : this.cipher, 
		this.keylen));
	}
    
	var split = function(string, keylen) {
	    var res = [];
	    for (var i = 0 ; i < string.length ; i++) {
		if (i % keylen == 0)
		    res[parseInt(i / keylen)] = [];
		res[parseInt(i / keylen)][i % keylen] = string.charAt(i);
	    }
	    return res;
	};

	var tablize = function(t) {
	    return t.reduce(function(p, r) {
		return p + '<tr>' + r.reduce(function(p, c) {
		    return p + '<td>' + c + '</td>';
		}, '') + '</tr>'
	    }, '');
	};

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
    };	

    var vig = document.querySelector('#vigenere');
    var ciph = Cipher(vig);
})();
