# Toboggan

Un jeu de circuits à billes en pixel art : pose des pièces sur le panneau pour mener les billes jusqu'aux pots, puis lance et regarde-les rouler.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Souris** : clique sur une pièce en bas pour la choisir, puis sur une case vide pour la poser. Re-clique une rampe ou un aiguillage pour le tourner, puis encore pour l'enlever ; clic droit pour enlever.
- **LANCER** (ou **Entrée**) : les billes partent ; **STOP** (ou Entrée, Échap) pour revenir au montage.
- **Clavier** : flèches pour la case, **1 à 4** pour la pièce, **Espace** pour poser ou tourner, **Suppr** pour enlever, **R** pour tout enlever.

## Les pièces

- **Rampe** : fait rouler les billes vers la gauche ou la droite.
- **Entonnoir** : rassemble les billes au milieu de la case.
- **Trampoline** : renvoie les billes vers le haut, en gardant leur élan sur le côté.
- **Aiguillage** : envoie les billes une fois à gauche, une fois à droite ; il bascule après chaque bille.

Sur le panneau, il y a aussi des **murs**, des **pics** qui font éclater les billes, et des **tunnels** : une bille qui entre dans le trou ressort de la sortie de la même couleur, en tombant.

## Le but

Toutes les billes doivent finir dans un **pot**. Quand les pots ont un ruban de couleur, chaque bille va dans le pot de sa couleur. La physique est réelle : les billes roulent, rebondissent et se cognent entre elles.

Dix niveaux. Moins tu poses de pièces, plus tu gagnes d'**étoiles** (le nombre pour 3 étoiles est affiché) ; une étoile ouvre le niveau suivant.

## Statistiques

Le panneau Records garde le **record** (le moins de pièces) et les **étoiles** de chaque niveau, le nombre de **circuits réussis** et le total des étoiles.

## Données et synchronisation

Ta progression est enregistrée par NeoDex, sauvegardée et synchronisée entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Toboggan → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
