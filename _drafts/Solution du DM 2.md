---
layout: post
title: Solution du DM2
---

Les solutions à ce DM ont été beaucoup moins complètes que pour les autres DM. Voici la solution d'Aurélien Lejeau. Une partie des classes nécessaires à la solution se trouve dans le TD [Codes linéaires](Codes linéaires).


~~~
// Voir les TDs pour le code source de ces classes
import bit.BinVector;
import bit.Bit;
import hamming.Hamming;

// J'omets ces classes, écrites par Aurélien, qui permettent transférer
// les contenus d'un fichier dans un String et vice versa
import filer.FileReader;
import filer.TextWriter;

/**
 * Classe qui permet d'encoder un fichier avec un code de Hamming
 * 
 * @author Aurélien Lejeau
 *
 */
public class Encoder {
        
    Hamming h;
    int len;
        
    public Encoder(int hammingSize){
        this.h = new Hamming(hammingSize);
        this.len = this.h.getDeuxExposantNmoinsUnMoinsN();
    }
        
    /**
     * Fonction qui encode avec le code de Hamming [2^n - 1; 2^n - 1 - n; n],
     * n taille du mot binaire 
     * 
     * @param bits : tableau de bits à encoder
     * @return le tableau de bits encodé selon le code Hamming
     */
    public Bit[] encode(Bit[] bits){
        int i;
                
	// taille bits
        int taille = bits.length; 
	// taille du tableau multiple de 2^n - 1 - n
        taille = taille - ( bits.length % this.h.getDeuxExposantNmoinsUnMoinsN() ); 
                
	// si taille inférieure à taille bits
        if (taille != bits.length)
	    // on ajoute un vecteur de taille 2^n - 1 - n pour pouvoir compléter
            taille += this.h.getDeuxExposantNmoinsUnMoinsN(); 
                
	// on réduit au nombre vecteurs
        taille /= this.h.getDeuxExposantNmoinsUnMoinsN(); 
        int nbVecteurs = taille;
	// taille du tableau pour accueillir les mots codés 
        taille *= this.h.getDeuxExposantNmoinsUn(); 
        Bit[] bits2 = new Bit[taille];
        
                
	//nbVecteur-1 : si on a besoin de compléter le vecteur avec des 0, on le fait après
        for (i = 0; i < nbVecteurs-1; i++){ 
	    // vecteur de taille 2^n - 1 - n
            BinVector bv = new BinVector(bits, this.len, i*this.len); 
	    // vecteur de taille 2^n - 1
            bv = this.h.encode(bv); 
	    // vecteur vers tableau de bits
            Bit[] tmp = bv.toBitArray(); 
                        
            //on remplit le tableau avec le vecteur codé
            for (int j = i*this.h.getDeuxExposantNmoinsUn(); j < (i+1)*this.h.getDeuxExposantNmoinsUn(); j++){
                bits2[j] = tmp[j % this.h.getDeuxExposantNmoinsUn()];
            }
        }
        // on remplit le dernier vecteur avec des zéros si nécessaire
        Bit[] tmp = new Bit[this.h.getDeuxExposantNmoinsUn()];
                
        //Si on est hors du tableau bits, on remplit avec des zéros
        for (int j = i*this.h.getDeuxExposantNmoinsUn(); j < nbVecteurs*this.h.getDeuxExposantNmoinsUn(); j++)
            tmp[j % this.h.getDeuxExposantNmoinsUn()] =
                (j < (bits.length - (bits.length%this.len))) ? bits[j]:new Bit(0);
                
        BinVector bv = new BinVector(tmp, len, 0);
        bv = this.h.encode(bv);
        tmp = bv.toBitArray();
        for (int j = i*this.h.getDeuxExposantNmoinsUn(); j < bits2.length; j++)
            bits2[j] = tmp[j % this.h.getDeuxExposantNmoinsUn()];
                
        return bits2;
    }
        
    /**
     * Fonction qui ajoute une erreur par vecteur de bits
     * 
     * @param bits : tableau de bits
     * @return tableau de bits avec une erreur par vecteur
     */
    public Bit[] ajouteErreurs(Bit[] bits){
                
        for (int i = 0; i < bits.length-this.h.getDeuxExposantNmoinsUn(); i+=this.h.getDeuxExposantNmoinsUn()){
            int alea = (int)(Math.random() * this.h.getDeuxExposantNmoinsUn());
            bits[i+alea] = (new Bit(1)).add(bits[i+alea]);
        }
                
        return bits;
    }
        
    public Hamming getHamming(){
        return this.h;
    }
        
