---
layout: post
title: Solution du DM3
---

Ce DM, en apparence simple, cachait de nombreux pièges. Voici la solution de Mickael De Oliveira, légèrement modifiée.

~~~
import java.math.*;
import java.util.*;

public class MillerRabin {
    static BigInteger deux = new BigInteger("2");
    static BigInteger un = BigInteger.ONE;
    static BigInteger zero = BigInteger.ZERO;
        
    // Exponentiation binaire
    public static BigInteger modpow(BigInteger a, BigInteger x, BigInteger mod)
    {
        if(x.equals(un))
            return a.mod(mod);
	else if((x.mod(deux)).equals(zero))
	    return modpow(a.multiply(a).mod(mod),x.divide(deux),mod);
	else
	    return a.multiply(modpow(a.multiply(a).mod(mod),x.divide(deux),mod)).mod(mod);
    }
        
    //Test de Fermat
    public static boolean Fermat(BigInteger a,BigInteger n)
    {                        
        if(n.equals(un) || n.equals(zero))
            return false;
        else {
	    BigInteger comp = modpow(a,n.subtract(un),n);
	    if(comp.equals(un))
		return true;
	    else
		return false;
	}
    }
        
    //Test de Miller-Rabin
    public static boolean MillerRabin(BigInteger n, BigInteger k)
    {
        BigInteger s = zero;
        BigInteger d = n.subtract(un);
        BigInteger nm1 = n.subtract(un);
        BigInteger a, mod1;
                
        if(n.max(deux).equals(deux) || n.mod(deux).equals(zero))
            return false;
        else {
	    //Décomposition de n-1 en (2^s)*d
	    while(d.mod(deux).equals(zero)) {
		d = d.divide(deux);
		s = s.add(un);
	    } 
	    
	    for(int j = 0; j < k.intValue(); j++) {
		do {
		    a = new BigInteger(nm1.bitLength(),new Random());
		} while(a.compareTo(nm1) >= 0 || a.compareTo(un) <= 0);
                
		mod1 = modpow(a,d,n);

		if (mod1.equals(un))
		    return true;
		else {
		    for(int i = 1; i <= s.intValue(); i++) {        
			if(mod1.equals(nm1))
			    return true;
			else if(mod1.equals(un))
			    return false;
                                                
			// calculer a^d2^i mod n reviens à calculer ((a^d mod n)^2) mod n 
			// i fois
			mod1 = mod1.multiply(mod1).mod(n);
		    }
		    if(mod1.equals(nm1))
			return true;
		}
	    }
	}
        return false;
    }
        
    public static void main(String[] args) {
        BigInteger n = new BigInteger(args[0]);
        BigInteger k;
        if(args.length == 2)
            k = new BigInteger(args[1]);
        else
            k = new BigInteger("20");
                
        BigInteger a = un;
        boolean bool;
                
        bool = MillerRabin(n,k);
        System.out.println(bool);
    }
}
~~~

Ce code est presque parfait, à un détail près: la méthode `MillerRabin` ne renvoie pas d'information sur le témoin de composition. Une solution très simple aurait consisté à en faire une fonction qui renvoie un entier: 

~~~
public static BigInteger MillerRabin(BigInteger n, BigInteger k)
~~~

- le témoin de compostion si `n` est composé

~~~
return a
~~~

- ou 0 si `n` est premier (souvenez-vous que 0 ne peut pas être utilisé comme temoin)

~~~
return BigInteger.ZERO
~~~


À défaut de retourner le témoin de composition à travers la fonction `MillerRabin`, le code original de Mickael se débrouillait d'une façon un peu maladroite, que j'ai pu retrouver dans plusieurs soumissions: lorsque le nombre en entrée est composée, on se lance dans une nouvelle recherche de témoin et testant successivement tous les entiers, mais cette fois-ci en utilisant le test de Fermat:

~~~
Boolean bool = MillerRabin(n,k);
BigInteger a = BigInteger.ONE;

if(!bool) {
    System.out.println(n+" n'est pas premier");
    while(!a.equals(n)) {
        bool = Fermat(a,n);	

        if(bool)
            a = a.add(un);
	else {
            System.out.println(a+" est un témoin de composition pour "+n);
            break;
        }
    }
}
~~~

Cette approche est mauvais pour plusieurs raisons:

- Elle utilise le test de Fermat, qui est strictement moins puissant du test de Miller-Rabin. Dans le cas des nombres de Carmichael, ce test est extrêmement inefficace car il ne marchera que lorsque `a` tombe sur un facteur de `n`: il s'agit là d'une complexité en $$O(n)$$ plutôt qu'en $$O(\log^2 n)$$.

- Elle fait du travail inutile, car un témoin de composition (au sens de Miller-Rabin) avait déjà été trouvé par la fonction `MillerRabin`.


Une autre erreur fréquente que j'ai pu trouver dans les soumissions consiste à faire plusieurs tests de MillerRabin à la suite, et à répondre "premier" ou "composé" selon si la majorité des tests a donné l'un ou l'autre. Je rappelle encore une fois qu'être un nombre composé n'est pas une charge élective: **il s'agit d'un crime!** S'il y a même un seul témoin prouvant la composition de `n`, alors `n` est composé. Point. Dès qu'on trouve un témoin on peut arrêter de chercher: tout autre entier `a` qui ne prouverait pas la composition de `n` est un **menteur** au sens de Miller-Rabin.


Enfin, un défaut de style avec des conséquences néfastes sur la complexité de l'algorithme de Miller-Rabin est la boucle suivante

~~~
mod1 = modpow(a, d, n);

if (mod1.equals(un))
    return true;
else {
    for(int i = 1; i <= s.intValue(); i++) {        
	if(mod1.equals(nm1))
	    return true;
	else if(mod1.equals(un))
	    return false;
                                             
        exp = d.multiply((new BigInteger("2")).pow(i));
	mod1 = modpow(a, exp, n);
    }
    if(mod1.equals(nm1))
	return true;
}
~~~

Le coût d'executer `modpow` à chaque itération de la boucle est de $$O(\log^2 n)$$ opérations. Comme `s` vaut au pire $$\log n$$, le coût total de la boucle est de $$O(\log^3 n)$$ opérations.

Comme Mickael remarque (à peu près) justement dans son code source:

> Calculer $$a^{d2^i} \mod n$$ revient à calculer $$a^d \mod n$$ élévé $$i$$ fois au carré.

Ce qui motive l'écriture de la boucle suivante

~~~
mod1 = modpow(a,d,n);

if (mod1.equals(un))
    return true;
else {
    for(int i = 1; i <= s.intValue(); i++) {        
	if(mod1.equals(nm1))
	    return true;
	else if(mod1.equals(un))
	    return false;
                                             
	// calculer a^d2^i mod n reviens à calculer ((a^d mod n)^2) mod n 
	// i fois
	mod1 = mod1.multiply(mod1).mod(n);
    }
    if(mod1.equals(nm1))
	return true;
}
~~~

Maintenant calculer `mod1` au carré modulo `n` coûte seulement $$O(\log n)$$ opérations; la boucle a donc un coût total de $$O(\log^2 n)$$ opérations, ce qui est beaucoup plus efficace (pour des grand nombres).
