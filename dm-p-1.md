---
layout: post
title: Méthode de factorisation <i>p</i> – 1
---

Nous avons appris que la sécurité de certains protocoles
cryptographiques, tel RSA, repose sur la difficulté de factoriser un
nombre composé de la forme $$N=pq$$, où $$p$$ et $$q$$ sont deux
nombres premiers de même taille (en pratique, 500 ou 1000 bits).

La factorisation est un problème estimé difficile en général, mais pas
tous les nombres sont également difficiles à factoriser. Un nombre est
dit *friable* si sa factorisation ne comporte que des *petits* nombres
premiers. Les nombres friables sont faciles à factoriser, mais par
construction les modules RSA n'en sont pas.

L'une des premières familles de modules RSA *faibles* à avoir été
découverte est constitué des nombres $$pq$$ tels que $$p-1$$ (ou
$$q-1$$) est friable. Ces modules sont facilement factorisables par la
méthode $$p-1$$ de Pollard. Remarquez qu'un nombre premier pris au
hasard a très peu de chances de satisfaire cette propriété.


## La méthode de factorisation *p* – 1

Soit $$N=pq$$ avec $$p$$ et $$q$$ des grands premiers, et supposons
que tous les facteurs premiers de $$p-1$$ sont plus petits qu'une
borne $$B$$, appelée *borne de friabilité*. La méthode $$p-1$$
retrouve les facteurs inconnus $$p$$ et $$q$$, à partir de la seule
connaissance de $$N$$ et d'une hypothèse sur la borne $$B$$.

La méthode est basée sur les propriétés des anneaux modulaires
$$ℤ/Nℤ$$ et $$ℤ/pℤ$$. L'intuition est simple : puisque $$p$$ divise
$$N$$, l'anneau $$ℤ/Nℤ$$ contient une copie *cachée* de
$$ℤ/pℤ$$.[^crt] En effet les réductions modulo $$N$$ sont compatibles
avec les réductions modulo $$p$$ :

$$a ≡ b \mod N \qquad⇒\qquad a ≡ b \mod p$$

