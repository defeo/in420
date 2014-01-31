---
layout: post
title: Codes linéaires
---

Ce TD, développé sur deux séances, est consacré aux codes correcteurs
d'erreurs linéaires, et aux codes de Hamming en particulier.    

Avant de commencer ce TD vous devez avoir compris les concepts
d'*espace vectoriel* et d'*application linéaires*, en particulier à
coe fficients dans le corps à deux éléments $$\mathbb{F}_2$$. Allez voir
la page [Codes correcteurs d'erreurs](Codes correcteurs d'erreurs)
pour vous rafraîchir la mémoire.


## Codage linéaire

L'idée du codage linéaire est simple: par une application linéaire
injective on envoie un espace de mots binaires dans un espace plus
grand, en espérant que la redondance introduite nous aide à détecter
et corriger les erreurs de transmission.

En pratique, un *code linéaire* est donc représenté par une matrice
$$G$$, dite *matrice génératrice*, de taille $$n\times k$$ avec $$k < n$$,
qui prend des mots de $$\mathbb{F}_2^k$$ et qui renvoie des mots de
$$\mathbb{F}_2^n$$.

Le codage se fait en découpant le message original en blocs de $$k$$
bits, puis en multipliant chaque bloc par la matrice $$G$$, ce qui donne
des mots de code de $$n$$ bits. Le décodage est une autre histoire et
fera l'objet du DM.

### Les éléments de $$\mathbb{F}_2$$

On commence par une classe qui représente ces éléments. Créez le
fichier suivant

~~~
public class Bit {
    /* Constante 0 */
    public static final Bit ZERO = new Bit(0);
    /* Constante 1 */
    public static final Bit ONE = new Bit(1);
    /* Touchez pas aux constantes: elles serviront aux autres classes. */

    public Bit(int value) {
    }

    public String toString() {
        return null;
    }

    public Bit add(Bit other) {
        return null;
    }

    public Bit mul(Bit other) {
        return null;
    }

    public static void main(String args[]) {
        Bit[] bits = {Bit.ZERO, Bit.ONE};
        for (Bit b1 : bits) {
            for (Bit b2 : bits)
                System.out.println(b1 + " + " + b2 + " = " + (b1.add(b2)));
        }
        System.out.println();
        for (Bit b1 : bits) {
            for (Bit b2 : bits)
                System.out.println(b1 + " * " + b2 + " = " + (b1.mul(b2)));
        }
    }
}
~~~

1. Écrivez le constructeur. Vous êtes libres de représenter
    internement un bit comme vous voulez, mais par cohérence il faut
    au moins que `new Bit(0)` crée le bit 0 et `new Bit(1)` crée le
    bit 1.

2. Écrivez la méthode `toString` qui renvoie une chaîne de caractères
   correspondante au bit.
   
3. Écrivez les méthodes `add` et `mul` qui réalisent respectivement
l'addition et la multiplication. 

**Attention:** les méthodes `add` et `mul` **ne doivent pas modifier**
`this` et `other`: leur valeur de retour est **un nouvel objet** de
type `Bit`. De cette façon les objets de type `Bit` sont des objets
*immuables*, comme les `String`, c'est à dire qu'une fois crées ils ne
changent jamais de valeur (du moins tant qu'on se limite aux méthodes
`public`).

Une fois que vous avez terminé d'implanter les méthodes, la sortie du
programme doit être **exactement** la suivante:

~~~
0 + 0 = 0
0 + 1 = 1
1 + 0 = 1
1 + 1 = 0

0 * 0 = 0
0 * 1 = 0
1 * 0 = 0
1 * 1 = 1
~~~


### Les vecteurs de $$\mathbb{F}_2^n$$

Les éléments de $$\mathbb{F}_2^n$$ seront représentés internement par
des tableaux de `Bit`. Voici la classe qui le représente.

~~~
public class BinVector {
    Bit[] bits;

    public BinVector(Bit[] bits) {
        // copie profonde du tableau bits
        // pour garantir l'immuabilite
        this.bits = bits.clone();
    }

    /* Construit un vecteur de bits en extrayant une portion d'un
       tableau d'octets.
       
       bits:   un tableau d'octets d'où tirer les bits;
       start:  le bit (en partant de la gauche) de départ;
       len:    combien de bits il faut lire.
     */
    public BinVector(byte[] bits, int len, int start) {
    }

