---
layout: post
title: Coder et décoder en UTF-8 et UTF-16
scripts: ['js/file-opener.js']
---

Dans ce TD nous allons écrire un transcodeur capable de convertir des fichiers de l'encodage [UTF-16](UTF-16) à l'encodage [UTF-8](UTF-8) et *vice-versa*.

Nous avons exprimé les algorithmes pour le codage et le décodage en utilisant la base 16. En plus des entiers en base 10, Java offre des facilités pour écrire les constante numérales en bases 8, 16 et (depuis 7.0) 2. Voici un exemple.

~~~
int a = 987;    // entier en base 10
int b = 0765    // les entiers en base 8 commencent par 0
int c = 0xFED   // les entiers en base 16 commencent par 0x ou 0X
int d = 0b1010  // les enttiers en base 2 commencent par 0b (depuis Java 7.0)
~~~

Si vous connaissez les opérateurs bit-à-bit Java (décalage et masquage), vous êtes libres de les utiliser. Néanmoins, les opérations arithmétiques (multiplication, division et modulo) sont largement suffisantes pour ce TD et vous êtes encouragés à faire l'effort intellectuel de vous en servir.

## Coder et décoder [UTF-16](UTF-16) et [UTF-8](UTF-8)

Copiez-collez le code suivant dans un fichier nommé `Transcoder.java`.

~~~
import java.io.*;

public class Transcoder {
    // Constantes liees aux plages UTF-16
    private static int
        lead_start = 0xD800, 
        tail_start = 0xDC00, 
        tail_end   = 0xDFFF,
        bmp_end    = 0xFFFF,
        max_cp     = 0x10FFFF;
 
    /*
      Convertit deux mots de 16 bits (supposes encodes en UTF-16) en
      un codepoint Unicode. Le deuxieme mot est ignore le cas echeant.

      Renvoie -1 s'il y a un probleme d'encodage.
    */
    static int cp_from_UTF16(int lead, int tail) {
        return -1;
    }

    /*
      Convertit un codepoint Unicode en son encodage UTF-16 (un
      tableau de un ou deux entiers de 16 bits).

      Renvoie null si le codepoint est invalide.
     */
    static int[] cp_to_UTF16(int codepoint) {
        return null;
    }

    /*
      Convertit un codepoint Unicode en son encodage UTF-8 (un
      tableau de un a quatre entiers de 8 bits).

      Renvoie null si le codepoint est invalide.
     */
    static int[] cp_to_UTF8(int codepoint) {
        return null;
    }

    /*
      Convertit quatre mots de 8 bits (supposes encodes en UTF-8) en
      un codepoint Unicode. Les mots en plus sont ignores le cas
      echeant.

      Renvoie -1 s'il y a un probleme d'encodage.
    */
    static int cp_from_UTF8(int b1, int b2, int b3, int b4) {
        return -1;
    }

    /*
      Convertit un flux de UTF-8 a UTF-16
    */
    public static void utf8to16(InputStream in, OutputStream out) 
        throws IOException {
    }

    /*
      Convertit un flux de UTF-16 a UTF-18
    */
    public static void utf16to8(InputStream in, OutputStream out)
        throws IOException {
    }

    /*
      Cette fonction sert a tester les methodes ci-dessus. Elle prend
      un codepoint en entree et fait des affichages de test.
    */
    static void test(int codepoint) throws UnsupportedEncodingException {
        int[] utf8 = cp_to_UTF8(codepoint);
        int[] pad = new int[4];
        if (utf8 != null) {
            byte[] code = new byte[utf8.length];
            for (int i = 0 ; i < utf8.length ; i++) {
        	pad[i] = utf8[i];
        	code[i] = (byte)utf8[i];
        	System.out.print(Integer.toString(utf8[i], 16) + " ");
            }
            System.out.println("\n" +
        		       Integer.toString(cp_from_UTF8(pad[0],
        						     pad[1],
        						     pad[2],
        						     pad[3]),
        					16));
            System.out.println(new String(code, "UTF-8"));
        }

        int[] utf16 = cp_to_UTF16(codepoint);
        if (utf16 != null) {
            pad = new int[2];
            for (int i = 0 ; i < utf16.length ; i++) {
        	System.out.print(Integer.toString(utf16[i], 16) + " ");
        	pad[i] = utf16[i];
            }
            System.out.println("\n" +
        		       Integer.toString(cp_from_UTF16(pad[0],
        						      pad[1]),
        					16));
            System.out.println("" + (char)pad[0] + (char)pad[1]);
        }
    }

