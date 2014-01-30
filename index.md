---
layout: index
title: IN420 – Algorithmique pour la cryptographie
---

## IN420 – Algorithmique pour la cryptographie

### Informations pratiques

**Chargé de cours:** Luca De Feo <http://www.prism.uvsq.fr/~dfl>

**Cours magistral:** Mercredi 11h30 - 13h, salle G003

**TDs:** Mardi 13h30 - 16h45, salle G101

**Examens:**

- Prémière session -- 16 mai 2012: [sujet corrigé](examen-12-05-16.pdf)

### Cours

Cours 1 (25/01/2012)
:  Définitions de base, [Chiffres monoalphabétiques](Cryptographie classique).

Cours 2 (01/02/2012)
:  [Chiffres polyalphabétiques](Cryptographie classique).

Cours 3 (08/02/2012)
:  [Chiffrement par permutation](Cryptographie classique), [Chiffre de Hill](Cryptographie classique).

Cours 4 (15/02/2012)
:  Réseaux de permutation-substituion, [Chiffrement par flot](Chiffrement par flot).

Cours 5 (22/02/2012)
:  Modes opératoires, [Codes correcteurs d'erreurs](Codes correcteurs d'erreurs).

Cours 6 (07/03/2012)
:  [Codes linéaires](Codes correcteurs d'erreurs).

Cours 7 (14/03/2012)
:  [Codes de Hamming](Codes correcteurs d'erreurs), [Décodage par syndrome](Codes correcteurs d'erreurs).

Cours 8 (21/03/2012)
:  [Décodage par syndrome](Codes correcteurs d'erreurs), [Échange de clef de Diffie-Hellman](Cryptographie asymétrique).

Cours 9 (28/03/2012)
:  [Arithmétique modulaire](Cryptographie asymétrique), [Algorithme d'Euclide](Cryptographie asymétrique).

Cours 10 (04/04/2012)
:  [Algorithme d'Euclide](Cryptographie asymétrique), [RSA](Cryptographie asymétrique).

Cours 11 (18/04/2012)
:  [Test de Miller-Rabin](Cryptographie asymétrique), [Théorème des restes chinois](Cryptographie asymétrique).

Cours 12 (02/05/2012)
:  Cryptosystème de McEliece.

### TDs

TD 1 (31/01/2012)
:  [Cryptanalyse des chiffres monoalphabétiques](Cryptanalyse des chiffres monoalphabétiques).

TD 2 (07/02/2012)
:  [Cryptanalyse de Vigenère](Cryptanalyse de Vigenère).

TD 3 (14/02/2012)
:  [Algèbre linéaire et chiffre de Hill](Algèbre linéaire et chiffre de Hill).

TD 4 (21/02/2012)
:  [Bit twiddling et LFSR](Bit twiddling et LFSR).

TD 5 (06/03/2012)
:  [Codes linéaires](Codes linéaires).

TD 6 (13/03/2012)
:  [Codes linéaires](Codes linéaires).

TD 7 (20/03/2012)
:  [Codes linéaires](Codes linéaires).

TD 8 (27/03/2012)
:  [Arithmétique modulaire](Arithmétique modulaire).

TD 9 (03/04/2012)
:  [Torus Wars](Torus Wars).

TD 10 (10/04/2012)
:  [RSA](RSA).

TD 11 (17/04/2012)
:  [RSA](RSA).

TD 12 (09/05/2012)
:  [Révision examen](TD12.pdf)

### Devoirs maison

DM 1 (à rendre le 29/02/2012)
:  [Chiffre VIC](DM1 - Chiffre VIC), avec son [challenge](http://swift.prism.uvsq.fr:2401/in420-dms.py/vic).

DM 2 (à rendre le 04/04/2012)
:  [Décodage par syndrome](DM2 - Décodage par syndrome), avec son [challenge](http://swift.prism.uvsq.fr:2401/in420-dms.py/syndrome).

DM 3  (à rendre le 03/05/2012)
:  [Test de Miller-Rabin](DM3 - Test de Miller-Rabin), avec son [challenge](http://swift.prism.uvsq.fr:2401/in420-dms.py/primes).

### Bibliographie essentielle.

Travaillez ces chapitres, et vous validerez le cours sans problèmes.

- [Cryptographie classique](Cryptographie classique), [LFSR](Chiffrement par flot): **D. Stinson**. *Cryptographie -- Théorie et pratique*. Chapitre 1.
- [Codes correcteurs d'erreurs](Codes correcteurs d'erreurs): **B. Martin**. *Codage, cryptologie et applications*. Chapitres 3-5.
- [Cryptographie asymétrique](Cryptographie asymétrique): **J. A. Buchmann**. *Introduction à la cryptographie*. Chapitre 8.
- [Arithmétique modulaire](Cryptographie asymétrique): **J. Vélu**. *Méthodes Mathématiques pour l'Informatique*. Chapitres 15-16, vous pouvez sauter la section 16.2.

Vous pouvez retrouver ces références à la BU (voir [ci-dessous](#bibliographie)). Allez aussi voir [cette page](http://swift.prism.uvsq.fr:2401/in420.py/biblio).


### Pages utiles

- [Entrées-Sorties en Java](Entrées-Sorties en Java).


### Liens

-   Les APIs Java: <http://docs.oracle.com/javase/6/docs/api/>
-   Les machines virtuelles: <http://www.prism.uvsq.fr/~qst/VM/>


### Bibliographie

Ces références concernent la cryptographie, les codes et les algorithmes.

D. Stinson. *Cryptographie -- Théorie et pratique*.
:   2^e^ édition. Vuibert, Paris, 2003. ISBN: 2-7117-4800-6. Côte BU: 005.82 STI. Ouvrage d'introduction à la cryptographie, d'un niveau tout à fait adapté à la licence. Une bonne partie du cours se base sur ce livre.

B. Martin. *Codage, cryptologie et applications*.
:   Presse polytechniques et universitaires romandes. ISBN: 2-88074-569-1. Côte BU: 005.82 MAR. Autre ouvrage d'introduction couvrant une bonne partie du cours. Les leçons sur les codes correcteurs suivent de près de ce livre.

*Cryptographie & codes secrets*.
:   Éditions POLE, 2006. Hors-Série Tangente 26. ISSN: 09870806. Côte BU: 008.82 CRY. Ouvrage de divulgation non-technique, recouvrant une partie du cours. Surtout les chapitres introductifs sur la cryptographie classique sont assez riches pour être utilisés comme matériel d'étude à la place du Stinson (qui est moins verbeux, mais plus technique).

J. A. Buchmann. *Introduction à la cryptographie*.
:   2^e^ édition. Dunod, 2006. ISBN 2-10-049622-0. Côte BU: 005.82 BUC. Texte d'introduction à la cryptographie pour mathématiciens, avec exercices. Les deux premier chapitres font un panorama complet des algorithmes qu'on utilisera pour la [Cryptographie asymétrique](Cryptographie asymétrique).

-------

Ces références concernent les algorithmes et les mathématiques. On indique les chapitres importants pour le cours.

J. Vélu. *Méthodes Mathématiques pour l'Informatique*.
:   4e édition. Dunod, 2005. ISBN 2-10-049149-0. Côte BU: 004.01 VEL. Chapitres 15 (division, pgcd et nombres premiers) et 16 (entiers modulaires), annexes B (algèbre linéaire) et C (calcul matriciel).

J. Vélu, G. Avérous, I. Gil, F. Santi. *Mathématiques pour l'Informatique*.
:   Dunod 2008. ISBN 978-10-052052-7. Côte BU: 004.01 MAT. Livre d'exercices qui complète la référence précédente.

T. H. Cormen, C. E. Leiserson, R. L. Rivest, X. Cazin *Introduction à l'algorithmique*.
:   Dunod 1994. ISBN 2-10-001933-3. Côte BU: 005.1 COR. Chapitres 28 (algèbre linéaire et calcul matriciel), 31 (arithmétique des entiers) et 34 (NP-complétude). Texte archi-classique, à lire absolument.

T. Brugère, A. Mollard. *Mathématiques à l'usage des informaticiens*.
:   Ellipses, 2003. ISBN 2-7298-1399-3. Côte BU: 004.01. Chapitres 8 (calcul matriciel et algèbre linéaire), 10 (arithmétique des entiers) et 11 (cryptographie). Ce livre se place à un niveau plus élevé que celui de Vélu.

-------

Pour se rafraîchir la mémoire sur java

J. Brondeau. *Introduction à la programmation en Java*.
:   Côte BU: 005.13jav BRO.

-------

Ouvrages de divulgation.

D. Kahn. *The Codebreakers. The Comprehensive History of Secret Communication from Ancient Times to the Internet*.
:   Second edition. Scribner, 1996. ISBN: 978–0684831305. Côte BU 005.82 KAH. Ouvrage de divulgation classique
    sur la cryptographie classique (i.e. jusqu’à la fin de la deuxième
    guerre). Absolument pas un manuel de cours, mais une lecture
    passionnante pour le mordu de crypto. Malheureusement le livre n’a
    jamais été complètement traduit en français, à ma connaissance.

S. Vaudenay. *La fracture cryptographique*.
:   Presses polytechniques et universitaires romandes, 2011. ISBN: 978-2-88074-830-2. Côte BU: 005.82 VAU. Ouvrage non-technique dressant le paysage de techniques cryptographiques modernes. Il contient très peu de maths, très peu de formules et beaucoup d'études de cas. Son contenu est presque complètement disjoint de celui du cours, mais l'étudiant passionné qui souhaite s'orienter vers une spécialisation en sécurité y trouvera des nombreuses informations et pistes de réflexion.
