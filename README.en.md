# Marble Run

A pixel art marble run game: place pieces on the board to guide the marbles to the jars, then launch and watch them roll.

*Version française : [README.md](README.md)*

## Sandbox (new in 1.2.0)

The **SANDBOX** button opens a free board, with no level and no piece limit. Besides ramps, funnels, trampolines, switches, belts, fans and magnets, you place the scenery yourself: dispensers (each with its own colour), jars, walls and spikes. Clicking a scenery piece again removes it. LAUNCH tells how many marbles end up in the jars. Your circuit is kept from one time to the next.

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

## Full screen

The "FULL SCREEN" button puts the game in full screen. The game also grows with the window, from a small laptop to a big screen.

## Thirty levels and three new pieces

- **Conveyor belt**: it carries the marbles that fall on it and throws them at its end. Click again to change its direction.
- **Fan**: it blows the marbles passing on its row, to the right or to the left (click again to turn it).
- **Magnet**: it pulls the marbles towards its column without stopping them: handy to aim at a pot.
- **Coloured marbles**: green and yellow marbles on top of the red and blue ones, dispensers that drop two colours in turn, and levels where each marble must go into the pot of its colour.
- **Twenty new levels** (30 in all), from the first conveyor belt to the grand finale. Each level was checked: it does not solve itself, and its solution works with the number of pieces for three stars.