    public int length() {
    }

    public String toString() {
    }

    /* Addition de vecteurs */
    public BinVector add(BinVector other) throws IllegalArgumentException {
        if (this.length() != other.length()) 
            throw new IllegalArgumentException("Les vecteurs n'ont pas la même longueur.");
        
        return null;
    }

    /* Multiplication par un scalaire */
    public BinVector mul(Bit scalar) {
        return null;
    }

    /* Produit scalaire */
    public Bit scalarProd(BinVector other) throws IllegalArgumentException {
        if (this.length() != other.length()) 
            throw new IllegalArgumentException("Les vecteurs n'ont pas la même longueur.");
        
        return null;
    }

    /* Fonction d'utilite pour transformer une chaine hexadecimale
       en tableau d'octets */
    public static byte[] parseBytes(String hexbytes) {
        byte[] bits = new byte[hexbytes.length() / 2];
        for (int i = 0 ; i < bits.length ; i++)
            bits[i] = (byte)(Integer.parseInt(hexbytes.substring(2*i, 2*i+2), 16));
        return bits;
    }
    
    public static void main(String[] args) {
        // Conversion du premier argument de chaine hexadeciamale
        // vers tableau d'octets
        byte[] bits = parseBytes(args[0]);
        
        // Deux parameteres optionnels: demarrage et longueur
        int len = bits.length * 8;
        int start = 0;
        if (args.length > 1)
            len = Integer.parseInt(args[1]);
        if (args.length > 2)
            start = Integer.parseInt(args[2]);
        
        // Cree et affiche un vecteur de bits
        System.out.println(new BinVector(bits, len, start));
    }
}
~~~

Le `main` vous sera utile pour tester la classe. Il prend trois
arguments, dont un seul obligatoire:

- Un entier hexadécimal qui représente une suite de bits (deux caractères hexadécimaux par octet);
- Un entier décimal qui donne le nombre de bits à lire de la suite;
- Un entier décimal qui donne la position de départ dans la suite.

Ensuite il crée et affiche un `BinVector` à partir de ces
données. Voici quelques exemples de sortie, dès que vous aurez
implanté le constructeur et la méthode `toString` (les `$` ne font pas
partie des commandes).

~~~
$ java BinVector f3
11110011
$ java BinVector f3 6
111100
$ java BinVector f3 6 1
111001
$ java BinVector a52b1c09
10100101001010110001110000001001
~~~

1. Implantez les méthodes `toString` et `length`. Vous n'êtes pas
obligés d'implanter `toString` en sorte que la sortie soit identique à
l'exemple ci-dessus, mais néanmoins cela vous aidera pour la suite.

Remarquez que le constructeur `public BinVector(Bit[] bits)` utilise
la méthode `clone` des tableaux. Cette méthode copie le tableau
élément par élément, plutôt qu'uniquement sa référence. Puisque on a
fait en sorte que `Bit` est un type immuable, ceci nous garantit que
`BinVector` sera aussi immuable (pourvu qu'on respecte le contrat dans
les méthodes suivantes).

2. Implantez le constructeur `public BinVector(byte[] bits, int len,
int start)`. Le constructeur prend un tableau d'octets et en copie
`len` bits à partir de `start`.

3. Implantez les méthodes `add` et `mul`, qui réalisent respectivement
l'addition de vecteurs et la multiplication externe. Comme pour `Bit`
ces méthodes ne doivent pas modifier `this`, `other` et `scalar` car
on veut que `BinVector` soit une classe immuable.

Modifiez les affichages, voire les paramètres, du `main` pour tester
vos méthodes.

Nous introduisons, enfin, une dernière opération fort utile sur les
vecteurs: le *produit scalaire* (ou *multiplication interne*). Le
produit scalaire, souvent noté $$\cdot$$, est une lois
$$\mathbb{F}_2^n\times\mathbb{F}_2^n\to\mathbb{F}_2$$ calculée en
faisant la somme des produits de deux vecteurs composante par
composante. Ainsi

