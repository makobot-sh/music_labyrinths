# Music labyrinths

Generate Labyrinth screensaver in the style of [Windows 95's 3d maze screensaver](https://www.youtube.com/watch?v=oRL5durPleI) that moves to the beat of your [OSU! beatmap](https://osu.ppy.sh) of choice! 
Load any OSU! beatmap into the file generator, then load that file into the player and enjoy~

## Problemas a resolver
Tema 1:

Extraer la informacion de OSU y parsearla

Tema 2:

Generar el laberinto

Tema 3:

Generar el movimiento de camara

Tema 4: 

Leer la informacion del laberinto generado y modelara en 3D

Tema 5:

Mezclar tema 4 y tema 3

Tema 6:

Conectar la camara con la musica

## TODO
- Labyrinth automatic generation (start in 2d to warm up)
- figure out osu documentation
- Steps in rhythm with BPM
- Use osu colors in labyrinth palette
- Complete graph with as many nodes as hit points
    + Get Spanning Tree by trimming connections so that we have a path to the end and the whole graph is interconnected.
- Generate screensaver once by loading file into the program, then running the program is parsing that file on the fly (no duplicate labyrinth generation or on the fly laybrinth generation)
- Volume slider during execution
- Pause button during execution?

## Osu documentation notes
https://osu.ppy.sh/wiki/en/osu%21_File_Formats/Osu_%28file_format%29
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

