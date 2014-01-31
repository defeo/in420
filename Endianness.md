---
layout: post
title: Endiannes
---

*Endiannes* est un mot anglais qui indique, de façon générale, l'ordre dans lequel des *unités élémentaires* formant un *bloc de données* sont stockées en mémoire. Le mot est le plus souvent utilisé pour parler de l'ordre des octets au sein d'un type de données tenant sur plusieurs octets (par exemple un `int`). D'autres utilisations du mot sont possibles, par exemple pour indiquer l'ordres des bits au sein d'un octet.

On distingue deux endianness: la *little endian* et la *big endian*. Dans le cas des octets, un système *little endian* stocke les octets *de poids faible* d'abord, un système *big endian* stocke les octets de *poids fort* d'abord.


## Exemple : endianness des octets

Sur une machine 32 bits un `int` occupe 4 octets, numérotés de 0 jusqu'à 3. Un système *little endian* qui doit écrire un entier en mémoire stockera les 8 bits de poids faible dans le premier octet, les 8 bits suivants dans le deuxième et ainsi de suite. Un système *big endian* fera le choix opposé.

Par exemple, l'entier 305419896 (`0x12345678` en base 16) est composé des octets `0x12`, `0x34`, `0x56` et `0x78` (du poids fort au poids faible). Un système little endian le stockera dans 4 octets consécutifs dans l'ordre

~~~
0x78  0x56  0x34  0x12
~~~

un système big endian stockera le même entier dans 4 octets consécutifs dans l'ordre

~~~
0x12  0x34  0x56  0x78
~~~

L'endianness ne s'applique pas seulement aux types de données numériques. Les encodages [UCS-2](UTF-16) et [UTF-16](UTF-16) de Unicode sont aussi dépendants de l'endianness.

Même si normalement on n'a pas à se soucier de l'endianness du système, ceci a une importance capitale lorsque on écrit ou on lit des données tenant sur plusieurs octets dans un fichier en mode binaire: un fichier encodé sur une machine little endian qui serait ensuite lu par une machine big endian risquerait presque sûrement d'être corrompu.

Les ordinateurs de type x86 et x86-64 (les plus répandus dans le marché grand public) utilisent l'architecture little endian.


## Exemple : endianness des bits

Il est bien plus rare de parler d'endiannes des bits au sein d'un octet. Remarquez qu'il ne fait pas de sens de parler de systèmes *little endian* ou *big endian* au niveau des bits : en effet, en C et dans la majorité des autres langages, toutes les opérations d'accès aux bits sont exprimées relativement aux poids de ceux-ci, plutôt que par rapport à un ordre externe.

On peut tout de même être amenés à devoir choisir une convention de type little ou big endian lorsque l'on encode dans des octets des données dont les frontières ne correspondent pas avec ceux-ci. C'est le cas, par exemple, lorsqu'on applique un codage binaire comme le [Codage de Huffman](Codage de Huffman) ou [de Hamming](Codes correcteurs d'erreurs).

Par exemple, le texte ASCII

~~~
huffman
~~~

correspond aux octets

~~~
0x68 0x75 0x66 0x66 0x6d 0x61 0x6e
~~~

Lorsque ce texte est converti en un flux de bits, un encodage little endian écrit d'abord les bits de poids faible, ensuite ceux de poids fort, ce qui donne lieux au flux

~~~
00010110.10101110.01100110.01100110.10110110.10000110.01110110
~~~

(les points ont été ajoutés pour faciliter la lecture).

Au contraire, un encodage big endian écrit chaque bloc de 8 bits à l'envers:

~~~
01101000.01110101.01100110.01100110.01101101.01100001.01101110
~~~

