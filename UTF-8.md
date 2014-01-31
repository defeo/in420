---
layout: post
title: UTF-8
---

UTF-8 est un standard de codage de Unicode, successeur de
[UTF-16](UTF-16). À la différence de [UTF-16](UTF-16) il encode les
symboles Unicode sur 1, 2, 3 ou 4 octets, et il est compatible en
arrière avec ASCII-7. Le fait que les caractères du jeu ASCII-7 soient
encodés sur un seul octet, donne à UTF-8 un pouvoir de compression
bien supérieur à [UTF-16](UTF-16).

## Encodage

L'encodage de UTF-8 est résumé par le tableau suivant.

|[Code point](UTF-16)       | bits| Octet 1  | Octet 2  | Octet 3  | Octet 4  | Octet 5  | Octet 6
|--------
|`U+0000` -- `U+007F`       | 7   | 0xxxxxxx
|`U+0080` -- `U+07FF`       | 11  | 110xxxxx | 10xxxxxx
|`U+0800` -- `U+FFFF`       | 16  | 1110xxxx | 10xxxxxx | 10xxxxxx
|`U+10000` -- `U+1FFFFF`    | 21  | 11110xxx | 10xxxxxx | 10xxxxxx | 10xxxxxx
|`U+200000` -- `U+3FFFFFF`  | 26  | 111110xx | 10xxxxxx | 10xxxxxx | 10xxxxxx | 10xxxxxx
|`U+4000000` -- `U+7FFFFFFF`| 31  | 1111110x | 10xxxxxx | 10xxxxxx | 10xxxxxx | 10xxxxxx | 10xxxxxx
{:.centered}

En vrai, le plus grand [code point](UTF-16) UTF-8 est `U+10FFFF`, par conséquent les deux dernières lignes du tableau ne sont jamais utilisées par UTF-8, et tous les symboles encodés par UTF-8 tiennent sur au plus 4 octets.

#### Algorithme

Le tableau s'utilise de la façon suivante:

- On repère dans la colonne de gauche à quelle plage correspond le [code point](UTF-16) du symbole que l'on souhaite encoder.
- On écrit le code point en binaire sur autant de bits qu'indiqué dans la colonne suivante, éventuellement en ajoutant des 0 à gauche.
- On remplace les 'x' des colonnes suivantes par les bits calculés au point précédent, du plus significatif au moins significatif.

On remarque que:

1. Les code points dans la plage `U+0000` -- `U+00FF` sont encodés par les propre code point sur un octet. Ce sont les caractères du jeu ASCII 7, ce qui garantit la compatibilité en arrière de UTF-8 : tout fichier ASCII-7 valide est aussi un fichier UTF-8 valide contenant les mêmes symboles, et inversement tout fichier UTF-8 ne contenant que des symboles dans cette plage est un fichier ASCII valide.

2. Les octets qui commencent par 1 font partie d'un symbole encodé sur plusieurs octets.

3. Les octets qui commencent par 10 sont les octets du milieu d'un symbole encodé sur plusieurs octets

4. Le nombre de 1 précédent le 0 d'un octet ne commençant ni par 0 ni par 10 est égal au nombre d'octets sur lesquels est encodé le symbole UTF-8 contenant l'octet.

Les trois dernières propriétés font de UTF-8 un code instantané: tout octet provenant du milieu d'un flux UTF-8 peut immédiatement être reconnu comme étant le début ou non d'un symbole Unicode.
