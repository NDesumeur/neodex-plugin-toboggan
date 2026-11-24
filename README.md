# Toboggan

Un jeu de circuits à billes en pixel art : pose des pièces sur le panneau pour mener les billes jusqu'aux pots, puis lance et regarde-les rouler.

*English version: [README.en.md](README.en.md)*

## Bac à sable (nouveau en 1.2.0)

Le bouton **BAC À SABLE** ouvre un panneau libre, sans niveau ni limite de pièces. En plus des rampes, entonnoirs, trampolines, aiguillages, tapis, ventilateurs et aimants, on y pose soi-même le décor : distributeurs (chacun de sa couleur), pots, murs et pics. Re-cliquer un élément du décor l'enlève. LANCER dit combien de billes finissent dans les pots. Le circuit est gardé d'une fois sur l'autre.

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

## Plein écran

Le bouton « PLEIN ÉCRAN » met le jeu en plein écran. Le jeu grandit aussi avec la fenêtre, du petit portable au grand écran.

## Trente niveaux et trois nouvelles pièces

- **Tapis roulant** : il emporte les billes qui tombent dessus et les lance au bout. Re-clique pour changer son sens.
- **Ventilateur** : il souffle les billes qui passent sur sa rangée, vers la droite ou vers la gauche (re-clic pour le tourner).
- **Aimant** : il attire les billes vers sa colonne sans les arrêter : pratique pour viser un pot.
- **Billes de couleur** : des billes vertes et jaunes en plus des rouges et bleues, des distributeurs qui lâchent deux couleurs à tour de rôle, et des niveaux où il faut trier chaque bille dans le pot de sa couleur.
- **Vingt nouveaux niveaux** (30 en tout), du premier tapis roulant au grand final. Chaque niveau a été vérifié : il ne se résout pas tout seul, et sa solution marche avec le nombre de pièces des trois étoiles.