    public static void main(String[] args) 
        throws IOException, UnsupportedEncodingException {

        test(Integer.parseInt(args[0], 16));
    }
}
~~~

1. Complétez la méthode `cp_from_UTF16`. Elle prend en entrée deux `int`, qu'il faut interpréter comme deux mots de 16 bits issus d'un flux [UTF-16](UTF-16), et renvoie le *codepoint* Unicode correspondant aux deux mots. Si le premier `int` est un mot du Basic Multilingual Plane, le deuxième `int` doit tout simplement être ignoré. Si les deux mots ne forment pas un encodage [UTF-16](UTF-16) valide, la fonction doit renvoyer -1. Remarquez qu'un int contient 32 bits, mais pour chacun des deux paramètres passés à la fonction nous allons ignorer les 16 bits de *poids fort* (les bits *plus significatif*, c'est à dire, ceux qui correspondent aux plus grandes puissances de 2) et utiliser exclusivement la valeur des 16 bits de *poids faible*.

Pour vous aider à tester votre code, une fonction de test est déjà implantée dans le code fourni ci-dessus. Il suffit de compiler le programme et le lancer avec un paramètre sur la ligne de commande. Le paramètre doit être le *codepoint* d'un symbole Unicode valide écrit en hexadécimal ; le programme de test va afficher quelques informations utiles: entre autres, la valeur hexadécimale de son encodage [UTF-16](UTF-16) et le symbole lui-même. Voici un exemple de test après que vous aurez implanté correctement la méthode `cp_from_UTF16`.

~~~
dfl@proust:~$ java Transcoder 1f603
d83d de03 
-1
😃
~~~

---

2. Complétez la méthode `cp_to_UTF16`. Elle prend en entrée un `int` représentant le *codepoint* d'un symbole Unicode valide, et renvoie un tableau de un ou deux `int`, contenant son encodage [UTF-16](UTF-16). À nouveau, chacun des `int` du tableau fait 32 bits, mais nous nous servons seulement des 16 bits de poids faible.

Voici la sortie du test après que vous aurez implanté correctement cette fonction.

~~~
dfl@proust:~$ java Transcoder 1f603
d83d de03 
1f603
😃
~~~

---

3. Complétez les méthodes `cp_to_UTF8`, `cp_from_UTF8`. Comme les méthodes précédente, la première prend en entrée un *codepoint* et renvoie un tableau de 1 à 4 `int`, la deuxième prend en entrée 4 `int` et renvoie un *codepoint*. Cette fois-ci, on va se servir seulement des 8 bits de poids faible de chaque `int`.

N'hésitez pas à définir des constantes définissant les plages [UTF-8](UTF-8) comme cela a été fait pour vous concernant [UTF-16](UTF-16). Voici un exemple de sortie lorsque toutes les fonctions auront été implantées correctement.

~~~
dfl@proust:~$ java Transcoder 1f603
f0 9f 98 83 
1f603
😃
d83d de03 
1f603
😃
~~~


## Agir sur des fichiers

Les entrées/sorties en Java se font à l'aide de *flux* (*streams*). Les deux types les plus simples de stream sont [`InputStream`](http://docs.oracle.com/javase/6/docs/api/java/io/InputStream.html) et [`OutputStream`](http://docs.oracle.com/javase/6/docs/api/java/io/OutputStream.html). `System.in` est une instance du premier, tandis que `System.out` et `System.err` sont des instances du deuxième.

Deux classes spécifiques à la lecture et écriture de fichiers héritent de `InputStream` et `OutputStream`. Il s'agit de [`FileInputStream`](http://docs.oracle.com/javase/6/docs/api/java/io/FileInputStream.html) et [`FileOutputStream`](http://docs.oracle.com/javase/6/docs/api/java/io/FileOutputStream.html). On peut utiliser la première pour lire des fichiers, voici un exemple d'utilisation

~~~
FileInputStream in = new FileInputStream("source.txt");
int i;
while( (i = in.read()) != -1 ) {
    System.out.println(i);
}
~~~

La fonction `read()` de `InputStream` lit le contenu du flux (que ce soit `System.in` ou un `FileInputStream`) un seul octet à la fois. Lorsqu'il n'y a plus d'octets dans le flux, elle renvoie -1. Nonobstant la valeur de retour de `read()` représente un octet, le type de sa valeur de retour est `int` (sinon il serait impossible, par exemple, de renvoyer -1).

L'écriture dans un flux est réalisée de façon similaire. Voici un exemple qui écrit des octets pas très intéressants dans un fichier.

