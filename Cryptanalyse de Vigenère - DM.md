---
layout: post
title: Cryptanalyse de Vigenère
---

## Le système de Vigenère

Le cryptosystème de Vigenère est un système de chiffrement symétrique poly-alphabétique. Il est basé sur les 26 lettres de l'alphabet latin en réalisant une substitution cyclique des symboles du texte clair. On en rappelle brièvement le principe.

La clef secrète est une chaîne de caractères (mieux si aléatoires), de longueur secrtète. Par exemple `AXFRE` est une clef de longueur 5. Le texte clair est préalablement réduit aux seules lettres de l'alphabet (tous les espaces, accents, etc. sont éliminés), ensuite chiffré en interprétant chaque caractère de la clef comme un décalage (A=0, B=1, etc.), le décalages étant appliqués successivement et cycliquement.

Voici un exemple de chiffrement du message "Attaquer à l'aube":

~~~
 A  T  T  A  Q  U  E  R  A  L  A  U  B  E

 A  X  F  R  E  A  X  F  R  E  A  X  F  R
 0 23  5 17  4  0 23  5 17  4  0 23  5 17

 A  Q  Y  R  U  U  B  W  R  P  A  R  G  V
~~~

1. Écrire un programme Java qui réalise le chiffrement et le déchiffrement d'un fichier par la méthode de Vigenère.

Pour lire et écrire un fichier au format texte il est conseillé d'utiliser les classes [`FileReader`](http://docs.oracle.com/javase/6/docs/api/java/io/FileReader.html) et [`FileWriter`](http://docs.oracle.com/javase/6/docs/api/java/io/FileWriter.html), qui réalisent les lectures et écriture caractère par caractère. Allez voir aussi [Entrées-Sorties en Java](Entrées-Sorties en Java).


## Cryptanalyse

Le cryptosystème de Vigenère a longtemps été considéré incassable. Cependant, sa cryptanalyse est très aisée à l'aide des ordinateurs.

En supposant la longueur $$n$$ de la clef connue, un message peut être décrypté rapidement de la façon suivante:

- Décomposer le texte chiffré en $$n$$ textes. Le premier texte est la suite des lettres en positions $$0, n, 2n, 3n, ...$$, le deuxième est la suite des lettres en positions $$1, n+1, 2n+1, 3n+1, ...$$, et ainsi de suite.

- Pour chacun des $$n$$ textes, compter le nombre d'occurrences de chaque lettre.

- Dans chacun des $$n$$ textes, la lettre la plus courante correspond presque surement à la lettre `E`. Les autres lettres suivent par décalage.

- Recomposer les $$n$$ textes ainsi décryptés pour composer le message d'origine.

Par exemple, le message de la section précédente est décomposé en 5 messages:

~~~
AUA
QBR
YWG
RRV
UP
~~~

Ces messages sont trop courts pour pouvoir faire une analyse statistique, mais s'ils avaient été plus longs, on aurait sans doutes remarqué que la lettre la plus fréquente dans le premier est la lettre `E` (`E` + `A`), dans le deuxième le `B` (`E` + `X`), dans le troisième le `J` (`E` + `F`), et ainsi de suite. De cette observation, on aurait immédiatement déduit les 5 textes clairs.


2. Écrire un programme qui prend en entrée une longueur de clef et un texte chiffré, et qui applique la cryptanalyse décrite ci-dessus.


## Challenge

Lorsque la longueur de la clef est inconnue, la cryptanalyse ci-dessus reste valable : la seule difficulté consiste à deviner la longueur de la clef. Cependant, la longueur de la clef ne peut pas être très importante : elle sera en général de l'ordre de quelques dizaines de symboles. Il ne reste plus qu'à essayer le programme que vous venez d'écrire avec des longueurs de plus en plus grandes jusqu'à tomber sur un texte qui fait du sens.

