# Battle of Hoth – browser game code

A two-player board game based on the Lego Star Wars 3866 Battle of Hoth set, built with Phaser 2 and its isometric plugin. Plain JavaScript, no build step: `index.html` loads the libraries from `assets/` and then the game files from `js/` in order.

## Game (`js/`, in load order)

| File | What's in it |
| --- | --- |
| `data.js` | Move and shot patterns, every piece (`Piece(...)`: faction, unit, health, shots, sounds…), and the six maps |
| `sprites.js` | The sprite atlas: where each sprite is in `assets/images/hoth.png` |
| `state.js` | Game state: `tiles` (the board), `turnStatus`, the sprite groups, and the `Sounds`, `UI` and `Settings` objects |
| `board.js` | Setting up a map, drawing the board and pieces, and the rules for moving and shooting |
| `play.js` | Playing a turn: selecting, moving, shooting, damage, whose turn it is, victory |
| `effects.js` | Shots, wrecks, force attacks, fly-overs, the turn badges, the info window and texts |
| `ambient.js` | Background fly-overs and sounds, and the snow |
| `menu.js` | The control-panel menu and the instructions |
| `main.js` | The Phaser game: `preload`, `create`, `update` |

## The board

`tiles[x][y]` is an object: `tileName` (which bridges the square has: north, east, south, west, e.g. `'1010'`), `piece` (or `null`), and `baseFaction` (whose base the square is part of).

Each side has two goes per turn. Select a piece, then move it one square along a bridge, or shoot an enemy in its shot pattern. A side wins by destroying every enemy piece or moving onto the enemy base.
