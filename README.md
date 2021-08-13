# Music labyrinths

## TODO
- Labyrinth automatic generation (start in 2d to warm up)
- figure out osu documentation
- Steps in rhythm with BPM
- Use osu colors in labyrinth palette
- Complete graph with as many nodes as hit points
    + Get Spanning Tree by trimming connections so that we have a path to the end and the whole graph is interconnected.
- Generate screensaver once by loading file into the program, then running the program is parsing that file on the fly (no duplicate labyrinth generation or on the fly laybrinth generation)

## Osu documentation notes
### hit objects key:
- \[0,1\] posiciones en pixel en pantalla (x,y)
- \[2\] ms del beatmap en el que arranca el hit object
- \[3\] type: valor de 8 bits. Cada bit representa:
	+ 0: hit circle
	+ 1: slider
	+ 3: spinner
	+ 7: osu!mania hold
	+ 2: new combo
	+ 4-6: 3 bit integer specifying how any combo colours to skip, if object starts a new combo.

- ?
- hit sample: 