$$\begin{pmatrix}a_1\\a_2\\\vdots\end{pmatrix}\cdot
\begin{pmatrix}b_1\\b_2\\\vdots\end{pmatrix} = a_1 b_1 + a_2 b_2 +
\cdots = \sum_i a_i b_i.$$

4. Implantez la méthode `scalarProd` qui calcule le produit scalaire
de deux vecteurs.


### Les matrices

On arrive enfin aux matrices, qu'on va représenter par des tableaux de
lignes, chaque ligne étant un `BinVector`. Créez la classe suivante.

~~~
public class BinMatrix {
    BinVector[] rows;

    /* Construit une matrice a partir d'un tableau de lignes 
       (chaque ligne est un vecteur colonne). */
    public BinMatrix(BinVector[] rows) throws IllegalArgumentException {
        if (rows.length == 0 || rows[0].length() == 0)
            throw new IllegalArgumentException("Pas de lignes.");
        
        this.rows = new BinVector[rows.length];
        int len = rows[0].length();
        
        for ( int i = 0 ; i < rows.length ; i++ ) {
            if (rows[i].length() != len)
                throw new IllegalArgumentException("Les lignes n'ont pas la meme longueur.");
            this.rows[i] = rows[i];
        }
    }

    /* Nombre de lignes */
    public int rows() {
        return rows.length;
    }
    
    /* Nombre de colonnes */
    public int columns() {
        return rows[0].length();
    }

    public String toString() {
        String res = "";
        for (BinVector r : rows)
            res += r.toString() + "\n";
        return res;
    }

    /* La i-eme ligne de la matrice */
    public BinVector row(int i) {
        return rows[i];
    }

    /* La j-ieme colonne de la matrice */
    public BinVector column(int j) {
        return null;
    }

    /* Matrice transposee */
    public BinMatrix transpose() {
        return null;
    }

    /* Produit matrice-vecteur */
    public BinVector product(BinVector v) throws IllegalArgumentException {
        return null;
    }

    /* Produit matrice-matrice */
    public BinMatrix product(BinMatrix other) throws IllegalArgumentException {
        return null;
    }

    public static void main(String[] args) {
        BinVector[] rows = new BinVector[args.length];
        
        for (int i = 0 ; i < args.length ; i++) {
            byte[] bits = BinVector.parseBytes(args[i]);
            rows[i] = new BinVector(bits, bits.length * 8, 0);
        }
    
        BinMatrix m = new BinMatrix(rows);
        
        System.out.println("Matrice");
        System.out.println(m);
        System.out.println("3eme colonne");
        System.out.println(m.column(2));
        System.out.println("\nTransposee");
        System.out.println(m.transpose());
        System.out.println("Produit matrice par vecteur " + m.row(0).toString());
        System.out.println(m.product(m.row(0)));
        System.out.println("\nProduit matrice par matrice transposee");
        System.out.println(m.product(m.transpose()));
    }
}
~~~

Le constructeur est déjà donné. À nouveau, on repose sur l'immuabilité
de `BinVector` pour garantir l'immuabilité de `BinMatrix`. Le `main`
fait quelques tests simples pour vous aider à vérifier vos méthodes:
il prend autant d'arguments que vous lui donnerez, chaque argument est
interprété comme un entier hexadécimal représentant une ligne d'une
matrice; toutes les lignes doivent avoir la même longueur, bien
sûr. Voici un exemple d'exécution, lorsque vous aurez implanté toutes
les méthodes.

~~~
$ java BinMatrix a1 f0 4d
Matrice
10100001
11110000
01001101

3eme colonne
110

Transposee
110
011
110
010
001
001
000
101

Produit matrice par vecteur 10100001
101

Produit matrice par matrice transposee
101
001
110
~~~

**Suggestion:** en s'y prenant bien et en faisant appel aux méthodes
que vous avez déjà écrit (y compris celles de `BinVector`), chacune
des méthodes suivantes peut être implantée avec une unique boucle
`for` non imbriquée.

1. Pour vous échauffer: implantez la méthode `column` qui renvoye la
j-ème colonne sous forme de `BinVector`.

2. Implantez la méthode `product(BinVector v)` qui renvoye le produit
matrice-vecteur. La méthode ne doit pas modifier `v` et doit renvoyer
un nouveau `BinVector`.

La transposée d'une matrice est la matrice dans laquelle on a échangé
les lignes avec les colonnes. Par exemple, la transposée de 

