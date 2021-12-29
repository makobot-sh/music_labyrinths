# Music labyrinths [(live demo)](https://makobot-sh.github.io/music_labyrinths/)

Generate Labyrinth screensaver in the style of [Windows 95's 3d maze screensaver](https://www.youtube.com/watch?v=oRL5durPleI) that moves to the beat of your [OSU! beatmap](https://osu.ppy.sh) of choice! 
Load any OSU! beatmap into the file generator, then load that file into the player and enjoy~

## Como cargar nuevos mapas 

Para cargar mapas no incluídos en la demo es necesario descargar el proyecto y correrlo localmente como se describe. Se debe contar con python3. Ahora mismo se recomienda correr localmente en Linux (ver nota más abajo).

- Descargar de https://osu.ppy.sh/beatmapsets el archivo `.osz` del mapa que se desee colocar en la aplicación.
- Correr el progrmaa `osz_parser.py` del siguiente modo: `python3 osu_parser.py path/to/osz` y seleccionar las opciones que correspondan cuando dicho programa lo requiera.
- Levantar un servidor local, recomendamos el que viene con python3: `python3 -m http.server`. Incluímos archivos `.sh` y `.cmd` para agilizar este paso.
- Abrir la aplicación (se encontrará en localhost en el puerto seleccionado, por defecto en http://localhost:8080/). En la selección de mapas debería aparecer el mapa nuevamente añadido!

**Nota sobre soporte:** el soporte de parseo de mapas en Windows es experimental, especialmente la creación de laberintos aleatorios puede fallar. Si se desea agregar un mapa, recomendamos usar Linux o. Si quiere usar Windows y al correr `osz_parser.py` falla la creación del laberinto, correr el ejecutable de c `mazegen` por cuenta propia (generará un archivo .svg) y luego correr `python3 svg_parser.py path/to/svg` a mano. Alternativamente, se puede copiar alguno de los `maze.json` de los mapas de demo incluidos a la carpeta que se genera para el mapa parseado.

## Como cargar nuevos texture packs

Para cargar mapas no incluídos en la demo es necesario descargar el proyecto y correrlo localmente como se describió en la sección anterior.

Incorporamos un sistema de *texture packs* que permiten cambiar la apariencia del laberinto durante la pantalla de inicio de la aplicación. Cada texture pack permite especificar distintas imágenes para cada una de las superficies del laberinto (suelo, techo, paredes, entradas) y cuanto se repiten horizontal y verticalmente a lo largo de dichas superficies las texturas. Agregar un nuevo texture pack es muy sencillo, se puede realizar copiando alguno de los .json existentes en la carpeta `config/resorce_packs`y modificando las imagenes a las que se apunta. El nombre del resource pack (sin .json) debe ser incluido en `texture_index.json` para que aparezca como opción en el menú de inicio de la aplicación.

## Ideas for the future
- Use osu colors in labyrinth palette
- Volume slider during execution
- Pause button during execution

