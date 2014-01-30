---
layout: post
title: Cryptographie classique
---

Par *cryptographie classique* l'on entend tous les systèmes cryptographiques (principalement des systèmes symétriques) qui étaient en usage avant l'introduction de l'ordinateur. La deuxième guerre mondiale est souvent considérée comme le dernier age d'or de la cryptographie classique: elle aura vu la naissance de la cryptographie électro-mécanique et le succès des services secrets britanniques, où travaillait [Alan Turing](http://fr.wikipedia.org/wiki/Alan_Turing), dans le cassage du système allemand ENIGMA.

## Chiffrement monoalphabétique

Les systèmes de chiffrement monoalphabétique remplacent chaque caractère du texte clair avec un nouveau caractère. La table de substitution des caractères constitue la clef secrète.

Suétone nous rapporte que César aurait utilisé un système monoalphabétique par décalage pour chiffrer ses messages. Un autre système classique de chiffrement monoalphabétique est le *chiffre affine*.

Les systèmes monoalphabétiques souffrent d'une faille majeure: un symbole du texte clair est toujours envoyé sur le même symbole dans le texte chiffré. Ceci rend les systèmes monoalphabétiques vulnérables à la cryptanalyse par analyse statistique.

## Chiffrement polyalphabétique

Les chiffrements polyalphabétiques sont une généralisation des systèms monoalphabétiques. Comme pour les monoalphabétiques, chaque symbole du texte clair est remplacé par un nouveau symbole dans le texte chiffré, mais cette fois-ci la table de substitution pour chaque caractère va dépendre de la position de celui-ci dans le texte.

L'exemple le plus connu de système polyalphabétique est le système de Vigenère. Longtemps considéré incassable, il est extrêmement vulnérable aux attaques par analyse statistique: on trouve d'abord la longueur de la clef à l'aide de la [méthode de Kasinski-Friedman](Cryptanalyse de Vigenère), ensuite on considère les parties du texte clair qui correspondent à chacun des symboles de la clef et on les attaque par analyse statistique.

Un autre système qui peut-être considéré polyalphabétique est le chiffre de Vernam, aussi appelé *one-time pad*. Shannon a montré qu'il s'agit du seul système de chiffrement qui garantit une **sécurité inconditionnelle**. Cependant il n'est pas aisé à réaliser en pratique et des erreurs de mise en ouvre mènent facilement à des attaques (comme il a été le cas au cours de la deuxième guerre mondiale).

## Chiffrement par permutation

Les systèmes de chiffrement par permutation fonctionnent en changeant la position des symboles dans le texte original. La clef secrète est la permutation choisie. Les chiffres par permutation sont vulnérables aux attaques par clairs choisis.


### Chiffre de Hill

Le chiffre de Hill constitue une généralisation des chiffres par permutation. On représente l'alphabet du clair et du chiffré par un anneau d'entiers modulaires $$\mathbb{Z}/m\mathbb{Z}$$, par exemple l'alphabet latin est représenté par l'anneau $$\mathbb{Z}/26\mathbb{Z}$$. La clef secrète est une matrice inversible $$n\times n$$ à coefficients dans $$\mathbb{Z}/m\mathbb{Z}$$. Chaque bloc de longueur $$n$$ du texte clair est chiffré en faisant un produit matrice-vecteur avec la clef secrète. Le déchiffrement se fait de la même façon en utilisant la matrice inverse.

Les systèmes par permutation constituent le cas particulier du chiffre de Hill où la clef secrète est une matrice de permutation. Le système de Hill est aussi vulnérable aux attaques par clairs choisis.


## Bibliographie

D. Stinson. *Cryptographie -- Théorie et pratique*.
:   2e édition. Vuibert, Paris, 2003. ISBN: 2–7117–4800–6. Chapitre 1.

J. A. Buchmann. *Introduction à la cryptographie*.
:   2e édition. Dunod, 2006. ISBN 2–10–049622–0. Côte BU: 005.82 BUC. Les sections 3.10--3.14 contiennent des rappels et des exercices sur les systèmes affine, de Vigènere et de Hill.