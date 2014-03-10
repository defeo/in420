---
layout: post
title: Algorithme de compression LZ78
---

<style scoped>
strong {
	font-weight: bold;
	font-family: Sans, sans-serif;
	font-size: 90%;
}
#lz78-enc, #lz78-dec {
	font-family: Mono, monospace;
	padding: 1em;
	border: solid thin black;
	border-radius: 5px;
	float: right;
	margin: 1em;
}
.input .selected, .dict .selected {
	transition: box-shadow 2s;
	box-shadow: 0 0 3px red;
}
.output > .written ~ span,
.dict   > .written ~ span {
	visibility: hidden;
	opacity: 0;
}
.output span, .dict span {
	transition: opacity 2s, visibility 2s;
}
.dict {
	padding-left: 1em;
}
.dict span {
	white-space: pre;
}
.controls {
	text-align: center;
}
.controls button {
	font-weight: bold;
	font-size: 150%;
}
</style>
<script>
function LZ78(id, steps) {
  this.elt = $(id);
  this.steps = steps;

  this.cur = 0;

  this.go = function (i) {
	if (i >= 0 && i < this.steps.length) {
	  this.cur = i;
	  var step = this.steps[this.cur];
	  var select = function (elt, n) {
		elt.classList.remove(this.class);
		if ((this.ord.indexOf && this.ord.indexOf(n) >= 0)
			|| this.ord == n) {
		  elt.classList.add(this.class);
		}
	  }
	  this.elt.$$('.input>span').forEach(select.bind({ ord : step.input, class : 'selected' }));
	  this.elt.$$('.output>span').forEach(select.bind({ ord : step.output, class : 'written' }));
	  this.elt.$$('.dict>span').forEach(select.bind({ ord : step.dict, class : 'written' }));
	  this.elt.$$('.dict>span').forEach(select.bind({ ord : step.prefix, class : 'selected' }));
	}
  }

  this.go(0);

  var ctrl = this.elt.$('.controls');
  ctrl.innerHTML += '<button>«</button> <button>»</button>';
  ctrl.$('button:first-child').onclick = (function() {
    this.go(this.cur - 1);
  }).bind(this);
  ctrl.$('button:last-child').onclick = (function() {
    this.go(this.cur + 1);
  }).bind(this);
}
</script>


L'algorithme de compression Lempel-Ziv &apos;78, est l'un des tout premiers
algorithmes de compression génériques. Il a vite été adopté dans des
nombreux logiciels commerciales et libres, il est par exemple à la
base du format ZIP. Il s'agit d'un algorithme basé sur un
dictionnaire : les suites de symboles dans la source sont encodées par
un dictionnaire dynamique, qui est compilé au fur et à mesure que l'on
parcourt la source.

Le but de ce DM est d'implanter en Java les algorithmes de compression
et décompression LZ78. Le codage LZ78 étant générique, votre programme
va pouvoir s'appliquer non seulement à des fichiers de texte, mais
aussi à tout autre type de fichiers (images, audio, etc.). Le facteur
de compression sera meilleur pour des sources avec beaucoup de
redondance : attendez-vous à une bonne compression pour des longs
textes ou des images bitmap, mais à une plutôt mauvaise pour
du jpeg ou du mp3.


## Flux de bits

