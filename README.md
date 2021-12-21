# Music labyrinths

Generate Labyrinth screensaver in the style of [Windows 95's 3d maze screensaver](https://www.youtube.com/watch?v=oRL5durPleI) that moves to the beat of your [OSU! beatmap](https://osu.ppy.sh) of choice! 
Load any OSU! beatmap into the file generator, then load that file into the player and enjoy~

## TODO
Que es el audio.mp3 en index.html?

## Problemas a resolver
Problem 1:
hola
Extract OSU's beatmap information and do the parsing 

Problem 2:

Generate the labyrinth - DONE

Problem 3:

Generate the camera's movement - IN PROGRESS

Problem 4: 
Read the information generated by the labyrinth and model the 3D - DONE

Problem 5:

Mix the problema three and four

Problem 6:

Mix the camara with the beatmap hit point

## TODO
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

