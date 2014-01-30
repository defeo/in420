---
layout: post
title: RSA
---

## Le cryptosystème RSA

Le cryptosystème RSA nous permet de réviser d'un seul coup tout ce que
nous avons étudié sur l'arithmétique modulaire. On en rappelle les
principes.

Alice choisit deux (grands) nombres premiers $$p$$ et $$q$$ au hasard et
les garde secrets. Disons, par exemple, $$p=11$$ et $$q=13$$. Sa première
tâche consiste à **générer les paramètres** de son cryptosystème; pour
cela elle

- Calcule le produit $$N=pq$$;
- Calcule la valeur de l'indicatrice d'Euler $$\phi(N) = (p-1)(q-1)$$;
- Choisit un entier au hasard $$d>1$$ premier avec $$\phi(N)$$;
- Calcule $$e$$, l'inverse de $$d$$ modulo $$\phi(N)$$.

Dans notre exemple, $$N=143$$ et $$\phi(N) = 120$$. Si elle choisit
$$d=53$$, elle va calculer $$e=77$$, en effet,
$$53\cdot77=4081=1\bmod120$$.

Maintenant Alice peut publier sa clef publique, constituée de $$N$$ et
$$e$$. Toutes les autres données vont faire partie de sa clef secrète.

Lorsque Bob veut chiffrer un message pour Alice, il procède comme
suit:

- Il code son message en un entier $$1 < m < N$$;
- Il calcule $$c = m^e \mod N$$ et envoie le résultat à Alice.

Lorsque Alice reçoit le message de Bob, elle peut le décoder comme
suit:

- Elle calcule $$c^d \mod N$$. Par construction, ceci est égal à
  
  $$c^d=(m^e)^d = m^{ed} = m^{ed \mod \phi(N)} = m^1 = m \mod N.$$


Par exemple, si Bob doit envoyer le message $$10$$ à Alice, il calcule
$$c = 10^{77} = 43 \mod 143$$. Lorsque Alice reçoit le message $$43$$,
elle calcule $$43^{53}=10\mod 143$$.

Pour mettre en oeuvre le système RSA, nous avons donc besoin des
algorithmes que nous avons vu aux TDs précédents:

- L'algorithme d'exponentiation binaire pour calculer $$m^e$$ et $$c^d$$,
  vu au TD [Arithmétique modulaire](Arithmétique modulaire);
  
- L'algorithme d'Euclide pour le calcul du pgcd, vu au TD [Torus Wars](Torus Wars);

- L'algorithme d'Euclide étendu pour le calcul des relations de Bezout
  et de l'inverse modulaire, vu au TD [Torus Wars](Torus Wars).
  
Un petit coup de RSA à la main pour fixer les idées. Aidez-vous avec
une calculette.

1. On choisit les premiers $$p=13$$ et $$q=17$$. Générez les paramètres
d'un cryptosystème RSA.

2. Bob veut envoyer les messages suivants à Alice: 199, 154, 23, 201.
Chiffrez ces messages et vérifiez que leur déchiffrement correspond bien
au message d'origine.


## Mini RSA

Nous voici arrivés à la pratique. Nous allons écrire un petit RSA
jouet permettant de chiffrer/déchiffrer avec des modules d'au plus 32
bits. Créez le fichier

~~~
public class RSA {
    /* Les parametres secrets */
    private long p, q, d;
    private long phiN;
    /* Les parametres publiques */
    long N, e;
    
    /* Genere les parametres RSA etant donnes deux nombres premiers p
     * et q */
    public RSA(long p, long q) {
    }

    /* Chiffre le message m avec l'exposant publique */
    public long chiffre(long m) {
        return 0;
    }

    /* Dechiffre le message c avec l'exposant secret */
    public long dechiffre(long c) {
        return 0;
    }

    /* Calcule le pgcd de a et b */
    public static long pgcd(long a, long b) {
        return 0;
    }