3. Visitez [cette page](http://it-katas.defeo.lu/katas/vigenere) et décryptez le message fourni.


## Deviner la longueur 

S'il est vrai que les ordinateurs permettent de casser facilement le cryptosystème de Vigenère, à l'époque de son usage il restait néanmoins très difficile d'essayer toutes les longueurs possibles.

Friedman a été le premier à publier une méthode pour deviner la longueur de la clef de Vigenère avec beaucoup moins d'effort. Elle est basée sur l'*indice de coïncidence*.

## Indice de coïncidence

On sait déjà que dans un texte français les lettres ne sont pas
uniformément distribuées. Ceci n'est pas le seul biais statistique
présent. L'*indice de coïncidence* mesure la probabilité que, si on
prends deux lettres au hasard dans un texte donné, ces deux lettres
soient la même.

On considère un texte (peu importe si clair ou chiffré) de longueur
$$n$$, et on note $$n_A, n_B, n_C, \ldots$$ le nombre d'occurrences des
lettres A, B, C, etc.

L'indice de coïncidence vaut alors

$$
\sum_{i=A,\dots,Z}\frac{n_i(n_i-1)}{n(n-1)}.
$$

Pour s'en convaincre, il suffit de chercher la réponse aux questions suivantes (des exercices très élémentaires de combinatorie/probabilité) :

- Si on prend une lettre au hasard dans le texte, quelle est sa
  probabilité d'être un A? Et un B?
- Combien de façons y a-t-il de sélectionner deux lettres quelconques
  parmi les $$n$$ lettres du texte?
- Combien de façons y a-t-il de sélectionner deux A dans le texte? Et
  deux B?
- Quelle est donc la probabilité de sélectionner deux A?
- Plus généralement, quelle est la probabilité de sélectionner deux
  lettres égales? 


L'*indice de coïncidence* dépend,
bien sûr, du texte choisi. Plus le texte est biaisé, plus il sera
grand: par exemple, si le texte ne contient que des A, l'indice de
coïncidence vaut $$1$$, car, peu importe comment on les choisit, on est
sûrs de tomber sur deux lettres identiques.


### L'indice de coïncidence attendu

On cherche maintenant une approximation de l'indice de coïncidence
pour la langue française. Nous allons appeler *indice de coïncidence
attendu* cette approximation.

On considère un texte de longueur assez grande (on va faire comme si
elle était infinie). On appelle $$p_A, p_B, p_C, \ldots$$ la probabilité
de tomber sur un A, un B, etc. si on prend une lettre au hasard dans
ce texte.

En se posant les questions suivantes:

- Si on sélectionne deux lettres quelconques du texte, quelle est la
  probabilité de tomber sur deux A?
- Plus généralement, quelle est la probabilité de tomber sur deux
  lettres égales?

on arrive à la conclusion que l'*indice de coïncidence attendu* est égal à

$$
\sum_{i=A,\dots,Z}p_i^2.
$$

Il est évident que l'indice attendu ne dépend que des probabilités d'apparition de chaque lettre dans la langue donnée.


### Indices de coïncidence et Vigenère

Pour appliquer l'indice de coïncidence à la cryptanalyse de Vigenère, il suffit de faire quatre observations:

- L'indice de coïncidence attendu d'une langue qui utiliserait des lettres parfaitement équidistribuées est $$1/26=0.0385$$.

- D'après le tableau ci-contre

     | E | 15,87% | N | 7,15% | D | 3,39% | Q | 1,06% | H | 0,77%
     | A | 9,42% | R | 6,46% | M | 3,24% | G | 1,04% | Z | 0,32%
     | I | 8,41% | U | 6,24% | P | 2,86% | B | 1,02% | X | 0,30%
     | S | 7,90% | L | 5,34% | C | 2,64% | F | 0,95% | Y | 0,24%
     | T | 7,26% | O | 5,14% | V | 2,15% | J | 0,89% | K,W | 0%
     {: .centered}

    l'indice de coïncidence attendu de la langue française est environ 0.0778.
    
- Les décalages ne changent pas l'indice de coïncidence : les fréquences $$n_A, n_B, \dots$$ sont permutées, mais leur somme reste la même. Ainsi, un texte chiffré par César a le même indice de coïncidence que le texte clair.

- Plusieurs décalages, comme dans Vigenère, changent l'indice de coïncidence, car maintenant les probabilités dépendent de la positions des lettres par rapport à la clef. En première approximation, on peut supposer que l'indice de coïncidence d'un texte chiffré par Vigenère est proche de $$1/26$$.
  
Supposons alors qu'on ne connaisse pas la longueur $$n$$ de la clef. Pour la deviner on procède comme suit:

- Découpee le texte chiffré en $$n$$ textes comme auparavant.
- Si on a deviné la bonne longueur, chaque texte est le chiffré de César d'une portion d'un texte français, il a donc un indice de coïncidence proche de 0.077.
- Si on n'a pas deviné la bonne longueur, on s'attend à un texte proche de l'aléatoire, et donc avec un indice proche de $$1/26$$.

On appliquant cette méthode à des $$n$$ de plus en plus grands, on s'arrête lorsqu'on rencontre un $$n$$ qui donne les bons indices de coïncidence.


### À vos `javac`

4. Modifier votre programme pour qu'il devine la longueur de la clef tout seul.


## Soumettre votre devoir

Envoyez votre code source, ainsi que le texte décrypté à l’aide de la boîte de dépot sur e-campus 2 (si e-campus ne devait pas marcher, envoyez-les directement par mail à votre enseignant). La date limite pour envoyer vos fichiers est le mercredi 11 avril à 4h du matin. Un point de pénalité pour chaque heure de retard: le 11 avril à 23h59 c’est votre dernière chance !
