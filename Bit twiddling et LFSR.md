---
layout: post
title: Bit twiddling et LFSR
---

## Rappels sur les bases 2 et 16

1. Convertir les entiers suivants en binaire:

   $$(8001)_{16},\quad(ffff)_{16},\quad(a091)_{16}.$$

2. Convertir les entiers suivants en hexadécimal:

   $$(1010110001)_2,\quad(11111)_2,\quad(10000)_2.$$

3. Sans faire le calcul, écrire $$2^{13}$$ en base $$16$$.
4. Sans passer par la base $$10$$, écrire $$(100010)_2\cdot 16$$ en binaire.
5. Sans passer par la base $$10$$, écrire $$(800)_{16}\cdot 8$$ en hexadécimal.
6. Calculer le *et*, le *ou* et le *xor* bit-par-bit de $$(ae)_{16}$$ et
$$(71)_{16}$$.

## LFSR

Nous allons maintenant comparer les deux techniques principales pour
réaliser un LFSR: le LFSR de Fibonacci et celui de Galois.

Créez le fichier suivant

~~~
public class LFSR {
    char etat;
    char taps;
    
    public LFSR(char etat, char taps) {
    }
    
    int parite(int masque) {
        return 0;
    }

    static String bin(int registres) {
        return String.format("%16s",
                             Integer.toBinaryString(registres)).replace(" ",
                                                                        "0");
    }

    public String fibonacci(int combien) {
        return null;
    }

    public String galois(int combien) {
        return null;
    }

    public static void main(String args[]) {
    }
}
~~~

