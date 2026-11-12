# Marble Run

A pixel art marble run game: place pieces on the board to guide the marbles to the jars, then launch and watch them roll.

*Version française : [README.md](README.md)*

## Controls

- **Mouse**: click a piece at the bottom to pick it, then an empty cell to place it. Click a ramp or a switch again to turn it, and once more to remove it; right-click to remove.
- **LAUNCH** (or **Enter**): the marbles start; **STOP** (or Enter, Esc) to go back to building.
- **Keyboard**: arrows to move between cells, **1 to 4** to pick a piece, **Space** to place or turn, **Delete** to remove, **R** to remove everything.

## The pieces

- **Ramp**: rolls marbles to the left or the right.
- **Funnel**: gathers marbles in the middle of the cell.
- **Trampoline**: bounces marbles back up, keeping their sideways speed.
- **Switch**: sends marbles once left, once right; it flips after each marble.

The board also has **walls**, **spikes** that pop marbles, and **tunnels**: a marble that enters the hole comes out of the exit of the same color, falling.

## The goal

Every marble must end up in a **jar**. When jars have a colored ribbon, each marble goes into the jar of its color. The physics is real: marbles roll, bounce and knock into each other.

Ten levels. The fewer pieces you place, the more **stars** you earn (the number for 3 stars is shown); one star unlocks the next level.

## Statistics

The Records panel keeps the **best** (fewest pieces) and the **stars** of each level, the number of **runs completed** and the total stars.

## Data and sync

Your progress is saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Marble Run → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