    /**
     * Fonction qui encode le fichier, en ajoutant ou non des erreurs.
     * 
     * @param args : arg1 : taille du mot de code
     *               arg2 : chemin du fichier à encoder
     *               arg3 : chemin du fichier encodé
     *               arg4 : erreurs ou non : -erreurs
     */
    public static void main(String[] args) {
        if (args.length >= 3){

            int len  = (int)args[0].charAt(0) - 48;
            Encoder e = new Encoder(len);
            FileReader fr = new FileReader(args[1]);
            Bit[] b = fr.BinaryFileReading();
                        
            b = e.encode(b);
                        
            if (args.length >= 4){
                //if (args[3] == "-erreurs")
                b = e.ajouteErreurs(b);
            }
                        
            TextWriter tw = new TextWriter(args[2]);
            tw.writeBinaryText(b);
                        
            System.out.println("File successfully encoded !");
        }
        else
            System.out.println("Erreur dans les arguments !);
    }
}
~~~
{:.java}

~~~
// Voir les TDs pour le code source de ces classes
import bit.BinVector;
import bit.Bit;
import hamming.Hamming;

// J'omets ces classes, écrites par Aurélien, qui permettent transférer
// les contenus d'un fichier dans un String et vice versa
import filer.FileReader;
import filer.TextWriter;

/**
 * Classe qui permet le décodage d'un fichier codé avec un code de Hamming
 * 
 * @author Aurélien Lejeau
 *
 */
public class Decoder {

    Hamming h;
    int len;
    int[] correspondances;
        
    /**
     * Fonction qui convertit un tableau de Bit en entier
     * 
     * @param bits : un tableau de bits
     * @return : la valeur de ce tableau de Bit
     */
    public static int bitsToInt(Bit[] bits){
        int tralala = 0;
        for (int i = 0; i < bits.length; i++){
            tralala += ((int)bits[i].getBit())*Math.pow(2, bits.length - 1 - i);
        }
                
        return tralala;
    }
        
    /**
     * Fonction qui affecte un nombre (la valeur en décimal du vecteur binaire)
     * à chaque colonne de H
     */
    private void correspondances(){
        this.correspondances = new int[this.h.getParity().columns()];
                
        for (int i = 0; i < this.correspondances.length; i++){
            // On crée un BinVector de la taille du code de Hamming avec pour valeur
            // les bits de fin de ligne de la matrice génératrice
            Bit[] tmp = this.h.getParity().transpose().row(i).toBitArray();
            this.correspondances[i] = bitsToInt(tmp);
        }
    }
        
    /**
     * Fonction qui retourne un BinVector avec la position de l'erreur
     * 
     * @param : le Syndrome du vecteur à corriger
     * @return : le vecteur avec un bit à un pour la position de l'erreur
     */
    public BinVector retourneErreur(BinVector bv){
        int tmp = bitsToInt(bv.toBitArray()), i;

        // si pas d'erreur, on retourne le vecteur nul
        if (tmp == 0){
            Bit[] t = new Bit[this.h.getDeuxExposantNmoinsUn()];
                        
            for (int j = 0; j < t.length; j++)
                t[j] = new Bit(0);
                        
            return new BinVector(t);
        }
                
        for (i = 0; i < this.correspondances.length; i++){
            if (this.correspondances[i] == tmp) break;
        }
        
        Bit[] tmp1 = new Bit[this.h.getDeuxExposantNmoinsUn()];
                
        for (int j = 0; j < len; j++)
            tmp1[j] = (j == i) ? new Bit(1) : new Bit(0); 
                
        return new BinVector(tmp1);
    }
        
    /**
     * Fonctoion qui décode un tableau de bits suivant la méthode du syndrome
     * 
     * @param bits : le tableau de bits encodés
     * @return un tableau de bits décodés 
     */
    public Bit[] decode(Bit[] bits){
        int i;
                
        // taille bits
        int taille = bits.length; 
        // taille du tableau multiple de 2^n - 1 
        taille = taille - ( bits.length % this.h.getDeuxExposantNmoinsUn() ); 
                
        // on réduit au nombre vecteurs
        taille /= this.h.getDeuxExposantNmoinsUn(); 
        int nbVecteurs = taille;
        // taille du tableau pour accueillir les mots codés 
        taille *= this.h.getDeuxExposantNmoinsUnMoinsN(); 
                
        Bit[] bits2 = new Bit[taille];
                
        //nbVecteur : si on a besoin de compléter le vecteur avec des 0, on le fait après
        for (i = 0; i < nbVecteurs; i++){ 
            // vecteur de taille 2^n - 1
            BinVector bv = new BinVector(bits, this.len, i*this.len); 
            // on calcule le syndrome
            BinVector s = syndrome(bv); 
            // on récupère l'erreur
            BinVector e = retourneErreur(s); 
            // on corrige le vecteur
            BinVector c = bv.add(e); 
            BinVector dec = new BinVector(c.toBitArray(), this.h.getDeuxExposantNmoinsUnMoinsN(), 0);
            // vecteur vers tableau de bits
            Bit[] tmp = dec.toBitArray(); 
                        
            //on remplit le tableau avec le vecteur decodé
            for (int j = i*tmp.length; j < (i+1)*tmp.length; j++){
                bits2[j] = tmp[j % tmp.length];
            }
        }
                
        return bits2;
    }
        