(attention, la réciproque n'est pas vraie). En particulier, si $$e$$
est un multiple de $$p-1$$, et si $$0<a<N$$ n'est pas divisible par
$$p$$, on a

$$b ≡ a^e \mod N \qquad⇒\qquad b ≡ a^e ≡ 1 \mod p,$$

où la dernière égalité est une conséquence du petit théorème de
Fermat. Par conséquent $$b-1$$ est divisible par $$p$$, et il y a peu
de chances qu'il soit aussi divisible par $$q$$. On a alors
$$p=\mathrm{pgcd}(a,N)$$, ce qui nous donne la factorisation de $$N$$.

Pour résumer, voici une réalisation de la méthode $$p-1$$ de Pollard.

> **Entrées :** un entier $$N$$, une *borne* $$B$$ ;  
> **Sorties :** un facteur de $$N$$, ou ÉCHEC.
>
> 1. Calculer $$e = B!$$ ;
> 2. Choisir un élément $$0<a<N$$ au hasard ;
> 3. Calculer $$x = \mathrm{pgcd}(a,N)$$ ;
>  - Si $$x ≠ 1$$, renvoyer $$x$$.
> 4. Calculer $$b = a^e \bmod N$$ par exponentiation binaire ;
> 5. Calculer $$x = \mathrm{pgcd}(b-1,N)$$ ;
>  - Si $$x = N$$, renvoyer ÉCHEC (borne trop grande) ;
>  - Si $$x = 1$$, renvoyer ÉCHEC (borne trop petite) ;
>  - Sinon, renvoyer $$x$$.

Quelques remarques :

- Si $$p-1$$ divise $$B!$$, alors il est certainement friable ; mais
  il existe des nombres friables qui ne divisent pas $$B!$$. Il existe
  une formule théoriquement plus satisfaisante, mais nous ne la
  donnons pas pour simplicité. Allez voir
  [cette page](http://defeo.lu/MA2-AlgoC/#factorisation-dentiers) si
  la factorisation vous intéresse.

- L'étape 3 n'est pas nécessaire si on sait à priori que $$p$$ ne
  divise pas $$a$$, par exemple, lorsque $$a<p$$. Dans le cadre de
  RSA, puisque $$p\sim\sqrt{N}$$, on peut toujours prendre
  $$a\ll\sqrt{N}$$ pour garantir cela.

- Si à l'étape 5 on a $$x=N$$, cela peut vouloir dire deux choses :
  
  - soit (improbable) l'ordre de $$a$$ modulo $$N$$ est plus petit que
    $$φ(N)$$, dans ce cas redémarrer l'algorithme avec un $$a$$
    différent pourrait réussir la factorisation ;
  - soit (plus probable) $$q$$ divise aussi $$b-1$$, dans ce cas
    redémarrer avec une borne $$B$$ plus petite pourrait réussir la
    factorisation.

- Au contraire, si à l'étape 5 on a $$x=1$$, on n'a pas de choix : il
  faut choisir une borne $$B$$ plus grande. La complexité de
  l'algorithme augmentant exponentiellement en $$B$$, c'est là le vrai
  facteur limitant de la méthode.


[^crt]: De manière plus formelle, on a un *isomorphisme d'anneaux*
	$$ℤ/Nℤ ≃ ℤ/pℤ × ℤ/qℤ$$. C'est un cas particulier du
	[théorème des restes chinois](http://fr.wikipedia.org/wiki/Th%C3%A9or%C3%A8me_des_restes_chinois).


## La classe `BigInteger`

Java possède plusieurs types primitifs d'entiers: `byte`, `short`,
`char`, `int`, `long`. Tous ces types sont à *précision fixe* : ils
tiennent dans un nombre prédéterminé d'octets et ne peuvent pas
dépasser cette borne. Le type le plus grand est `long`, qui code les
entiers sur 64 bits.

Cependant, 64 bits correspondent à peine 20 chiffres décimaux :
largement en dessous des tailles d'entiers nécessaires à la
cryptographie (plutôt 1024 bits ou 300 chiffres décimaux). La classe
[java.math.BigInteger](http://docs.oracle.com/javase/6/docs/api/java/math/BigInteger.html)
offre des entiers à précision arbitraire : leur occupation en mémoire
grandit au fur et à mesure que les calculs l'exigent. Plus de soucis à
se faire sur les dépassements de bornes!

Les `BigInteger` sont des objets immuables, comme les `String` : c'est
à dire qu'une fois qu'il a été crée, un `BigInteger` ne peut plus être
changé.

Pour créer un `BigInteger`, rien de plus simple : on peut en créer à
partir d'une chaîne de caractères

~~~
BigInteger a = new BigInteger("12345678901234567890");
~~~

Des constantes aux noms qui parlent de soi sont aussi prédéfinies :

~~~
BigInteger.ZERO
BigInteger.ONE
BigInteger.TEN
~~~

Les opérateurs usuels `+`, `*`, etc. ne sont pas utilisables sur les `BigInteger` : ils sont remplacés par des méthodes. Voici un bref comparatif des opérations arithmétiques sur les entiers (`int` ou `long`) et sur les `BigInteger`.

---

|                    |entiers machine  |`BigInteger`
|--------------------|-----------------|------------------------------------------
|création            |`int a = 10`;    |`BigInteger a = BigInteger.valueOf(10)`;
|opérations          |`c = a + b;`     |`c = a.add(b);`
|                    |`c = a - b;`     |`c = a.subtract(b);`
|                    |`c = a * b;`     |`c = a.multiply(b);`
|                    |`c = a / b;`     |`c = a.divide(b);`
|                    |`c = a % b;`     |`c = a.mod(b);`¹
|comparaisons        |`a == b`         |`a.equals(b)`
|                    |`a < b`          |`a.compareTo(b) == -1`
|                    |`a > b`          |`a.compareTo(b) == 1`
{: .centered style="text-align: left"}

> ¹`a.mod(b)` se comporte mieux que `a % b`, en ce que le résultat est
> toujours positif. Si vous voulez avoir exactement le même
> comportement que `a % b`, il faut utiliser `a.remainder(b)`.

---

D'autres opérations encore sont définies sur les `BigInteger`, allez
voir la
[documentation](http://docs.oracle.com/javase/6/docs/api/java/math/BigInteger.html).


## À vos `javac`

Le but de ce DM est d'implanter le méthode $$p-1$$ pour des grands
entiers, cependant la classe `BigInteger` implante déjà une bonne
partie du DM. Pour que ce ne soit pas trop simple, il vous est
interdit de vous servir des méthodes `BigInteger.modPow()` et
`BigInteger.gcd()` (vous pouvez vous en servir pour tester vos
fonctions, par contre).

Écrivez un programme Java qui prend en entrée un entier $$N$$ et une
borne $$B$$ et qui applique la méthode de factorisation $$p-1$$. Vous
aurez à écrire, notamment

- une fonction `factorial` permettant de calculer la factorielle
  $$B!$$,
- une fonction `modPow` calculant l'exponentiation binaire,
- une fonction `pgcd` calculant le pgcd de deux entiers.

Vérifiez votre programme avec des petits nombres composés. Voici
quelques entiers facilement factorisables avec cette méthode :

- 444853,
- 2057574960,
- 5270033701,
- 1593351640742417,
- 118567477908254066625631346528284988138430727716864000047.

Votre mission: visitez
[cette page](http://it-katas.defeo.lu/katas/p-1) et utilisez la
méthode $$p-1$$ pour sauver le monde! Faites attention: ces nombres
sont bien trop gros pour vous passer de la classe `BigInteger`...

Soumettez votre code source, dans la boîte de dépôt sur
[e-campus 2](http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2011-12-20.0840/BoiteDepot-lucadefe-20140422164234712501/cours_boite_view),
ou par mail à votre [enseignant](http://defeo.lu/). Vous avez jusqu'au
8 mai à 4h du matin pour soumettre votre travail. Un point de
pénalité pour chaque heure de retard : le 8 mai à 23h59 c'est votre
dernière chance !