~~~
FileOutputStream out = new FileOutputStream("destination.txt");
for ( int i = 0 ; i <= 0xFF ; i++ ) {
    out.write(i);
}
~~~

Comme pour `read()`, le paramètre attendu par `write()` est de type `int`, mais seulement les 8 bits de poids faible vont être utilisés par cette fonction.

Voici un exemple très simple de copie de fichier octet par octet.

~~~
FileInputStream in = new FileInputStream("source.txt");
FileOutputStream out = new FileOutputStream("destination.txt");
int i;
while( (i = in.read()) != -1 )
    out.write(i);
~~~

1. Modifiez le `main` pour qu'il prenne en paramètre les noms de deux fichiers. Le premier va être un fichier d'entrée, le deuxième un fichier de sortie. Complétez la fonction `utf8to16` pour qu'elle lise le contenu du flux `in`, le décode en supposant qu'il est encodé en [UTF-8](UTF-8), convertit le résultat en [UTF-16](UTF-16) et écrit le résultat sur le flux `out`. Appelez la fonction `utf8to16` à partir du `main`.

2. Complétez la fonction `utf16to8`, qui réalise la conversion inverse. Modifiez le `main` pour qu'il prenne un paramètre sur la ligne de commande permettant de choisir le sens de la conversion.

Testez votre transcodeur sur les fichiers mis à disposition dans [cette archive](misc/textes.zip). Chaque fichier y est présent aux formats [UTF-8](UTF-8) et [UTF-16](UTF-16). Pour vous aider à visualiser ces fichiers (et ceux produits par votre programme) dans le bon encodage, vous pouvez vous servir des contrôles ci-dessous.

<div id='file-opener'></div>

Parmi les choix d'encodage, vous remarquerez l'existence de plusieurs
types de [UTF-16](UTF-16) ; ceci vous permet de choisir la
[*endianness*](Endianness) de l'encodage. `utf-16` est l'encodage
[UTF-16](UTF-16) standard (*big endian*), `utf-16le` est le même en
*little endian*, `utf-16-default` est [UTF-16](UTF-16) avec endianness
du système. Si vous avez codé correctement, vous n'avez pas à vous
soucier de cela : l'un des trois marchera pour vous (vous aurez fait
implicitement un choix d'endiannes en écrivant votre code). Pour plus
de détails, voir [Endianness](Endianness).


## Solution

~~~
import java.io.*;       // Cliquez pour voir la solution

public class Transcoder {
    // Constantes liees aux plages UTF-16
    private static int
        lead_start = 0xD800, 
        tail_start = 0xDC00, 
        tail_end   = 0xDFFF,
        bmp_end    = 0xFFFF,
        max_cp     = 0x10FFFF;
 
    /*
      Convertit deux mots de 16 bits (supposes encodes en UTF-16) en
      un codepoint Unicode. Le deuxieme mot est ignore le cas echeant.

      Renvoie -1 s'il y a un probleme d'encodage.
    */
    static int cp_from_UTF16(int lead, int tail) {
        if (lead < lead_start || lead > tail_end)
            return lead;
        else if (lead >= lead_start && lead < tail_start)
            return (lead - 0xD800) * 0x400 + (tail - 0xDC00) + 0x10000;
        else 
            return -1;
    }

    /*
      Convertit un codepoint Unicode en son encodage UTF-16 (un
      tableau de un ou deux entiers de 16 bits).

      Renvoie null si le codepoint est invalide.
     */
    static int[] cp_to_UTF16(int codepoint) {
        if (codepoint >= 0 && codepoint < bmp_end) {
            int[] pairs = { codepoint };
            return pairs;
        } else if (codepoint > bmp_end && codepoint <= max_cp) {
            int[] pairs = { (codepoint - 0x10000) / 0x400 + 0xD800,
                            (codepoint - 0x10000) % 0x400 + 0XDC00 };
            return pairs;
        } else {
            return null;
        }
    }

    // Constantes liees aux plages UTF-8
    private static int
        utf8_cp1 = 0x80,
        utf8_cp2 = 0x800,
        utf8_cp3 = 0x10000,
        utf8_cp4 = 0x200000;

    private static int
        utf8_bx = 0x80,
        utf8_b2 = 0xC0,
        utf8_b3 = 0xE0,
        utf8_b4 = 0xF0,
        utf8_b5 = 0xF8;

