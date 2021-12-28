# Music labyrinths [(live demo)](https://makobot-sh.github.io/music_labyrinths/)

Generate Labyrinth screensaver in the style of [Windows 95's 3d maze screensaver](https://www.youtube.com/watch?v=oRL5durPleI) that moves to the beat of your [OSU! beatmap](https://osu.ppy.sh) of choice! 
Load any OSU! beatmap into the file generator, then load that file into the player and enjoy~

## How to use
TODO

## TODO
- Gatear la carga de audio atrás de alguna interacción de usuario para que se pueda escuchar audio en navegadores no-firefox.
 Cambios cosméticos (especialmente agregar algún efecto de luz o cámara para marcar el ritmo, experimentamos bastante con esto pero aún no conseguimos nada que nos convenciera).
- Armar la interfaz para que se pueda elegir que canción cargar.

## Ideas for the future
- Use osu colors in labyrinth palette
- Generate screensaver once by loading file into the program, then running the program is parsing that file on the fly (no duplicate labyrinth generation or on the fly laybrinth generation) [Kind of done?]
- Volume slider during execution
- Pause button during execution

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