    public Decoder(int n){
        this.h = new Hamming(n);
        this.len = this.h.getDeuxExposantNmoinsUn();
        correspondances();
    }
        
    /**
     * Fonction qui calcule le syndrome d'un vecteur
     * 
     * @param bv : vecteur de bits
     * @return le syndrome de ce vecteur
     */
    public BinVector syndrome(BinVector bv){
        return this.h.getParity().product(bv);
    }
        
    public Hamming getHamming(){
        return this.h;
    }
        
    /**
     * Fonction qui lance le décodage du fichier, en corrigeant les erreurs
     * si erreurs il y a.
     * 
     * @param args : arg1 : taille du mot de code à l'origine
     *               arg2 : chemin du fichier à décoder
     *               arg3 : chemin du fichier décodé
     */
    public static void main(String[] args) {
                
        if (args.length >= 3){
            int length = (int)args[0].charAt(0) - 48;
            Decoder d = new Decoder(length);
            FileReader fr = new FileReader(args[1]);
            Bit[] b = fr.BinaryFileReading();
            TextWriter tw = new TextWriter(args[2]);
            b = d.decode(b);
                        
            tw.writeBinaryText(b);
            System.out.println("File successfully decoded !");
        }
        else {
            System.out.println("Erreur : pas assez d'arguments");
        }
    }
}
~~~


Juste pour curiosité, voici la même chose en Python 2.6. À décortiquer avec attention lorsque vous aurez assez d'expérience...

~~~
## Ces imports sont l'équivalent de Bit, BinVector et BinMatrix
from scipy import matrix, mod, base_repr, bmat, log2
from scipy.linalg import block_diag
## Ceci est un tableau de bits légèrement avancé
from bitarray import bitarray
## Pour générer de l'aléa
from random import randrange

## Génére les matrices G et H du code de Hamming avec m bits de parité
def _ham(m):
    A = matrix([map(int, reversed(base_repr(i))) + [0]*(m-len(base_repr(i)))
                for i in range(1,2**m) if i & (i-1) != 0])
    H = bmat([[A], [block_diag(*([1]*m))]])
    G = bmat([block_diag(*([1]*(2**m-m-1))), A])
    return G, H

## Encode une chaîne de caractères
def _ham_encode(G, s):
    n = G.shape[0]
    src = bitarray(endian='big')
    dst = bitarray(endian='big')
    src.fromstring(s)
    for block in _bit_blocks(src, n, 0):
        dst.extend(mod(matrix(block) * G, 2).getA()[0])
    return dst

## Decode une chaîne de bits par décodage syndrome
def _ham_decode(H, src):
    n = H.shape[0]
    k = n - H.shape[1]
    dst = bitarray(endian='big')
    for block in _bit_blocks(src, n):
        s = mod(matrix(block) * H, 2).getA()[0]
        col = int("".join(map(str, reversed(s))), 2)
        # correct error only if it has happened in                              
        # the message bits                                                      
        if col and (col & col-1 != 0):
            errpos = col - int(log2(col)) - 2
            block[errpos] ^= 1
        dst.extend(block[0:k])
    return dst.tostring()

## Ajoute du bruit aléatoire à une chaîne de bits
def _noise(src, n):
    dst = bitarray(endian='big')
    for block in _bit_blocks(src, n):
        err = randrange(2*n)
        if err < n:
            block[err] ^= 1
        dst.extend(block)
    return dst

## Une 'fonction génératrice', dans le jargon de python.
## Permet de parcourir une liste de bits en la découpant
## en blocs de longueur l (et en ajoutant un padding si
## nécessaire).
def _bit_blocks(b, l, padding=None):
    s = []
    for c in iter(b):
        s.append(c)
        if len(s) == l:
            yield s
            s = []
    if padding is not None and s:
        yield s + [padding] * (l - len(s))

## Voici un exemple qui encode et décode la chaîne Hello world
## en utilisant le code de Hamming (15, 11)
G, H = _ham(4)

msg = "Hello world!"
print msg

coded = _ham_encode(G, msg)
print coded

received = _noise(coded, H.shape[0])
print received

decoded = _ham_decode(H, received)
print decoded
~~~