    /*
      Convertit un codepoint Unicode en son encodage UTF-8 (un
      tableau de un a quatre entiers de 8 bits).

      Renvoie null si le codepoint est invalide.
     */
    static int[] cp_to_UTF8(int codepoint) {
        if (codepoint >= 0 && codepoint < utf8_cp1) {
            int[] bytes = { codepoint };
            return bytes;
        } else if (codepoint < utf8_cp2) {
            int[] bytes = { codepoint / 0x40 + utf8_b2,
                      codepoint % 0x40 + utf8_bx };
            return bytes;
        } else if (codepoint < utf8_cp3) {
            int[] bytes = { codepoint / 0x40 / 0x40 + utf8_b3,
                      (codepoint / 0x40) % 0x40 + utf8_bx,
                      codepoint % 0x40 + utf8_bx };
            return bytes;
        } else if (codepoint < utf8_cp4) {
            int[] bytes = { codepoint / 0x40 / 0x40 / 0x40 + utf8_b4,
                      (codepoint / 0x40 / 0x40) % 0x40 + utf8_bx,
                      (codepoint / 0x40) % 0x40 + utf8_bx,
                      codepoint % 0x40 + utf8_bx };
            return bytes;
        } else
            return null;
    }

    /*
      Convertit quatre mots de 8 bits (supposes encodes en UTF-8) en
      un codepoint Unicode. Les mots en plus sont ignores le cas
      echeant.

      Renvoie -1 s'il y a un probleme d'encodage.
    */
    static int cp_from_UTF8(int b1, int b2, int b3, int b4) {
        if (b1 < utf8_bx)
            return b1;
        else if (b1 < utf8_b2)
            return -1;
        else if (b1 < utf8_b3 && 
                 b2 >= utf8_bx && b2 < utf8_b2)
            return (b1 % 0x20)*0x40 + (b2 % 0x40);
        else if (b1 < utf8_b4 &&
                 b2 >= utf8_bx && b2 < utf8_b2 &&
                 b3 >= utf8_bx && b3 < utf8_b2)
            return (b1 % 0x10)*0x40*0x40 + (b2 % 0x40)*0x40 + (b3 % 0x40);
        else if (b1 < utf8_b5 &&
                 b2 >= utf8_bx && b2 < utf8_b2 &&
                 b3 >= utf8_bx && b3 < utf8_b2 &&
                 b4 >= utf8_bx && b4 < utf8_b2)
            return (b1 % 0x8)*0x40*0x40*0x40 + (b2 % 0x40)*0x40*0x40 + (b3 % 0x40)*0x40 + (b4 % 0x40);
        else
            return -1;
    }

    /*
      Convertit un flux de UTF-8 a UTF-16
    */
    public static void utf8to16(InputStream in, OutputStream out)
        throws IOException {

        int b1 = in.read(), 
            b2 = in.read(), 
            b3 = in.read(),
            b4;
        while (b1 != -1) {
            b4 = in.read();
            int cp = cp_from_UTF8(b1, b2, b3, b4);
            if (cp != -1) {
        	int[] pairs = cp_to_UTF16(cp);
        	for (int i = 0 ; i < pairs.length ; i++) {
        	    out.write(pairs[i] / 0x100);
        	    out.write(pairs[i] % 0x100);
        	}
            }
            b1 = b2; b2 = b3; b3 = b4;
        }
    }

    /*
      Convertit un flux de UTF-16 a UTF-18
    */
    public static void utf16to8(InputStream in, OutputStream out) 
        throws IOException {
        int b1 = in.read(), 
            b2 = in.read(), 
            b3, b4;

        while (b1 != -1) {
            b3 = in.read();
            b4 = in.read();
            int cp = cp_from_UTF16(b1 * 0x100 + b2, b3 * 0x100 + b4);
            if (cp != -1) {
        	int[] bytes = cp_to_UTF8(cp);
        	for (int i = 0 ; i < bytes.length ; i++)
        	    out.write(bytes[i]);
            }
            b1 = b3; b2 = b4;
        }
    }

    public static void main(String[] args) 
        throws IOException, UnsupportedEncodingException {
        InputStream in = System.in;
        OutputStream out = System.out;
        int utf16 = 0;

        if (args.length >= 1 && args[0].equals("-utf16"))
            utf16 = 1;
        if (args.length >= 1 + utf16)
            in = new FileInputStream(args[utf16]);
        if (args.length >= 2 + utf16) 
            out = new FileOutputStream(args[1+utf16]);

        if (utf16 == 0)
            utf8to16(in, out);
        else
            utf16to8(in, out);
    }
}
~~~
{: .collapsible .collapsed}