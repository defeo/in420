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
</style>

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

On va commencer par un exemple. Supposons que notre source contienne
la suite de symboles

	alas falbala

L'algorithme parcourt la source en gardant trace des préfixes
rencontrés à chaque étape. Lorsqu'il trouve un préfixe qui n'est pas
déjà dans le dictionnaire, il crée un nouveau préfixe, il lui donne le
premier code non encore utilisé et le rentre dans le dictionnaire.

Dans notre exemple, on commence avec le préfixe vide, de code
**0**. Le premier symbole **a** n'est pas dans le dictionnaire

	alas falbala
	^
{:.no-highlight}

il est donc rentré avec le premier code disponible : **1**.

	ε : 0
	a : 1
{:.no-highlight}

Lorsque l'algorithme rentre un nouveau préfixe dans le dictionnaire,
il émet sur sa sortie la paire **(préfixe, symbole)**, où **symbole**
est le dernier symbole rencontré et **préfixe** est le dernier préfixe
rencontré avant le symbole.

Dans notre exemple, on aura la paire **(0,a)** sur la sortie.

	entrée :  alas falbala
	          ^
	sortie :  (0,a)

	Dictionnaire:
	  ε : 0      < préfixe courant
	  a : 1
{:.no-highlight}

Ensuite l'algorithme redémarre du préfixe vide et continue parcourir
la source comme auparavant.

Dans notre exemple, nous aurons les itérations suivantes.

    entrée :  alas falbala
               ^
    sortie :  (0,a)(0,l)

    Dictionnaire:
      ε : 0      < préfixe courant
      a : 1
      l : 2
{:.no-highlight}
    entrée :  alas falbala
                ^
	sortie :  (0,a)(0,l)

    Dictionnaire:
      ε : 0      < préfixe courant
      a : 1
      l : 2
{:.no-highlight}
    entrée :  alas falbala
                –^
    sortie :  (0,a)(0,l)(1,s)

    Dictionnaire:
      ε  : 0
      a  : 1     < préfixe courant
      l  : 2
      as : 3
{:.no-highlight}

Cette dernière itération est intéressante : ayant déjà inséré le
préfixe **a** dans le dictionnaire, on continue jusqu'à trouver la
suite **as** avant de rentrer un nouveau préfixe dans le
dictionnaire. Le symbole de sortie correspondant sera le code **1**
pour le préfixe **a**, suivi du nouveau symbole **s**.

On continue

    entrée :  alas falbala
                  ^
    sortie :  (0,a)(0,l)(1,s)(0, )

    Dictionnaire:
      ε  : 0     < préfixe courant
      a  : 1
      l  : 2
      as : 3
         : 4
{:.no-highlight}
    entrée :  alas falbala
                   ^
    sortie :  (0,a)(0,l)(1,s)(0, )(0,f)

    Dictionnaire:
      ε  : 0     < préfixe courant
      a  : 1
      l  : 2
      as : 3
         : 4
      f  : 5
{:.no-highlight}
    entrée :  alas falbala
                    –^
    sortie :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)

    Dictionnaire:
      ε  : 0
      a  : 1     < préfixe courant
      l  : 2
      as : 3
         : 4
      f  : 5
      al : 6
{:.no-highlight}
    entrée :  alas falbala
                      ^
    sortie :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)

    Dictionnaire:
      ε  : 0     < préfixe courant
      a  : 1
      l  : 2
      as : 3
         : 4
      f  : 5
      al : 6
      b  : 7
{:.no-highlight}
    entrée :  alas falbala
                       ––^
    sortie :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)

    Dictionnaire:
      ε   : 0
      a   : 1
      l   : 2
      as  : 3
          : 4
      f   : 5
      al  : 6    < préfixe courant
      b   : 7
      ala : 8
{:.no-highlight}

L'algorithme s'arrête lorsqu'il atteint la sortie du flux et renvoie
le flux de sortie. Il y a un problème potentiel sur la dernière
itération : l'algorithme peut se trouver sur un préfixe déjà connu
autre que le préfixe vide. C'est le cas, par exemple, dans l'encodage
du mot **aaaa** :

    entrée :  aaaa
                ^
    sortie :  (0,a)(1,a)
	
    Dictionnaire :
      ε  : 0
	  a  : 1      < préfixe courant
	  aa : 2
{:.no-highlight}

Dans ce cas on a deux solutions:

- On utilise un symbole spécial pour marquer la fin du flux. Par
  exemple, pour l'encodage d'un fichier ASCII cela pourrait être le
  symbole `\0` (code ASCII `0x00`), qui sert exactement de terminateur
  de chaîne de caractères. Remarquez que ceci n'est pas applicable à
  tout format de fichier. Dans notre exemple, cela donne
  
	  (0,a)(1,a)(2,\0)

- On termine le flux de sortie par un **préfixe** sans
  **symbole**. Cette technique peut s'appliquer toujours, mais
  l'algorithme de décodage devra tenir compte de cela. Dans notre
  exemple, cela donne
  
	  (0,a)(1,a)(2)
		  