1. Écrivez le `main`. Il doit prendre quatre arguments sur la ligne de
    commande, dont deux obligatoires:

    - Un entier en base hexadécimale, indiquant les *taps*. Voici
      comment transformer une chaîne de caractères hexadécimales (de
      longeur au plus 4) en `char`:
	  
	  ~~~
	  char taps = (char)Integer.parseInt(args[0], 16);
	  ~~~

    - Un entier donnant la longueur de la séquence que l'on souhaite
      générer (pour transformer une chaîne en `int`,
      [`Integer.parseInt`](http://docs.oracle.com/javase/6/docs/api/java/lang/Integer.html#parseInt%28java.lang.String%29)).

    - Une *graine* pour initialiser l'état du générateur (utilisez à
      nouveau
      [`Integer.parseInt`](http://docs.oracle.com/javase/6/docs/api/java/lang/Integer.html#parseInt%28java.lang.String%29));
      à défaut, la *graine* vaudra 1.

    - Un mot clé pour choisir le mode opératoire (Fibonacci ou
      Galois); à défaut, Fibonacci.
    
    Après avoir lu les arguments, le `main` crée un objet de type
    LFSR, appelle sa méthode `fibonacci` ou `galois` et en affiche la
    sortie.

2. Écrivez le constructeur, qui se limite à copier ses arguments dans
les attributs de l'objet.

Testez votre programme (ajouter des affichages vous aidera à voir s'il
marche bien). La méthode `bin` vous aide à debugger votre programme:
par exemple, vous pouvez appeler

~~~
System.out.println(bin(etat));
~~~

Pour afficher le contenu de la variable `etat` exprimé en binaire.


### LFSR de Fibonacci

On rappelle la structure d'un LFSR de Fibonacci.

![](http://upload.wikimedia.org/wikipedia/commons/1/16/LFSR-F16.gif)

Des registres binaires (16 dans la figure) sont connectés en série de
la gauche vers la droite. Parmi ces registres, certains registres,
appelés *taps*, sont sélectionnés pour effectuer la rétroaction (le
*feedback*): dans la figure ce sont les registres 11, 13, 14 et 16.

À chaque cycle, les bits contenus dans les *taps* sont *XORés*
ensemble pour former un nouveau bit qui va entrer à gauche; tous les
bits sont décalés vers la droite et le bit le plus à la droite sort
pour s'ajouter à la séquence pseudo-aléatoire.

Nous allons implanter un générateur avec un état constitué de 16
bits. Les 16 bits seront stockés dans un seul `char` (qui en java est
un type de 2 bytes), qu'on va traiter comme des bits bruts plutôt que
comme un caractère.

3. Écrivez la méthode `parite` qui compte si l'expression binaire d'un
`char` contient un nombre pair ou impair de 1. Vous devez pouvoir vous
en sortir en trois lignes avec une boucle `for` et les opérateurs sur
les bits ci-dessous.

4. Écrivez la méthode `fibonacci`. Elle doit renvoyer (j'ai bien dit
*renvoyer*, et non pas *afficher*) une chaîne de caractères de
longueur `combien` générée par le LFSR. Utilisez la fonction `parite`
pour calculer le bit qui entre sur la gauche.

Voici un rappel des opérateurs sur les bits qui peuvent vous être
utiles. On donne les exemples sur les entiers, mais elles marchent
aussi bien sur les `char` sans besoin de *casts*.

|-----------|----------|-------
| Opération | Résultat | Effet
|-----------|----------|-------
| `3 >> 1`  |  `1`     | décalage vers la droite, équivalent à `3 / 2`.
|-----------|----------|-------
| `3 << 1`  |  `6`     | décalage vers la gauche, équivalent à `3 * 2`.
|-----------|----------|-------
| `3 & 2`   |  `2`     | *et* bit-par-bit, le résultat aura des 1
|           |          | seulement aux positions où les deux opérands
|           |          | ont un 1.
|-----------|----------|-------
| `3 | 2`   |  `3`     | *ou* bit-par-bit, le résultat aura des 1
|           |          | aux positions où l'un des deux opérands a un
|           |          | 1.
|-----------|----------|-------
| `3 ^ 2`   |  `1`     | *xor* bit-par-bit, le résultat aura des 1
|           |          | aux positions où *exactement* un des deux
|           |          | opérands a un 1.
|-----------|----------|-------
| `~2`      |  `1`     |  négation bit-par-bit, les 0 et les 1 de
|           |          |  l'opérand sont inversés
|-----------|----------|-------

Testez votre fonction, aidez vous avec des affichages.


### LFSR de Galois

Les LFSR de Galois marchent de façon opposée à ceux de Fibonacci.

![](http://upload.wikimedia.org/wikipedia/commons/3/3f/LFSR-G16.gif)

À chaque itération le bit sortant est celui tout à gauche. Ce même bit
est réinjecte dans les registres de *tap* en le *XORant* avec le bit
qui précède le registre.

5. Implantez la méthode `galois`. Cette fois-ci, vous n'avez pas
besoin de faire appel à `parite`.

6. Laquelle des deux méthodes est plus efficace? Pourquoi?


### Solution

Voici une solution complète. Essayez de compléter le TD avant de la regarder.

~~~
public class LFSR {           // cliquez ici pour voir la solution
    char etat;
    char taps;
        
    public LFSR(char etat, char taps) {
        this.etat = etat;
        this.taps = taps;
    }
        
    static int parite(int masque) {
        int p = 0;
        for ( ; masque > 0 ; masque >>>= 1)
            p ^= masque & 1;
        return p;
    }

    static String bin(int registres) {
        return String.format("%16s",
                             Integer.toBinaryString(registres)).replace(" ",
                                                                        "0");
    }

    public String fibonacci(int combien) {
        String alea = "";
        for (int i = 0 ; i < combien ; i++) {
            System.out.println("Debug info: etat = " + bin(this.etat));
            int bit = this.parite(this.etat & this.taps);
            alea += this.etat & 1;
            this.etat >>= 1;
            this.etat |= bit << 15;
        }
        return alea;
    }

    public String galois(int combien) {
        String alea = "";
        for (int i = 0 ; i < combien ; i++) {
            System.out.println("Debug info: etat = " + bin(this.etat));
            int bit = this.etat & 1;
            alea += bit;
            this.etat >>= 1;
            if (bit == 1)
                this.etat ^= this.taps;
        }
        return alea;
    }

    public static void main(String args[]) {
        if (args.length < 2) {
            System.out.println("Pas assez d'arguments");
            System.exit(0);
        }
        
        char taps = (char)Integer.parseInt(args[0], 16);
        int combien = Integer.parseInt(args[1]);
        
        char graine = 1;
        if (args.length >= 3) {
            graine = (char)Integer.parseInt(args[2], 16);
        }

        LFSR lfsr = new LFSR(graine, taps);
        
        System.out.println("Debug info: taps = " + bin(taps));
        System.out.println();

        if (args.length < 4 || !args[3].equals("galois"))
            System.out.println("\n" + lfsr.fibonacci(combien));
        else
            System.out.println("\n" + lfsr.galois(combien));
    }
}
~~~
{: .collapsible .collapsed}
