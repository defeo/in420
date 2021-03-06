---
layout: post
title: Entrées-Sorties en Java
---

## D'après une question d'un étudiant

Pourquoi `System.out.print(49)`  me donne un résultat différent de `System.out.write(49)`, et pourquoi ce code ne fait pas ce à quoi je m'attendrais (la copie marche, mais le chiffrement non)?

~~~
// clef de César modulo 16
int clef = 12;

BufferedInputStream in = new BufferedInputStream(new FileInputStream("source.txt"));
BufferedOutputStream out_cp = new BufferedOutputStream(new FileOutputStream("copie.txt"));
BufferedOutputStream out_ch = new BufferedOutputStream(new FileOutputStream("chiffre.txt"));

int i;
while( (i = in.read()) != -1 ) {
    // impression de debug
    System.out.print(i);
    // copie du fichier
    out_cp.write(i);
    // cryptage du fichier
    i = (i + clef) % 16;
    out_ch.write(i);
}
~~~


## Streams, Readers et Writers

### Décorticage du code

Le IO, ce n'est pas ce qu'il y a de plus simple en Java.

La méthode `read()` de `InputStream` (et de toutes les classes qui héritent de `InputStream`, comme `BufferedInputStream` et `OutputInputStream`) lit le flux octet par octet: sa valeur de retour est un `int` qui contient la valeur de l'octet lu (puisqu'un `int` fait 4 octets, cela veut dire qu'il y a 3 octets qui ne servent à rien dans la valeur de retour).

Concrètement, admettons que le fichier `source.txt` contienne le texte suivant:

    a1cd9900

Le premier octet lu sera le caractère `'a'`. Le codage binaire [ASCII](http://fr.wikipedia.org/wiki/American_Standard_Code_for_Information_Interchange) de `'a'` est 01100001, ce qui correspond à la valeur décimale 97. La variable `i` de la boucle `while` vaudra donc 97. Le deuxième octet lu sera le caractère `'1'`, son codage binaire est 00110001, soit 49. La variable `i` vaudra 49 (et non pas 1).

La méthode `write()` de `OutputStream` (et de ses sous-classes) se comporte comme `read()`: elle écrit octet par octet, l'octet à écrire étant passé dans une variable de type `int` (ce qui veut à nouveau dire qu'il y a 3 octets qui ne servent à rien). C'est pour ça que la copie marche. C'est aussi pour ça que le chiffrement ne marche pas: en effet

$$97+12 =13\mod 16,\qquad 49+12=13\mod 16,$$

la deuxième écriture écrira donc deux fois l'octet 13, soit 00001101, dans le fichier `chiffre.txt`, ce qui correspond au caractère [ASCII](http://fr.wikipedia.org/wiki/American_Standard_Code_for_Information_Interchange) Carriage Return (Retour à la Ligne).

La méthode `print()`, par contre, appartient à la classe `PrintStream`. Cette méthode (en réalité, plusieurs méthodes surchargées) s'efforce d'écrire une représentation lisible de son paramètre: par exemple, les variables de type `int` sont converties en décimal et écrites comme des chaînes de caractères. Donc l'octet qui correspond à `'a'` sera imprimé comme la chaîne `"97"` (ce qui fait deux octets, maintenant) et l'octet qui correspond à `'1'` sera imprimé comme la chaîne `"49"` (encore deux octets).

Le choses deviennent encore plus compliquées si le fichier source contient des caractères non ASCII, comme des lettres accentuées ou du chinois, mais on ne va pas entrer dans les détails ici.


### Quelques conseils pour bien lire et écrire vos fichiers

Donc voilà plusieurs conseils pour travailler sur les fichiers en Java.

`FileInputStream` et `FileOutputStream` sont très utiles pour travailler sur des fichiers en mode binaire. Par exemple des fichiers qui ne contiennent pas de texte (exécutables, images, etc.), ou lorsqu'on veut faire des copies identiques de fichiers.

`BufferedInputStream` et `BufferedOutputStream` servent juste à ajouter un peu d'efficacité dans la lecture/écriture: le fichier est chargé en memoire en blocs, plutôt qu'un octet à la fois. C'est bien de s'en servir, comme dans l'exemple en haut, pour les mêmes usages que `FileInputStream` et `FileOutputStream`; mais cela ne va pas nous aider plus pour des fichiers de texte sur lesquels on veux faire des transformations de caractères (comme c'est le cas pour le chiffrement).

La façon standard en Java de traiter des fichiers texte est de les *wrapper* dans des `Reader` et des `Writer`, comme ceci:

~~~
InputStreamReader in = new InputStreamReader(new FileInputStream("source.txt"));
OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream("destination.txt"));
~~~
  
ou, plus directement,

~~~
FileReader in = new FileReader("source.txt"));
FileWriter out = new FileWriter("destination.txt"));
~~~

Si tout va bien, ceci a l'avantage de gérer automatiquement l'encodage du fichier texte et d'éviter des problèmes avec les lettres accentuées, etc. `Reader` et `Writer` offrent deux méthodes (stupidement appelées `read()` et `write()`, comme dans les *streams*, alors que `getChar()` et `putChar()` auraient été des noms bien mieux choisis) qui servent à faire des lectures/écritures caractère par caractère (et non pas octet par octet: souvenez vous qu'un `char` en Java fait deux octets!). Elles s'utilisent de façon similaire aux méthodes des *streams*.

