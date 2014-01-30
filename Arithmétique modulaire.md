---
layout: post
title: Arithmétique modulaire
---

Nous avons déjà vu des exemples d'entiers modulaires au cours des
séances de TD précédentes. Par exemple, nous avons travaillé avec les
anneaux $$\mathbb{Z}/26\mathbb{Z}$$ et $$\mathbb{Z}/10\mathbb{Z}$$
lorsque nous avons étudié le
[chiffre de Hill](Algèbre linéaire et chiffre de Hill)
et le [chiffre VIC](DM1 - Chiffre VIC), et avec
le corps $$\mathbb{F}_2\simeq\mathbb{Z}/2\mathbb{Z}$$ lorsque nous
avons étudié les [Codes linéaires](Codes linéaires).

Nous allons maintenant étudier plus en profondeur l'arithmétique des
entiers modulaires $$\mathbb{Z}/n\mathbb{Z}$$ pour un $$n$$ quelconque.


## Structure additive

1. Lesquelles des égalités suivantes sont vraies? Lesquelles sont fausses?

    $$6 = 4 \mod 2,\quad
     5 = -5 \mod 12,\quad
     11 = -2 \mod 13,\quad
     24 = 0 \mod 12.$$

2. Calculer les produits suivants

    $$3\cdot 3 \mod 7,\quad
    -1\cdot 9 \mod 5,\quad
    14\cdot 12 \mod 15.$$

3. Calculer les tables d'addition et de multiplication de
$$\mathbb{Z}/6\mathbb{Z}$$.

Jusqu'ici on s'est largement servi des propriétés de
$$\mathbb{Z}/n\mathbb{Z}$$ sans les démontrer: le moment est arrivé de
vérifier que nos calculs sont bien fondés.

4. Soit $$n$$ un entier quelconque, montrer les deux propriétés
    suivantes:

    - Si $$a = b \mod n$$ alors pour tout entier $$c$$ on a $$a+c = b+c \mod n$$,
    - Si $$a = b \mod n$$ alors pour tout entier $$c$$ on a $$ac = bc \mod n$$.


## Structure multiplicative

Voici la table de multiplication de $$\mathbb{Z}/15\mathbb{Z}$$. À
partir de maintenant on va arrêter d'écrire $$\mod n$$ partout:
lorsque le module est clair du contexte, on se contentera d'écrire
$$6+8=-1$$, plutôt que $$6 + 8 = -1 \mod 15$$.

|  |  0|  1|  2|  3|  4|  5|  6|  7|  8|  9| 10| 11| 12| 13| 14
|--|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---
| 0|  0|  0|  0|  0|  0|  0|  0|  0|  0|  0|  0|  0|  0|  0|  0
| 1|  0|  1|  2|  3|  4|  5|  6|  7|  8|  9| 10| 11| 12| 13| 14
| 2|  0|  2|  4|  6|  8| 10| 12| 14|  1|  3|  5|  7|  9| 11| 13
| 3|  0|  3|  6|  9| 12|  0|  3|  6|  9| 12|  0|  3|  6|  9| 12
| 4|  0|  4|  8| 12|  1|  5|  9| 13|  2|  6| 10| 14|  3|  7| 11
| 5|  0|  5| 10|  0|  5| 10|  0|  5| 10|  0|  5| 10|  0|  5| 10
| 6|  0|  6| 12|  3|  9|  0|  6| 12|  3|  9|  0|  6| 12|  3|  9
| 7|  0|  7| 14|  6| 13|  5| 12|  4| 11|  3| 10|  2|  9|  1|  8
| 8|  0|  8|  1|  9|  2| 10|  3| 11|  4| 12|  5| 13|  6| 14|  7
| 9|  0|  9|  3| 12|  6|  0|  9|  3| 12|  6|  0|  9|  3| 12|  6
|10|  0| 10|  5|  0| 10|  5|  0| 10|  5|  0| 10|  5|  0| 10|  5
|11|  0| 11|  7|  3| 14| 10|  6|  2| 13|  9|  5|  1| 12|  8|  4
|12|  0| 12|  9|  6|  3|  0| 12|  9|  6|  3|  0| 12|  9|  6|  3
|13|  0| 13| 11|  9|  7|  5|  3|  1| 14| 12| 10|  8|  6|  4|  2
|14|  0| 14| 13| 12| 11| 10|  9|  8|  7|  6|  5|  4|  3|  2|  1
{: .mul-table .centered}
<style>
.mul-table {text-align: right}
.mul-table th {border-bottom: solid thin black; font-weight: bold}
.mul-table td:first-child, .mul-table th:first-child {border-right: solid thin black; font-weight: bold}
.mul-table td, .mul-table th {padding: 0.1ex 1ex}
</style>