Il reste un problème : sur combien de bits encoder la partie
**préfixe** du flux de sortie ? Si on avait une borne sur la taille
maximale du dictionnaire, on pourrait allouer suffisamment de bits
pour représenter le plus grand des codes. On peut faire mieux : à
l'étape $$i$$ on sait qu'on ne pourra pas rencontrer un code de
préfixe plus grand que $$i$$, il suffit donc d'encoder les codes de
préfixe sur $$\log_2 i$$ bits. L'espace nécessaire à écrire ces codes
va grandir au fur et à mesure qu'on écrit le flux de sortie : le
premier code (il s'agit nécessairement du code **0**) va être écrit
sur 0 bits, le deuxième sur 1 bit, le troisième et le quatrième sur 2
bits, du cinquième au huitième sur 3 bits, et ainsi de suite.

Pour notre exemple, cela donne finalement l'encodage (les points sont
ajoutés pour aider la lecture)

    A.0L.01S.00 .000F.001L.000B.006A

où, bien évidemment, les symboles de l'alphabet d'entrée sont codés
par leur code ASCII sur 8 bits. On remarque que dans cet exemple, le
code compressé occupe 11 octets (plus précisément, 81 bits), alors que
la source en occupait 12.

Pour résumer, voici le pseudo-code de l'algorithme de compression.

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

Lorsque l'algo lit une paire **(préfixe, symbole)**, il écrit sur sa
sortie le **préfixe**, suivi du **symbole**, puis augmente le
dictionnaire avec un nouveau code, correspondant à la concaténation du
**préfixe** et du **symbole**.

Voici comme l'algorithme de décompression opère sur l'exemple
précédent.

	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	           ^
	sortie :  a

	Dictionnaire:
	  0 : ε      < préfixe
{:.no-highlight}
	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	                ^
	sortie :  al

	Dictionnaire:
	  0 : ε      < préfixe
	  1 : a
{:.no-highlight}
	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	                     ^
	sortie :  alas

	Dictionnaire:
	  0 : ε
	  1 : a      < préfixe
	  2 : l
{:.no-highlight}
	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	                          ^
	sortie :  alas 

	Dictionnaire:
	  0 : ε      < préfixe
	  1 : a
	  2 : l
	  3 : as
{:.no-highlight}
	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	                               ^
	sortie :  alas f

	Dictionnaire:
	  0 : ε      < préfixe
	  1 : a
	  2 : l
	  3 : as
	  4 : 
{:.no-highlight}
	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	                                    ^
	sortie :  alas fal

	Dictionnaire:
	  0 : ε
	  1 : a      < préfixe
	  2 : l
	  3 : as
	  4 :
	  5 : f
{:.no-highlight}
	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	                                         ^
	sortie :  alas falb

	Dictionnaire:
	  0 : ε      < préfixe
	  1 : a
	  2 : l
	  3 : as
	  4 :
	  5 : f
	  6 : al
{:.no-highlight}
	entrée :  (0,a)(0,l)(1,s)(0, )(0,f)(1,l)(0,b)(6,a)
	                                              ^
	sortie :  alas falbala

	Dictionnaire:
	  0 : ε
	  1 : a
	  2 : l
	  3 : as
	  4 :
	  5 : f
	  6 : al     < préfixe
	  7 : b
{:.no-highlight}
	  
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
   de hashage :
   [`java.util.HashMap`](http://docs.oracle.com/javase/6/docs/api/java/util/HashMap.html).

2. Implanter l'algorithme de décompression LZ78 en Java. Cette
   fois-ci, une simple liste (par exemple
   [java.util.Vector](http://docs.oracle.com/javase/6/docs/api/java/util/Vector.html))
   peut suffire à représenter le dictionnaire.

3. Résoudre le *challenge* à l'adresse <http://it-katas.defeo.lu/katas/lz78>.

Soumettez votre code source, ainsi que le texte décompressé, dans la
boîte de dépôt sur [e-campus 2](), ou par mail à votre
[enseignant](http://defeo.lu/). Vous avez jusqu'au ?? à 4h du matin
pour soumettre votre travail. Un point de pénalité pour chaque heure
de retard : le ?? à 23h59 c'est votre dernière chance !


## Pour aller plus loin

Voici des améliorations que vous pouvez apporter à votre implantation
pour gagner des points.

1. Dans l'algorithme d'encodage il y a plus efficace que de stocker le
   dictionnaire dans une table de hashage. En effet, les préfixes
   peuvent étre stockés dans une structure d'arbre, ce qui permet de
   rendre le recherches plus rapides. Le dictionnaire de l'exemple,
   serait alors représenté par l'arbre suivant.
   
   ~~~
   ε : 0 |– a : 1 |– s : 3
	     |        |– l : 6 |– a : 8
         |– l : 2
		 |–   : 4
		 |– f : 5
		 |– b : 7
   ~~~
   
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
