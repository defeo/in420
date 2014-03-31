---
layout: post
title: Chiffre VIC
---

Le chiffre VIC, utilisé par les espions russes pendant la guerre
froide, est probablement le cryptosystème classique le plus avancé qui
ait jamais été conçu. Avant la défection en '57 de l'agent russe
d'origine finnoise Reino Häyhänen, tous les efforts de la NSA pour le
cryptanalyser ont été infructueux.

Vous allez réaliser en Java une version simplifiée du chiffre VIC qui
utilise certains de ses concepts fondamentaux.


## Échiquier à diffusion

Une des faiblesses principales des systèmes de chiffrement par
substitution est leur vulnérabilité aux attaques statistiques. En
effet, aussi bien dans les chiffres monoalphabétiques que dans les
variantes de Vigenère, les lettres du texte chiffré héritent les
fréquence d'apparition des lettres du texte clair.

L'*échiquier à diffusion* est un raffinement du *carré de Polybe* qui
sert à encoder un message en une suite de chiffres décimaux tout en
réduisant les biais statistiques dus à l'usage des lettres les plus
fréquentes.

Un échiquier à diffusion est un tableau de 3 lignes et 10 colonnes. La
première ligne contient les 8 lettres les plus fréquentes (RUSTINEA en
français) et deux cases blanches dans un ordre arbitraire
(éventuellement secret). Les deux autres lignes contiennent le reste
de l'alphabet, plus deux caractères à usage spécial (par exemple le
point et l'apostrophe).

Voici un exemple d'échiquier à diffusion

|     |  0|  1|  2|  3|  4|  5|  6|  7|  8|  9|
|---------------------------------------------|
|     |  T|  A|   |  R|  U|  I|  N|  E|   |  S|
|**2**|  B|  C|  D|  F|  G|  H|  J|  K|  L|  M|
|**8**|  O|  .|  P|  Q|  V|  '|  W|  X|  Y|  Z|
{: .vic-table .centered}

<style>
.vic-table td, .vic-table th {padding: 0.1ex 2ex}
</style>


Les deux lignes du bas portent le numéro des colonnes qui
correspondent aux cases vides en première ligne.
 
Pour coder (ou devrait-on dire chiffrer, lorsque l'échiquier est gardé
secret) le message on élimine tous les espaces et les caractères qui
n'apparaissent pas dans le tableau ; ensuite chaque lettre du texte
clair est transformée en :

- Le numéro de la colonne correspondante si la lettre apparaît en
  première ligne: par exemple **N** est codé avec **6** ;
- Le numéro de la ligne suivi du numéro de la colonne si la lettre
  apparaît dans les deux autres lignes: par exemple **Q** est codé
  avec **83**.
  
Pour faire un exemple concret, le texte "ATTAQUER TOUR EIFFEL A
L'AUBE" est codé par le tableau ci-dessus comme suit :

|A|T|T|A|Q|U|E|R|T|O|U|R|E|I|F|F|E|L|A|L|'|A|U|B|E
|1|0|0|1|83|4|7|3|0|80|4|3|7|5|23|23|7|28|1|28|85|1|4|20|7

Ce qui donne le texte encodé : 100183473080437523237281288514207.

Le décodage peut se faire de façon unique car on sait que chaque 2
introduit une lettre sur la deuxième ligne et chaque 8 introduit une
lettre sur la troisième ligne.

## Masquage

Après la phase d'encodage par l'échiquier à diffusion, le chiffre VIC
applique un chiffrement par substitution ou par transposition au texte
encodé.

Dans notre version simplifiée, nous allons appliquer un chiffrement
par substitution similaire au chiffre de Vigenère, la seule différence
étant que l'alphabet contient 10 symboles plutôt que 26. Par exemple,
en supposant que la clef secrète soit 836964, le texte chiffré est
obtenu en additionnant cette clef au texte encodé modulo 10 :

|**encodé**   |1|0|0|1|8|3|4|7|3|0|8|0|4|3|7|5|2|3|2|3|7|2|8|1|2|8|8|5|1|4|2|0|7
|**clef**     |8|3|6|9|6|4|8|3|6|9|6|4|8|3|6|9|6|4|8|3|6|9|6|4|8|3|6|9|6|4|8|3|6
|**chiffré**  |9|3|6|0|4|7|2|0|9|9|4|4|2|6|3|4|8|7|0|6|3|1|4|5|0|1|4|4|7|8|0|3|3

Le décodage se fait de façon analogue. Vous remarquerez que la
cryptanalyse de ce texte est beaucoup plus dure que pour un simple
Vigenère.


## À vos `javac`

1. En utilisant l'échiquier donné ci-dessus, écrivez un programme Java
qui prend en entrée un texte clair/chiffré (en le lisant dans un
fichier, ou de n'importe quelle autre façon) et une clef et qui
affiche le texte chiffré/déchiffré. On vous conseille de vous inspirer
des solutions des TDs pour réaliser les entrées-sorties.

2. Challenge : visitez [cette page](http://it-katas.defeo.lu/katas/vic) et
déchiffrez le texte qui vous est proposé. **ATTENTION:** l'échiquier
de diffusion est différent, par conséquent vous devez soit modifier
votre code pour prendre un échiquier quelconque en entrée (mieux: ça
fait des points bonus), soit changer l'échiquier directement dans
votre code source (moins bien, mais ça ne vous enlèvera pas de
points).

Soumettez votre code source, ainsi que le texte décompressé, dans la
boîte de dépôt sur [e-campus 2](http://e-campus2.uvsq.fr), ou par mail
à votre [enseignant](http://defeo.lu/). Vous avez jusqu’au 7 avril à
20h pour soumettre votre travail. Un point de pénalité pour
chaque heure de retard : le 8 avril à 16h c’est votre dernière
chance !
