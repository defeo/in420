---
layout: post
title: Décodage syndrome
---

Le *décodage syndrome* est une technique générale de décodage des [codes linéaires](Codes correcteurs d%27erreurs) ayant un coût meilleur que celui de la recherche exhaustive dans beaucoup de cas.

## Le syndrome

Soit $$C$$ un code linéaire de
paramètres $$[n,k,d]$$, de matrice de parité $$H$$ et de matrice
génératrice $$G$$. Pour nos exemples, nous allons considérer le code de
paramètres $$[6,3,3]$$ défini par les matrices suivantes

$$G=\begin{pmatrix}
1&0&0\\
0&1&0\\
0&0&1\\
1&1&0\\
1&0&1\\
0&1&1
\end{pmatrix}
,\qquad
H=\begin{pmatrix}
1&1&0&1&0&0\\
1&0&1&0&1&0\\
0&1&1&0&0&1
\end{pmatrix}.$$

On rappelle qu'un message $$v$$ est encodé avec le mot de code
$$c=Gv$$. Dans notre exemple, le message $$011$$ est encodé par

$$c = Gv = \begin{pmatrix}
1&0&0\\
0&1&0\\
0&0&1\\
1&1&0\\
1&0&1\\
0&1&1
\end{pmatrix}
\begin{pmatrix}
0\\1\\1
\end{pmatrix}
=
\begin{pmatrix}
0\\1\\1\\1\\1\\0
\end{pmatrix}.
$$

Le destinataire reçoit un mot bruité $$y=c + e$$, où $$e$$ est un vecteur
d'erreur contenant au plus $$(d-1)/2$$ positions d'erreur. Le
**syndrome** du mot $$y$$ est la valeur

$$s = Hy = H(c+e) = Hc + He = He,$$

où les égalités découlent de la linéarité de la multiplication de
matrices et du fait que $$H$$ est la matrice de parité du code (et que
donc $$Hc=0$$ pour tout mot de code $$c$$). Dans notre exemple, en
supposant qu'il y ait eu une erreur en quatrième position, on a

$$s = Hy = \begin{pmatrix}
1&1&0&1&0&0\\
1&0&1&0&1&0\\
0&1&1&0&0&1
\end{pmatrix}
\begin{pmatrix}
0\\1\\1\\0\\1\\0
\end{pmatrix}
=
H
\begin{pmatrix}
0\\1\\1\\1\\1\\0
\end{pmatrix}
+
H\begin{pmatrix}
0\\0\\0\\1\\0\\0
\end{pmatrix}
=
\begin{pmatrix}
1\\0\\0
\end{pmatrix}.$$


## Décodage par syndrome

Comme on a vu ci-dessus, le syndrome d'un mot $$y=c+e$$ ne dépend que de
l'erreur $$e$$ et pas du tout du mot de code $$c$$. Même sans connaître
l'erreur, on peut donc calculer son syndrome en calculant le produit
$$s=Hy$$.

Une fois calculé le syndrome $$s$$, on trouve l'erreur $$e$$ par recherche
sur tous les mots d'erreur possibles. Comme notre code est
1-correcteur, les seules erreurs qu'on peut corriger sont celles de
poids au plus 1, c'est à dire les erreurs suivantes

$$\begin{pmatrix}
0\\0\\0\\0\\0\\0
\end{pmatrix},\quad
\begin{pmatrix}
1\\0\\0\\0\\0\\0
\end{pmatrix},\quad
\begin{pmatrix}
0\\1\\0\\0\\0\\0
\end{pmatrix},\quad
\begin{pmatrix}
0\\0\\1\\0\\0\\0
\end{pmatrix},\quad
\begin{pmatrix}
0\\0\\0\\1\\0\\0
\end{pmatrix},\quad
\begin{pmatrix}
0\\0\\0\\0\\1\\0
\end{pmatrix},\quad
\begin{pmatrix}
0\\0\\0\\0\\0\\1
\end{pmatrix},$$

qui correspondent aux syndromes suivants

$$\begin{pmatrix}
0\\0\\0
\end{pmatrix},\quad
\begin{pmatrix}
1\\1\\0
\end{pmatrix},\quad
\begin{pmatrix}
1\\0\\1
\end{pmatrix},\quad
\begin{pmatrix}
0\\1\\1
\end{pmatrix},\quad
\begin{pmatrix}
1\\0\\0
\end{pmatrix},\quad
\begin{pmatrix}
0\\1\\0
\end{pmatrix},\quad
\begin{pmatrix}
0\\0\\1
\end{pmatrix}.$$

Dans notre exemple, on était tombés sur le syndrome $$100$$, qui
correspond à l'erreur $$000100$$, c'est à dire une erreur en quatrième
position. 

Pour les codes 1-correcteurs, comme celui de notre exemple, on peut
trouver l'erreur directement sans énumérer tous les syndromes
possibles. Si le syndrome est zéro, alors nécessairement $$e=0$$ et il
n'y a pas eu d'erreurs. Sinon, on note $$e_i$$ le vecteur contenant un
$$1$$ à la position $$i$$ et $$0$$ partout ailleurs; souvenez vous qu'alors
$$s=He_i=H_i$$, où $$H_i$$ est la $$i$$-ème colonne de $$H$$. Par exemple

$$He_4=\begin{pmatrix}
1&1&0&1&0&0\\
1&0&1&0&1&0\\
0&1&1&0&0&1
\end{pmatrix}
\begin{pmatrix}
0\\0\\0\\1\\0\\0
\end{pmatrix}
=
\begin{pmatrix}
1\\0\\0
\end{pmatrix}.$$

On peut donc trouver l'erreur $$e$$ simplement en cherchant dans $$H$$ la
colonne qui correspond au syndrome.

Une fois trouvée l'erreur $$e$$, on retrouve le mot de code $$c=y+e$$. Il
ne reste plus qu'à trouver le mot d'origine $$v$$ tel que $$c=Gv$$. Mais,
puisque $$G$$ est sous [forme systématique](Codes correcteurs d%27erreurs), ceci est immédiat: le mot
d'origine apparaît tel quel dans les $$k$$ premières composantes du mot
de code. Dans notre exemple

$$c = \begin{pmatrix}
0\\1\\1\\
\hline
1\\1\\0
\end{pmatrix}
=
\begin{pmatrix}
1&0&0\\
0&1&0\\
0&0&1\\
\hline
1&1&0\\
1&0&1\\
0&1&1
\end{pmatrix}
\begin{pmatrix}
0\\1\\1
\end{pmatrix}
= Gv.$$


Pour résumer, voici l'algorithme de décodage par syndrome.

> **Entrée:** Un mot bruité $$y$$, la matrice de parité $$H$$ (sous forme systématique).
> 
> **Sortie:** Le message d'origine $$v$$.
>
> 1. Calculer le syndrome $$s=Hy$$;
> 2. Chercher l'erreur $$e$$ telle que $$s=He$$;
> 3. Calculer le mot de code $$c=y+e$$;
> 4. Le message d'origine se trouve dans les $$k$$ premières composantes de $$c$$.