$$\begin{pmatrix}1&0&1\\1&0&0\\1&1&0\\1&1&1\end{pmatrix}$$

est

$$\begin{pmatrix}1&1&1&1\\0&0&1&1\\1&0&0&1\end{pmatrix}.$$

3. Implantez la méthode `transpose` qui renvoye la matrice
transposée. Comme d'habitude, le résultat doit être une nouvelle
matrice et ne doit pas modifier `this`.

4. Implantez la méthode `product(BinMatrix other)` qui renvoie le
produit matrice-matrice. Si, si, avec les bons appels de méthode vous
pouvez le faire avec une unique boucle `for` non imbriquée!
Garantissez l'immuabilité, comme toujours.


### Mettons toutes les briques ensemble

Créez un programme `Test.java` pour tester vos classes. Par exemple,
le programme pourrait lire des octets d'un fichier et les coder avec
une matrice que vous aurez fixée d'avance. Si vous choisissez une
matrice inversible (ce qui, à proprement parler, n'est pas de la
correction d'erreurs), vous pourrez même tester que votre code marche
bien dans les deux sens. Pour plus d'information sur les
lectures/écritures de fichiers, allez voir
[cette page](Entrées-Sorties en Java).

Et enfin, voici le code complet des trois classes `Bit`, `BinVector`
et `BinMatrix` (sans les méthodes main).

~~~
//                    Cliquez ici pour ouvrir
/**
  Bits
*/
public class Bit {
    public static final Bit ONE = new Bit(1);
    public static final Bit ZERO = new Bit(0);

    byte value;
    
    public Bit(int value) {
        this.value = (byte)value;
    }

    public String toString() {
        if ((value & 1) == 1)
            return "1";
        else 
            return "0";
    }

    public Bit add(Bit other) {
        return new Bit(this.value ^ other.value);
    }

    public Bit mul(Bit other) {
        return new Bit(this.value & other.value);
    }
}



/**
  Vecteurs
*/
public class BinVector {
    Bit[] bits;

    public BinVector(Bit[] bits) {
        this.bits = bits.clone();
    }

    /* Construit un vecteur de bits en extrayant une portion d'un
       tableau d'octets.
       
       bits:   un tableau d'octets d'où tirer les bits;
       start:  le bit (en partant de la gauche) de départ;
       len:    combien de bits il faut lire.
     */
    public BinVector(byte[] bits, int len, int start) {
        this.bits = new Bit[len];
        for (int i = start ; i < len + start ; i++) {
            this.bits[i - start] = new Bit((bits[i / 8] >> (7 - i % 8)) & 1);
        }
    }

    public int length() {
        return this.bits.length;
    }

    public String toString() {
        String res = "";
        for (Bit bit : bits)
            res += bit.toString();
        return res;
    }

    /* Addition de vecteurs */
    public BinVector add(BinVector other) throws IllegalArgumentException {
        if (this.length() != other.length()) 
            throw new IllegalArgumentException("Les vecteurs n'ont pas la même longueur.");

        Bit[] bits = new Bit[this.length()];
        for ( int i = 0 ; i < this.length() ; i++ )
            bits[i] = this.bits[i].add(other.bits[i]);
        return new BinVector(bits);
    }

    /* Multiplication par un scalaire */
    public BinVector mul(Bit scalar) {
        Bit[] bits = new Bit[this.length()];
        for ( int i = 0 ; i < this.length() ; i++ )
            bits[i] = this.bits[i].mul(scalar);
        return new BinVector(bits);
    }

    /* Produit scalaire */
    public Bit scalarProd(BinVector other) throws IllegalArgumentException {
        if (this.length() != other.length()) 
            throw new IllegalArgumentException("Les vecteurs n'ont pas la même longueur.");
        
        Bit res = Bit.ZERO;
        for ( int i = 0 ; i < this.length() ; i++ )
            res = res.add(this.bits[i].mul(other.bits[i]));
        return res;
    }

    /* Fonction d'utilite pour transformer une chaine hexadecimale
       en tableau d'octets */
    public static byte[] parseBytes(String hexbytes) {
        byte[] bits = new byte[hexbytes.length() / 2];
        for (int i = 0 ; i < bits.length ; i++)
            bits[i] = (byte)(Integer.parseInt(hexbytes.substring(2*i, 2*i+2), 16));
        return bits;
    }
}



/**
  Matrices
*/
public class BinMatrix {
    BinVector[] rows;

    /* Construit une matrice a partir d'un tableau de lignes 
       (chaque ligne est un vecteur colonne). */
    public BinMatrix(BinVector[] rows) throws IllegalArgumentException {
        if (rows.length == 0 || rows[0].length() == 0)
            throw new IllegalArgumentException("Pas de lignes.");

        this.rows = new BinVector[rows.length];
        int len = rows[0].length();
        
        for ( int i = 0 ; i < rows.length ; i++ ) {
            if (rows[i].length() != len)
                throw new IllegalArgumentException("Les lignes n'ont pas la meme longueur.");
            this.rows[i] = rows[i];
        }
    }

    public int rows() {
        return rows.length;
    }
    
    public int columns() {
        return rows[0].length();
    }

    public String toString() {
        String res = "";
        for (BinVector r : rows)
            res += r.toString() + "\n";
        return res;
    }

    /* La i-eme ligne de la matrice */
    public BinVector row(int i) {
        return rows[i];
    }

    /* La j-ieme colonne de la matrice */
    public BinVector column(int j) {
        Bit[] column = new Bit[this.rows.length];
        for (int i = 0 ; i < column.length ; i++)
            column[i] = this.rows[i].bits[j];
        return new BinVector(column);
    }

    /* Matrice transposee */
    public BinMatrix transpose() {
        BinVector[] rows = new BinVector[this.columns()];
        
        for (int i = 0 ; i < rows.length ; i++)
            rows[i] = this.column(i);
        
        return new BinMatrix(rows);
    }

    /* Produit matrice-vecteur */
    public BinVector product(BinVector v) throws IllegalArgumentException {
        Bit[] bits = new Bit[this.rows()];
        
        for ( int i = 0 ; i < bits.length ; i++)
            bits[i] = this.rows[i].scalarProd(v);

        return new BinVector(bits);
    }

    /* Produit matrice-matrice */
    public BinMatrix product(BinMatrix other) throws IllegalArgumentException {
        BinVector[] columns = new BinVector[other.columns()];

        for (int j = 0 ; j < other.columns() ; j++)
            columns[j] = this.product(other.column(j));

        BinMatrix trans = new BinMatrix(columns);
        return trans.transpose();
    }
}
~~~
{: .collapsible .collapsed}


## Codes de Hamming

Nous arrivons, finalement, aux codes correcteurs d'erreurs. Les codes
de Hamming sont une classe de codes linéaires 1-correcteurs
(parfaits). Dans la suite, on va noter $$n$$ la *longueur* d'un code, $$k$$ sa
*dimension* et $$d$$ sa *distance minimale*; ce qui peut être noté plus
succinctement par $$[n,k,d]$$.

On peut montrer que pour tout entier $$m > 1$$ il existe un unique (à
isomorphisme près) code de Hamming avec paramètres

$$[n=2^m-1,\; k=2^m-1-m,\; 3]$$

qu'on appelle **le** code de Hamming $$(n,k)$$. Le code de Hamming
$$(3,1)$$ étant le code par répétition sur 3 bits, on considère que le
plus petit code de Hamming intéressant est le code $$(7,4)$$.

La construction d'un code de Hamming est très simple. On commence par
choisir l'entier $$m$$, qui est le nombre de *bits de contrôle*. On
construit alors la *matrice de parité* du code, qui est la matrice
$$m\times (2^m-1)$$ où les colonnes sont les écritures en base $$2$$ des
entiers compris entre $$1$$ et $$2^m-1$$. Voici la matrice de parité du
code $$(7,4)$$:

$$\begin{pmatrix}
1&0&1&0&1&0&1 \\
0&1&1&0&0&1&1 \\
0&0&0&1&1&1&1
\end{pmatrix}$$

On met ensuite cette matrice sous *forme systématique*, ce qui revient
à faire des échanges de colonnes jusqu'à faire apparaître une matrice
identité dans sa partie droite. Pour le code $$(7,4)$$, en déplaçant les
colonnes 1, 2 et 4 vers la droite, on obtient la matrice de parité
suivante

$$H=\begin{pmatrix}
1&1&0&1&1&0&0 \\
1&0&1&1&0&1&0 \\
0&1&1&1&0&0&1
\end{pmatrix}$$

qui définit un code équivalent au précédent. La matrice de parité
permet de vérifier si un mot reçu appartient au code, on a en effet
$$Hv = 0$$ pour tout mot $$v$$ appartenant au code de Hamming. Observez
que les colonnes qui sont déplacées vers la droite sont celles dont
**la position est une puissance de deux**: 1, 2, 4, ...

Pour encoder un message, en plus de la matrice de parité il faut
construire la *matrice génératrice* du code. Ceci se fait aisément en
partant de la matrice de parité sous forme systématique; en effet, si

$$H=\left(\begin{array}{c c c | c c c}
  &&& 1 \\
&A& &   & \ddots\\
  &&&   &  & 1
\end{array}\right)$$

avec $$A$$ un bloc de taille $$m\times k$$, alors

$$G=\begin{pmatrix}
1\\
&\ddots\\
&&1\\
\hline\\
&A\\
&
\end{pmatrix}$$

est la matrice génératrice du code. Par exemple, la matrice
génératrice du code $$(7,4)$$ est

$$G=\begin{pmatrix}
1&0&0&0 \\
0&1&0&0 \\
0&0&1&0 \\
0&0&0&1 \\
1&1&0&1 \\
1&0&1&1 \\
0&1&1&1 
\end{pmatrix}.$$

Maintenant un message $$v\in\mathbb{F}_2^k$$ est encodé par $$Gv$$. Par
conséquent, le code de Hamming est le sous-espace vectoriel de
$$\mathbb{F}_2^n$$ engendré par les colonnes de $$G$$, et on a la relation

$$HG = 0.$$

**Attention:** dans la majorité des livres de texte la matrice $$G$$ est
  écrite dans sa forme transposée $$G^t$$, et les messages sont encodés
  en les multipliant à gauche: $$v^t G^t$$.

Nous allons écrire un programme qui génère le code de Hamming de
paramètres donnés et encode des messages. Créez le fichier suivant:

~~~
public class Hamming {
    // La matrice de parite du code de Hamming
    BinMatrix parity;

    // Verifie si l'entier positif n est une puissance de 2
    public static Boolean isPowerOf2(int n) {
        return False;
    }

    // Calcule la partie entiere du logarithme en base 2 
    // de l'entier positif n
    public static int log2(int n) {
        return 0;
    }

    // Cree le code de Hamming avec n_minus_k bits de parite
    public Hamming(int n_minus_k) {
    }
    
    // Calcule la matrice generatrice de ce code de Hamming
    public BinMatrix generator() {
        return null;
    }

    // Encode un vecteur avec ce code de Hamming
    public BinVector encode(BinVector v) {
        return null;
    }

    // Cree le code de Hamming avec parametres donnes
    // et affiche ses matrices
    public static void main(String[] args) {
        int m = Integer.parseInt(args[0]);
        
        Hamming code = new Hamming(m);
        
        System.out.println(code.parity);
        System.out.println(code.generator());
        // Decommentez cette ligne quand vous aurez fini.
        // Le resultat doit etre la matrice ne contenant que
        // des zeros.
        //System.out.println(code.parity.product(code.generator()));
    }
}
~~~

Le `main` prend comme unique argument de la ligne de commande un
entier $$m$$ qui correspond au nombre de bits de contrôle du code de
Hamming, comme décrit auparavant. Servez vous de ses affichages pour
tester votre code.

1. Écrivez les méthodes statiques `isPowerOf2` et `log2`. La première
prend un entier (supposé positif) et donne `true` s'il s'agit d'une
puissance de deux. La deuxième prend un entier et donne la partie
entière inférieure de son logarithme en base 2 (ce qui est aussi,
souvenez-vous, un de moins que le nombre de bits nécessaires à l'écrire). Les deux
méthodes peuvent être écrites en utilisant exclusivement des
opérations sur les bits.

2. Écrivez le constructeur `Hamming`. Ce constructeur prend en entrée
l'entier $$m$$ comptant le nombre de bits de contrôle du code, et
calcule la matrice de parité **sous forme systématique** $$H$$ du code
de Hamming $$(2^m-1, 2^m-1-m)$$.

3. Écrivez la méthode `generator` qui calcule la matrice génératrice
$$G$$ du code de Hamming. Pour cela, vous allez devoir extraire la
sous-matrice $$A$$ de $$H$$ de taille $$m\times k$$, comme décrit plus haut.

4. Écrivez la méthode `encode` qui encode un message $$v$$ en le
multipliant par $$G$$.


Testez votre code en encodant des messages de plusieurs octets et en
vérifiant que leur produit par $$H$$ fait bien zéro.

Vous trouverez la solution ci-dessous.

~~~
//                    Cliquez ici pour ouvrir
public class Hamming {
    // La matrice de parite du code de Hamming
    BinMatrix parity;

    // Verifie si l'entier positif n est une puissance de 2
    public static Boolean isPowerOf2(int n) {
        return n != 0 && ((n - 1) & n) == 0;
    }

    // Calcule la partie entiere du logarithme en base 2 
    // de l'entier positif n
    public static int log2(int n) {
        int cnt = 0;
        for ( ; n > 1 ; n >>= 1) cnt++;
        return cnt;
    }

    // Cree le code de Hamming avec n_minus_k bits de parite
    public Hamming(int n_minus_k) {
        int n = (1 << n_minus_k) - 1;
        int k = n - n_minus_k;

        BinVector[] H = new BinVector[n];
        for (int i = 1 ; i <= n ; i++) {
            byte[] bits = { (byte)i, (byte)(i >> 8), (byte)(i >> 16), (byte)(i >> 24) };
            int column = isPowerOf2(i) ? k + log2(i) : i - log2(i) - 2;
            H[column] = new BinVector(bits, n_minus_k, 0);
        }

        this.parity = (new BinMatrix(H)).transpose();
    }
    
    // Calcule la matrice generatrice de ce code de Hamming
    public BinMatrix generator() {
        int n = parity.columns();
        int k = n - parity.rows();

        BinVector[] G = new BinVector[n];
        
        // Une ligne de bits tous a zero
        Bit[] bits = new Bit[k];
        for (int i = 0 ; i < k ; i++)
            bits[i] = Bit.ZERO;
        
        // La partie identite de la matrice
        for (int i = 0 ; i < k ; i++) {
            if (i > 0)
                bits[i - 1] = Bit.ZERO;
            bits[i] = Bit.ONE;
            G[i] = new BinVector(bits);
        }

        /* La partie qui depend de H */
        for (int i = k ; i < n ; i++) {
            for (int j = 0 ; j < k ; j++)
                bits[j] = parity.row(i-k).bits[j];
            G[i] = new BinVector(bits);
        }

        return new BinMatrix(G);
    }

    // Encode un vecteur avec ce code de Hamming
    public BinVector encode(BinVector v) {
        return generator().product(v);
    }

    // Cree le code de Hamming avec parametres donnes
    // et affiche ses matrices
    public static void main(String[] args) {
        int nk = Integer.parseInt(args[0]);
        
        Hamming code = new Hamming(nk);
        
        System.out.println(code.parity);
        System.out.println(code.generator());
        System.out.println(code.parity.product(code.generator()));
    }
}
~~~
{: .collapsible .collapsed}


## Décodage syndrome

Allez d'abord réviser la théorie du [Décodage syndrome](Décodage syndrome). Ensuite

1. Ajoutez à votre classe `Hamming` une méthode
   
   ~~~
   public BinVector addError(BinVector c)
   ~~~
   
   qui prend en entrée un mot de code et qui y ajoute une erreur à une position aléatoire. Pour choisir une position aléatoire, vous pouvez utliser un code similaire au suivant:
   
   ~~~
   int alea = (int)(Math.random() * 10);
   ~~~
       
   qui génère un entier aléatoire entre 0 et 9 inclus.

2. Ajoutez à votre classe `Hamming` une méthode
   
   ~~~
   public BinVector decode(BinVector y)
   ~~~
   
   qui réalise le décodage syndrome.


Si vous avez envie d'aller plus loin, allez voir le
[DM de l'an dernier sur le décodage syndrome](DM2 - Décodage par syndrome) et résolvez le challenge.