5. Quel est l'inverse (multiplicatif) de 2, 4, 7?

6. Trouver un élément qui n'a pas d'inverse multiplicatif.

7. Combien d'éléments contient $$(\mathbb{Z}/15\mathbb{Z})^*$$ (le
groupe des éléments inversibles de $$\mathbb{Z}/15\mathbb{Z}$$)?

8. Calculer $$3^3$$, $$5^4$$ et $$2^7$$.

Pour tout élément inversible $$a\in(\mathbb{Z}/15\mathbb{Z})^*$$, on
définit son **ordre** comme la plus petite puissance $$x$$ telle que
$$a^x=1$$.

9. Quel est l'ordre de 2? de 13?

10. Sans écrire de table de multiplication, calculer l'ordre de
$$5\mod 11$$. Calculer $$5^{1234}\mod 11$$.


## Un peu d'algorithmique

Pas de squelette pré-remplie, cette fois-ci: ces programmes sont trop simples!

### Exponentiation binaire

11. Écrivez un programme qui prend en entrée trois entiers $$a$$, $$x$$ et
$$n$$ et qui calcule $$a^x\mod n$$. Ne vous servez pas de la fonction
`Math.pow` (ou de toute autre fonction de librairie Java).

12. Calculez la complexité de votre algorithme: à $$a$$ et $$n$$ fixés,
combien de multiplications fait-il?

Sans doute, vous avez utilisé une boucle `for` pour résoudre le point
précédent, ce qui vous a donné un algorithme de complexité
*linéaire*. On peut faire beaucoup mieux en utilisant l'exponentiation
binaire.

L'idée de l'exponentiation binaire consiste à écrire $$x$$ en base 2 et
à utiliser les propriétés des puissances. Vous avez déjà appliqué cet
algorithme de façon intuitive lorsque vous avez fait des calculs à la
main, par exemple:

$$a^{11} = a^{(1011)_2} = a^{8 + 2 + 1} = a^8 a^2 a^1.$$

Plutôt que faire 14 multiplications, vous n'avez donc qu'à calculer
les éléments suivants (trois multiplications):

- $$a$$,
- $$a^2$$,
- $$a^4 = (a^2)^2$$,
- $$a^8 = (a^4)^2$$,

et à multiplier entre eux ceux qui apparaissent dans le produit (deux multiplications, dans ce cas).

Plus généralement, l'algorithme d'exponentiation binaire
*gauche-droite* calcule $$a^x$$ de la façon suivante:

- Si $$x = 2y+1$$ alors
    - calculer $$a^y$$,
    - $$a^x \leftarrow (a^y)^2 a$$;
- Sinon $$x = 2y$$
    - calculer $$a^y$$,
    - $$a^x \leftarrow (a^y)^2$$.

>

13. Écrivez l'algorithme d'exponentiation binaire en utilisant une
fonction récursive.

14. Transformez l'algorithme précédent en un algorithme itératif
(i.e. pas d'appel récursif, mais une boucle `for` ou `while` à la
place).

15. Quelle est la complexité des deux algorithmes?


### Calcul d'ordre naïf

On ne connaît pas d'algorithme vraiment efficace pour calculer l'ordre
d'un élément $$a\in(\mathbb{Z}/n\mathbb{Z})^*$$. Une méthode vraiment
(trop) simple consiste à énumérer toutes les puissances $$a^1$$, $$a^2$$,
$$a^3$$, ... jusqu'à trouver un $$x$$ tel que $$a^x=1$$.

16. Écrivez un programme qui prend en entrée deux entiers $$a$$ et $$n$$
et qui calcule l'ordre de $$a$$ modulo $$n$$. Quelle est sa complexité?