~~~
int i;
while( (i = in.read()) != -1 ) {
    // cryptage du fichier
    // on suppose qu'il s'agit d'un fichier texte ne contenant
    // que les caractères de 0 à 9
    if (i >= '0' && i <= '9') {
        i = ((i - '0' + clef) % 10) + '9';
        out.write(i);
        // impression de debug
        System.out.print((char)i);
    }
}
~~~

Observez que la méthode `read()` retourne un `int` plutôt qu'un `char`: ceci est nécessaire car la méthode retourne -1 (valeur qu'un `char` ne peut pas prendre) lorsqu'il n'y a plus de caractères dans le *stream* sous-jacent (soit dit en passant, ceci est absolument abominable: mieux aurait valu soulever une `EOFException`). Pour cette raison, il faut faire un *cast* explicite vers `char` avant d'imprimer le caractère lu. La méthode `write()` prend un entier en paramètre principalement par compatibilité avec `read()` (encore une chose abominable!), par conséquent deux des 4 octets sont tout simplement ignorés.

Au bout du compte, tant que vous travaillez sur des fichiers [ASCII](http://fr.wikipedia.org/wiki/American_Standard_Code_for_Information_Interchange) vous ne remarquerez aucune différence entre les *streams* et les *readers/writers*: le code ci-dessus marchera également bien, ceci parce qu'un caractère ASCII tient en un seul octet. Les problèmes arrivent dès que vous travaillez sur des fichiers avec un encodage plus riche, par exemple [UTF-8](http://fr.wikipedia.org/wiki/Utf8), qui sert par exemple à coder les caractères accentués.

La classe `BufferedReader` ajoute une petite commodité par dessus les `Reader`: elle permet de lire un fichier ligne par ligne et retourne un `String`. Voici comment on l'utilise pour lire un fichier


~~~
BufferedReader in = new BufferedReader(new FileReader("source.txt")));

String line;
while( (line = in.readLine()) != null )
    System.out.println(line);
~~~

En plus de vous simplifier parfois la vie, utiliser `BufferedReader` ajoute un peu d'efficacité à vos programmes.

Il existe aussi une classe `BufferedWriter`, mais, pour des raisons un peu sombres, elle ne contient pas de méthode `writeLine()`, elle servira donc seulement à rendre vos programmes plus efficaces. Une classe plutôt pratique pour écrire des `String` est `PrintWriter`, qui s'utilise ainsi

~~~
PrintWriter out = new PrintWriter(new FileWriter("destination.txt")));
~~~

ou, pour plus d'efficacité,

~~~
PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("destination.txt"))));
~~~

Voici une copie de fichier avec `PrintWriter`

~~~
BufferedReader in = new BufferedReader(new FileReader("source.txt")));
PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("destination.txt"))));

String line;
while( (line = in.readLine()) != null )
    out.println(line);
~~~

**Attention:** la copie du fichier n'étant pas faite octet par octet, les deux fichiers peuvent résulter différents. Une source de maux de tête récurrents est le fait que les retours à la ligne ne sont pas gérés de la même façon selon le système d'exploitation: Windows utilise la combinaison des deux caractères [ASCII](http://fr.wikipedia.org/wiki/American_Standard_Code_for_Information_Interchange) `CR` (code 13) et `LF` (code 10), alors que Linux et MacOS utilisent seulement `LF`. D'un autre côté, l'utilisation de `Reader` et `Writer` permet de faire du traitement de texte avancé, comme par exemple transcoder des fichiers (convertir un fichier ISO-8859 en UTF-8, par exemple).

Il est enfin opportun de signaler l'existence d'une dernière classe intéressante: `PrintStream`. Cette classe propose les mêmes méthodes que `PrintWriter` tout en se branchant directement sur un *stream* (elle ne saurait donc pas gérer les encodages). Par exemple, la sortie standard Java (l'objet `System.out`) est un `PrintStream`. Le code suivant, permet par exemple d'écrire des informations de debug dans un fichier plutôt que sur la sortie:

~~~
PrintStream log = new PrintStream(new FileOutputStream("errors.log"));

try {
    ...
} catch (Exception e) {
    log.println(e.getMessage());
}
~~~


## Un usage avancé: le paquet `java.nio`

Java 1.4 a introduit un nouveau paquet standard appelé *New IO*. Le paquet sert principalement à fournir un accès efficace aux flux de système (lectures/écriture sur fichier, communication inter-procès, *sockets* de réseau).

Ses fonctionnalités sont principalement utiles pour un traitement binaire des données. Voici un exemple de copie de fichiers réalisée avec le paquet `java.nio.channels`.

~~~
FileChannel in = new FileInputStream("source.txt").getChannel();
FileChannel out = new FileOutputStream("destination.txt").getChannel();

out.transferFrom(in, 0, in.size());
~~~

Au delà de sa simplicité, l'avantage principal de ce code est son efficacité: toute la gestion du transfert de données et de la mémoire est implanté par la JVM, ce qui permet une optimisation de bas niveau.

L'autre apport fondamental de *New IO* est le paquet `java.nio.charset`, qui permet de gérer les encodages des caractères (à utiliser en conjonction avec `Reader` et `Writer`).