La lecture/écriture d'un fichier ASCII peut se faire aussi bien en
mode binaire (avec
[`FileInputStream`](http://docs.oracle.com/javase/6/docs/api/java/io/FileInputStream.html)
et
[`FileOutputStream`](http://docs.oracle.com/javase/6/docs/api/java/io/FileOutputStream.html)),
qu'en mode texte (avec
[`FileReader`](http://docs.oracle.com/javase/6/docs/api/java/io/FileReader.html)
et
[`FileWriter`](http://docs.oracle.com/javase/6/docs/api/java/io/FileWriter.html)). Allez
voir les derniers TDs et la page [Entrées-Sorties](Entrées-Sorties en Java)
en Java pour l'usage de ces classes.

Au contraire, l'encodage de l'algorithme LZ78 est à longueur variable,
et basé sur les bits. Il n'est donc pas commode de travailler avec des
fichiers compressés en utilisant les classes par défaut de Java. Pour
cela nous allons plutôt utiliser des classes permettant de lire ou
écrire un flux de données bit par bit.

Un *encapsuleur* (*wrapper* en anglais) est une classe qui prend en
entrée de son constructeur un objet et qui en étend les
fonctionnalités. Des exemples classiques d'encapsuleurs en Java sont
[`BufferedReader`](http://docs.oracle.com/javase/6/docs/api/java/io/BufferedReader.html)
et
[`BufferedWriter`](http://docs.oracle.com/javase/6/docs/api/java/io/BufferedWriter.html),
qui encapsulent respectivement `FileReader` et `FileWriter`, comme
dans l'exemple suivant.

~~~
BufferedReader in = new BufferedReader(new FileReader("in.txt"));
BufferedWriter out = new BufferedWriter(new FileWriter("out.txt"));
~~~

Pour lire les fichiers en mode bit à bit, vous pouvez utiliser la
classe `InputBitStream` ci dessous. Elle encapsule un `InputStream` en
le lisant octet par octet, mais offre une interface permettant de lire
un à la fois les bits de chaque octet.

~~~
import java.io.*;

public class InputBitStream {
    InputStream stream;
    int buf;
    byte pos;

    public InputBitStream(InputStream in) {
        this.stream = in;
        this.pos = -1;
    }
        
    public int readBit() throws IOException {
        if (this.pos >= 0) {
            return (this.buf >> pos--) & 1;
        } else {
            if ((this.buf = this.stream.read()) == -1) {
                return -1;
            } else {
                this.pos = 6;
                return (this.buf >> 7) & 1;
            }
        }
    }

    public void close() throws IOException {
        this.stream.close();
    }
}
~~~
  
Dans le même esprit, voici une classe `OutputBitStream` qui encapsule
un `OutputStream`. 

~~~
import java.io.*;

public class OutputBitStream {
    OutputStream stream;
    byte buf;
    byte pos;

    public OutputBitStream(OutputStream in) {
        this.stream = in;
        this.buf = 0;
        this.pos = 7;
    }
        
    public void writeBit(int bit) throws IOException {
        this.buf |= bit << pos;
        pos--;
        if (this.pos < 0) {
            this.stream.write(this.buf);
            this.buf = 0;
            this.pos = 7;
        }
    }

    public void close() throws IOException {
        if (this.pos < 7)
            this.stream.write(this.buf);
        this.stream.close();
    }
}
~~~
  
Remarquez que la méthode `.close()` de `OutputBitStream` écrit tout le
contenu du tampon dans le OutputStream sous-jacent, en ajoutant assez
de bits 0 à la fin pour atteindre un un octet complet. Après une
`close`, aucune autre écriture dans le flux n'est plus possible.
Remarquez que les deux classes arrangent les bits à l'intérieur d'un
octet avec une orientation [Big Endian](Endianness).


## Algorithme LZ78

Un peu de terminologie pour commencer. Les algorithmes de compression
*par dictionnaire* opèrent sur une *source* (par exemple, un fichier),
qui est une suite (ou *flux*) de *symboles* appartenant à un *alphabet
d'entrée*. Il produisent un *sortie*, suite de symboles d'un *alphabet
de sortie*.

L'algorithme LZ78 opère sur des sources encodées par *blocs* de taille
constante ; par exemple, un bloc par octet. L'*alphabet d'entrée* est
donc constitué de tous les symboles représentables sur un bloc. Si on
poursuit notre exemple, l'alphabet des symboles représentables sur un
octet est constitué des valeurs entre 0 et 255. Un symbole de
l'alphabet représentera donc, dans notre exemple, un symbole ASCII
lorsque on encodera un fichier de texte, ou bien la profondeur d'une
couleur (rouge, vert, bleu ou niveau de gris) lorsque on encodera une
bitmap avec profondeur de 8 bits (mais remarquez que l'algorithme LZ78
lui même ne fait aucune différence entre ces deux formats : tout ce
que l'algorithme voit ce sont des blocs de 8 bits).

L'alphabet de sortie de LZ78 est constitué de paires
**(préfixe, symbole)**, où **préfixe** est un entier et **symbole**
est un symbole de l'alphabet d'entrée. Si le **symbole** est encodé
exactement comme dans l'alphabet d'entrée, l'encodage du **préfixe**
est à longueur variable, ce qui fait de LZ78 un encodage à longueur
variable.

Le principe de LZ78 consiste à parcourir la source en apprenant les
suites de symboles les plus fréquentes. Ces suites de symboles,
appelées *préfixes* sont stockées dans un *dictionnaire*, construit au
fur et à mesure que l'on parcourt la source. Plus des suites de
symboles sont fréquentes, plus elles donneront lieu à des longs
préfixes dans le dictionnaire.

Le dictionnaire grandit au fur et à mesure qu'on parcourt la
source. Pour des sources très longues, cela peut devenir coûteux en
mémoire et temps de recherche, c'est pourquoi souvent on fixe une
taille maximale, au delà de laquelle on arrête d'y ajouter des
symboles.

Dans ce DM nous allons implanter LZ78 avec des blocs de taille 1
octet, et sans limite sur la taille du dictionnaire.


### Compression

Le dictionnaire va décrire une fonction qui envoie des suites de
symboles de l'alphabet d'entrée (les *préfixes*) vers des entiers (le
*code du préfixe*).

L'algorithme commence avec un dictionnaire vide. Il est plus
confortable de noter cela avec un préfixe spécial, le *préfixe vide*
**ε**.

	ε : 0

L'algorithme parcourt la source en gardant trace des préfixes
rencontrés à chaque étape. Lorsqu'il trouve un préfixe qui n'est pas
déjà dans le dictionnaire, il crée un nouveau préfixe, il lui donne le
premier code non encore utilisé et le rentre dans le dictionnaire.

Lorsque l'algorithme rentre un nouveau préfixe dans le dictionnaire,
il émet sur sa sortie la paire **(préfixe, symbole)**, où **symbole**
est le dernier symbole rencontré et **préfixe** est le dernier préfixe
rencontré avant le symbole.

Voici un exemple avec une source contenant la suite de symboles
`ACATAPLASMATIC`.

{::options parse_block_html="false" /}
<div id="lz78-enc">
  <strong>Entrée :</strong>
  <span class="input">
	<span>A</span><span>C</span><span>A</span><span>T</span><span>A</span><span>P</span><span>L</span><span>A</span><span>S</span><span>M</span><span>A</span><span>T</span><span>I</span><span>C</span>
  </span><br/>
  
  <strong>Sortie :</strong>
  <span class="output"><span class="written"></span>
	<span>(0,A)</span><span>(0,C)</span><span>(1,T)</span><span>(1,P)</span><span>(0,L)</span><span>(1,S)</span><span>(0,M)</span><span>(3,I)</span><span>(2,\0)</span>
  </span><br/><br/>

  <strong>Dictionnaire :</strong>
  <div class="dict">
	<span class="written">ε   : 0</span><br/>
	<span>A   : 1</span><br/>
	<span>C   : 2</span><br/>
	<span>AT  : 3</span><br/>
	<span>AP  : 4</span><br/>
	<span>L   : 5</span><br/>
	<span>AS  : 6</span><br/>
	<span>M   : 7</span><br/>
	<span>ATI : 8</span>
  </div>

  <div class="controls"></div>
</div>
<script>
var enc = new LZ78('#lz78-enc', [
  { prefix : -1, input : -1, output : 0, dict : 0 },
  { prefix : 0, input : 0, output : 0, dict : 0 },
  { prefix : 0, input : 0, output : 1, dict : 1 },
  { prefix : 0, input : 1, output : 1, dict : 1 },
  { prefix : 0, input : 1, output : 2, dict : 2 },
  { prefix : 0, input : 2, output : 2, dict : 2 },
  { prefix : 1, input : [2,3], output : 2, dict : 2 },
  { prefix : 1, input : [2,3], output : 3, dict : 3 },
  { prefix : 0, input : 4, output : 3, dict : 3 },
  { prefix : 1, input : [4,5], output : 3, dict : 3 },
  { prefix : 1, input : [4,5], output : 4, dict : 4 },
  { prefix : 0, input : 6, output : 4, dict : 4 },
  { prefix : 0, input : 6, output : 5, dict : 5 },
  { prefix : 0, input : 7, output : 5, dict : 5 },
  { prefix : 1, input : [7,8], output : 5, dict : 5 },
  { prefix : 1, input : [7,8], output : 6, dict : 6 },
  { prefix : 0, input : 9, output : 6, dict : 6 },
  { prefix : 0, input : 9, output : 7, dict : 7 },
  { prefix : 0, input : 10, output : 7, dict : 7 },
  { prefix : 1, input : [10,11], output : 7, dict : 7 },
  { prefix : 3, input : [10,11,12], output : 7, dict : 7 },
  { prefix : 3, input : [10,11,12], output : 8, dict : 8 },
  { prefix : 0, input : 13, output : 8, dict : 8 },
  { prefix : 2, input : 13, output : 8, dict : 8 },
  { prefix : 2, input : 13, output : 9, dict : 9 },
]);
</script>
{::options parse_block_html="true" /}


Dans l'exemple, on [commence](#lz78-enc){:onclick="enc.go(1)"} avec le
préfixe vide, de code **0**. Le premier symbole **A** n'est pas dans
le dictionnaire il est donc [rentré](#lz78-enc){:onclick="enc.go(2)"}
avec le premier code disponible (**1**), et la paire **(0,A)** est
écrite en sortie.

Ensuite l'algorithme [redémarre](#lz78-enc){:onclick="enc.go(3)"} du
préfixe vide et continue parcourir la source comme auparavant.

La [troisième itération](#lz78-enc){:onclick="enc.go(5)"} est
intéressante : ayant déjà inséré le préfixe **A** dans le
dictionnaire, on [continue](#lz78-enc){:onclick="enc.go(6)"} jusqu'à
trouver la suite **AT** avant de
[rentrer](#lz78-enc){:onclick="enc.go(7)"} un nouveau préfixe dans le
dictionnaire. Le symbole de sortie correspondant sera le code **1**
pour le préfixe **A**, suivi du nouveau symbole **T**.

L'algorithme [s'arrête](#lz78-enc){:onclick="enc.go(23)"} lorsqu'il
atteint la fin du flux et renvoie le flux de sortie. Il y a un
problème potentiel sur la dernière itération : l'algorithme peut se
trouver sur un préfixe déjà connu, autre que le préfixe vide. C'est le
cas dans notre exemple : on termine sur le préfixe **C**, qui est déjà
dans le dictionnaire, avant qu'on ait pu écrire le symbole
correspondant sur la sortie. On a deux solutions:

- On utilise un symbole spécial pour marquer la fin du flux. Par
  exemple, pour l'encodage d'un fichier ASCII cela pourrait être le
  symbole `\0` (code ASCII `0x00`), qui sert exactement de terminateur
  de chaîne de caractères. Remarquez que ceci n'est pas applicable à
  tout format de fichier. C'est le choix que nous
  [avons pris](#lz78-enc){:onclick="enc.go(24)"} dans l'exemple.
  
- On termine le flux de sortie par un **préfixe** sans
  **symbole**. Cette technique peut s'appliquer toujours, mais
  l'algorithme de décodage devra tenir compte de cela. C'est le choix
  que nous prenons plus bas dans le pseudo-code.


### Encodage à longueur variable et endiannes

Il reste un détail : comment encoder le flux de sortie en une suite de
bits ? Plus précisément, comment encoder les **préfixes** et comment
encoder les **symboles** ?

Puisqu'on va être amenés à écrire des entiers dans un flux de bits, il
faut d'abord adopter une convention sur l'écriture de ces
entiers. Nous allons utiliser l'ordre [big endian](Endianness), c'est
à dire l'écriture usuelle des entiers, qui commence par les bits de
poids fort (les plus hautes puissances de la base).

Dans notre exemple, les symboles **A**, **B**, etc., ont pour code
ASCII **65**, **66**, etc. Leur écriture sur des blocs de 8 bits sera
donc

| **A** | 01000001 |
| **B** | 01000010 |
| **...** | |
{:.centered}

les bits étant insérés dans le flux de gauche à droite. Voir aussi la
page [Endianness](Endianness).

Concernant les codes de préfixe, il faut savoir sur combien de bits on
va écrire leur encodage.  Si on avait une borne sur la taille maximale
du dictionnaire, on pourrait allouer suffisamment de bits pour
représenter le plus grand des codes. On peut faire mieux : à l'étape
$$i$$ on sait qu'on ne peut pas rencontrer un code de préfixe plus
grand que $$i$$, il suffit donc d'encoder les codes de préfixe sur
$$\log_2 i$$ bits. L'espace nécessaire à écrire ces codes va grandir
au fur et à mesure qu'on écrit le flux de sortie : le premier code (il
s'agit nécessairement du code **0**) va être écrit sur 0 bits, le
deuxième sur 1 bit, le troisième et le quatrième sur 2 bits, du
cinquième au huitième sur 3 bits, et ainsi de suite.

Pour reprendre notre exemple, voici le flux de sorite.

	(0,A)(0,C)(1,T)(1,P)(0,L)(1,S)(0,M)(3,I)(2,\0)

On commence par écrire les préfixes en binaire sur $$\log_2 i$$ bits.

	(,A)(0,C)(01,T)(01,P)(000,L)(001,S)(000,M)(011,I)(0010,\0)

Enfin, on écrit les symboles avec le même codage qu'en entrée. Cela
donne le flux de bits suivant (les points ont été ajoutés pour
faciliter la lecture).

    01000001.001000011.0101010100.0101010000.00001001100.00101010011.00001001101.01101001001.001000000000
{: style="font-size:smaller"}

Pour vous aider à vérifier votre code, voici un
[fichier](misc/dm_lz78_acataplasmatic.bin) contenant le flux
ci-dessus. On remarque que dans cet exemple, le code compressé occupe
12 octets (plus exactement, 93 bits), alors que la source en
occupait 14.

Une autre aide précieuse pourra vous être fournie par les outils de
lecture de fichiers binaires. Sous Linux et MacOS, utilisez la
commande `hd`. Sous Windows vous pouvez installer
[Hexdump](http://www.richpasco.org/utilities/hexdump.html).

Pour résumer, voici le pseudo-code de l'algorithme de compression
(attention, comme dit plus haut, ce pseudocode ne produit pas
exactement le flux de l'exemple, car il traite différemment la fin du
flux d'entrée).

~~~
dict ← { ε : 0 }
comp ← 0
préf ← ε

pour tout symbole σ de la source:
	si ε.σ dans dict:
		préf ← ε.σ
	sinon:
		si comp > 0:
			écrire dict[préf] sur ⎣log₂ comp⎦ + 1 bits
		écrire σ sur 8 bits
		comp ← comp + 1
		dict[ε.σ] ← comp
		préf ← ε

si préfixe ≠ ε:
	écrire dict[préf] sur ⎣log₂ comp⎦ + 1 bits
~~~


### Décompression

L'algorithme de décompression LZ78 lit un flux compressé, une paire
**(préfixe, symbole)** à la fois. À chaque étape, un dictionnaire qui
associe des codes de préfixes à des suites de symboles de l'alphabet
source est mis à jour.

Au début, le dictionnaire contient la seule association

	0 : ε

{::options parse_block_html="false" /}
<div id="lz78-dec">
  <strong>Entrée :</strong>
  <span class="input">
	<span>(0,A)</span><span>(0,C)</span><span>(1,T)</span><span>(1,P)</span><span>(0,L)</span><span>(1,S)</span><span>(0,M)</span><span>(3,I)</span><span>(2,\0)</span>
  </span><br/>
  
  <strong>Sortie :</strong>
  <span class="output"><span class="written"></span>
	<span>A</span><span>C</span><span>A</span><span>T</span><span>A</span><span>P</span><span>L</span><span>A</span><span>S</span><span>M</span><span>A</span><span>T</span><span>I</span><span>C</span>
  </span><br/><br/>

  <strong>Dictionnaire :</strong>
  <div class="dict">
	<span class="written">0 : ε</span><br/>
	<span>1 : A</span><br/>
	<span>2 : C</span><br/>
	<span>3 : AT</span><br/>
	<span>4 : AP</span><br/>
	<span>5 : L</span><br/>
	<span>6 : AS</span><br/>
	<span>7 : M</span><br/>
	<span>8 : ATI</span>
  </div>

  <div class="controls"></div>
</div>
<script>
var dec = new LZ78('#lz78-dec', [
  { prefix : -1, input : -1, output : 0, dict : 0 },
  { prefix : 0, input : 0, output : 0, dict : 0 },
  { prefix : 0, input : 0, output : 1, dict : 1 },
  { prefix : 0, input : 1, output : 1, dict : 1 },
  { prefix : 0, input : 1, output : 2, dict : 2 },
  { prefix : 1, input : 2, output : 2, dict : 2 },
  { prefix : 1, input : 2, output : 4, dict : 3 },
  { prefix : 1, input : 3, output : 4, dict : 3 },
  { prefix : 1, input : 3, output : 6, dict : 4 },
  { prefix : 0, input : 4, output : 6, dict : 4 },
  { prefix : 0, input : 4, output : 7, dict : 5 },
  { prefix : 1, input : 5, output : 7, dict : 5 },
  { prefix : 1, input : 5, output : 9, dict : 6 },
  { prefix : 0, input : 6, output : 9, dict : 6 },
  { prefix : 0, input : 6, output : 10, dict : 7 },
  { prefix : 3, input : 7, output : 10, dict : 7 },
  { prefix : 3, input : 7, output : 13, dict : 8 },
  { prefix : 2, input : 8, output : 13, dict : 8 },
  { prefix : 2, input : 8, output : 14, dict : 8 },
]);
</script>
{::options parse_block_html="true" /}

Lorsque l'algo lit une paire **(préfixe, symbole)**, il écrit sur sa
sortie le **préfixe**, suivi du **symbole**, puis augmente le
dictionnaire avec un nouveau code, correspondant à la concaténation du
**préfixe** et du **symbole**.

Voici le même exemple qu'auparavant, traité par l'algorithme de
décompression.

On remarquera que le dictionnaire ainsi construit est exactement
l'inverse du dictionnaire construit par l'algorithme de compression.

Pour résumer, voici le pseudo-code de l'algorithme de décompression.

~~~
dict ← { 0 : ε }
comp ← 0

répéter:
	si comp > 0:
		préf ← lire ⎣log₂ comp⎦ + 1 bits du flux d'entrée
	sinon
		préf ← 0
	π ← dict[préf]
	écrire π
	s'il reste assez de bits dans le flux:
		σ ← lire 8 bits du flux d'entrée
		écrire σ
		comp ← comp + 1
		dict[comp] ← π.σ
	sinon
		σ ← ε
		sortir
~~~

## À vos `javac`

Votre but est d'implanter en Java l'algorithme LZ78. Plus précisément,
vous devez :

1. Implanter l'algorithme de compression LZ78. Pour réaliser
   le dictionnaire, vous pouvez vous servir, par exemple, d'une table
   de hachage :
   [`java.util.HashMap`](http://docs.oracle.com/javase/6/docs/api/java/util/HashMap.html).

2. Implanter l'algorithme de décompression LZ78 en Java. Cette
   fois-ci, une simple liste (par exemple
   [java.util.Vector](http://docs.oracle.com/javase/6/docs/api/java/util/Vector.html))
   peut suffire à représenter le dictionnaire.

3. Résoudre le *challenge* à l'adresse <http://it-katas.defeo.lu/katas/lz78>.

Soumettez votre code source, ainsi que le texte décompressé, dans la
boîte de dépôt sur
[e-campus 2](http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2011-12-20.0840/BoiteDepot-lucadefe-20140224012138548648/cours_boite_view),
ou par mail à votre [enseignant](http://defeo.lu/). Vous avez jusqu'au
10 mars à 4h du matin pour soumettre votre travail. Un point de
pénalité pour chaque heure de retard : le 10 mars à 23h59 c'est votre
dernière chance !


## Pour aller plus loin

Voici des améliorations que vous pouvez apporter à votre implantation
pour gagner des points.

1. Dans l'algorithme d'encodage il y a plus efficace que de stocker le
   dictionnaire dans une table de hachage. En effet, les préfixes
   peuvent étre stockés dans une structure d'arbre, ce qui permet de
   rendre le recherches plus rapides. Le dictionnaire de l'exemple,
   serait alors représenté par l'arbre suivant.
      
   <pre><svg width="800" height="290" style="margin:auto;display:block" viewbox="-420,-10,800,280">
     <defs>
	   <marker id="arrow" orient="auto"
               style="overflow:visible">
         <path
			 d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
			 transform="matrix(-0.8,0,0,-0.8,-10,0)"
			 style="fill-rule:evenodd;stroke:black;stroke-width:1pt;marker-start:none" />
	   </marker>
	 </defs>
	 <g text-anchor="middle">
	   <text x="0" y="20">ε : 0</text>
	   
	   <text x="-200" y="100">A : 1</text>
	   <text x="-0" y="100">C : 2</text>
	   <text x="160" y="100">L : 5</text>
	   <text x="320" y="100">M : 7</text>
	   
	   <text x="-340" y="180">T : 3</text>
	   <text x="-200" y="180">P : 4</text>
	   <text x="-60" y="180">S : 6</text>
	   
	   <text x="-340" y="260">I : 8</text>
	 </g>
	 <g style="stroke:black;stroke-width:1;marker-end:url(#arrow)">
	   <path d="M -10,30 -200,80" />
	   <path d="M 0,30 0,80" />
	   <path d="M 10,30 160,80" />
	   <path d="M 15,30 320,80" />
	   
	   <path d="M -210,110 -340,160" />
	   <path d="M -200,110 -200,160" />
	   <path d="M -190,110 -60,160" />
	   
	   <path d="M -340,190 -340,240" />
	 </g>
   </svg></pre>

   Implantez votre dictionnaire avec une structure d'arbre comme
   celle-ci.

2. L'algorithme LZ78 n'est pas limité à opérer sur les octets : il
   peut opérer sur des blocs de n'importe quelle taille. Modifiez
   votre algorithme pour que la taille des blocs d'entrée soit
   configurable.

3. Permettre au dictionnaire de grandir de façon incontrôlée pose un
   problème avec des fichiers trop grands. Modifiez votre algorithme
   pour qu'il ait une borne sur le nombre maximal d'entrées dans le
   dictionnaire.