    /* Calcule l'inverse de x modulo n */
    public static long invmod(long x, long n) {
        return 0;
    }

    /* Calcule x à la puissance exp modulo mod */
    public static long modpow(long x, long exp, long mod) {
        return 0;
    }
    
    /* Le main prend en arguments deux nombres premiers */
    public static void main(String[] args) {
        long p = Long.parseLong(args[0]);
        long q = Long.parseLong(args[1]);

        RSA rsa = new RSA(p, q);
        System.out.println("Module publique:            N = " + rsa.N);
        System.out.println("Clef publique:              e = " + rsa.e);
        System.out.println("Indicatrice d'Euler:   phi(N) = " + rsa.phiN);
        System.out.println("Clef privée:                d = " + rsa.d);
        System.out.println("             e * d mod phi(N) = " + (rsa.e * rsa.d % rsa.phiN));
        System.out.println();

        long msg = (int)(Math.random() * rsa.N);
        System.out.println("Message: " + msg);
        System.out.println("Chiffre: " + rsa.chiffre(msg));
        System.out.println("DechiffreL " + rsa.dechiffre(rsa.chiffre(msg)));
    }
}
~~~

1. Codez les méthodes `pgcd`, `invmod` et `modpow` qui calculent
respectivement le pgcd, l'inverse modulaire et l'exponentiation
binaire. Vous pouvez retrouver ces algorithmes dans les TDs
[Arithmétique modulaire](Arithmétique modulaire) et [Torus Wars](Torus Wars).

2. Écrivez le constructeur `RSA` qui prend en entrée deux nombres
   premiers et qui calcule les paramètres publiques et privées d'un
   système RSA. Vous pouvez générer un nombre aléatoire compris entre
   `0` et `n` avec le code suivant:
   
   ~~~
   (int)(Math.random() * n)
   ~~~

3. Écrivez les méthodes `chiffre` et `dechiffre` qui réalisent le
chiffrement et le déchiffrement RSA.

Testez votre à l'aide du `main`. Vous allez avoir besoin de quelques
nombres premiers pour vos tests, en voici quelques uns un peu plus
grands que d'habitude (quoique, beaucoup plus petits que des vrais
modules RSA): 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 1009, 1013, 1019,
1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091,
1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171,
1181, 1187, 1193, 32771, 32779, 32783, 32789, 32797, 32801, 32803,
32831, 32833, 32839, 32843.

## Ok, c'était fastoche. Je fais quoi, maintenant?

Si vous avez bien travaillé les TDs des semaines dernières, le TD
d'aujourd'hui ne vous a pas demandé beaucoup d'effort. Voici alors
quelques activités bien constructives pour garder votre esprit actif.

1. Réécrivez la méthode `powmod` en utilisant un algorithme itératif
(i.e. une boucle `for` ou `while`) plutôt que l'algorithme
récursif. Il y a deux façons classiques de lire les bits de
l'exposant: de droite à gauche et de gauche à droite; les deux
méthodes donnent lieu à deux algorithmes légèrement différents.

2. Réécrivez la méthode `pgcd` en utilisant un algorithme récursif.

3. Chiffrer des entiers, c'est bien gentil, mais c'est des messages
    que nous voulons chiffrer. Écrivez une fonction qui prend en entrée
    une chaîne de caractères, et qui
    
    - découpe le message en blocs suffisamment petits,
    - code chaque bloc avec un entier compris entre `1` et `N`,
    - chiffre chaque bloc avec RSA,
    - renvoie la suite des blocs chiffrés.

4. Les vrais modules RSA sont plutôt des entiers à 1024 ou 2048 bits,
ils ne tiennent pas dans un `long`. Pour pouvoir faire du vrai RSA,
vous avez besoin d'entiers *multi-précision*. Allez regarder la classe
[`java.math.BigInteger`](http://docs.oracle.com/javase/6/docs/api/java/math/BigInteger.html)
et réécrivez votre code pour utiliser des entiers multi-précision.
