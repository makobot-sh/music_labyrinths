import * as auxJs from './auxiliary-javascript.js';
import * as auxThree from './auxiliary-three.js';
import {movs,Animation, maskUP_NEGATE, maskDOWN_NEGATE, maskRIGHT_NEGATE, maskLEFT_NEGATE} from './animation.js';

var audio_settings = auxJs.config["Sound"]
var scene_obj = new auxThree.Scene(auxJs.config)
var cube = auxThree.create_cube()

var renderer = scene_obj.renderer
var camera = scene_obj.camera
var scene = scene_obj.scene

var subject = camera
cube.position.set( 0, 0, -15);

if (auxThree.debugMode){
    camera.position.set( 0, 300, -100);
    camera.lookAt( 0, 0, -100)
    subject = cube;
    scene.add(cube); // by default, it is added at (0,0,0)
} else {
    camera.position.set( 0, 0, -15);
    scene.add(cube); 
}


var audio_file = audio_settings["Audio Path"];

const listener = new THREE.AudioListener();
camera.add( listener );

const sound = new THREE.Audio( listener );
let anim = new Animation(subject);

const done = await Promise.all([loadAudio(audio_settings),generateMazeAndMovement(anim, auxJs.config)]);

console.log("Starting all!")

//done[0].play();
done[1].start();
var floorPlane = auxThree.createPlane(scene, [600, 600], 0xff00ff, [cube.position.x,-5,0], [90,0,0]);
var roofPlane = auxThree.createPlane(scene, [800, 800], 0xAAAAAA, [cube.position.x,20,0], [90,0,0]);
//3. Create render/animate loop
// This creates a loop that causes the renderer to draw the scene *every time the screen is refreshed*
// Note: this pauses when the user navigates to another browser tab!
animate();

/* ============================================================== */


async function loadAudio(audio_settings){
    const audioLoader = new THREE.AudioLoader();

    let audioLoad = await new Promise(function(resolve, reject) {   // return a promise
        audioLoader.load( audio_file,
            // onLoad callback
            function( buffer ) {
                //TODO: sound.preload?
                sound.setBuffer( buffer );
                sound.setLoop( audio_settings["Loop"] );
                sound.setVolume( audio_settings["Volume"] );
                resolve();
            },  
            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // onError callback
            function ( err ) {
                console.log( 'Failed audio load' );
                reject();
            }
        )
    });
    console.log("Finished audio load");
    return sound;
}

async function generateMazeAndMovement(anim, config){
    // binary: 0bLRDU - Left, Right, Down, Up
    var matrix = await generate_maze(config["Maze"]);
    //let times = await loadAudioData(config["Audio movement data"], "Hitpoints JSON");
    let bpmsDict = await loadAudioData(config["Audio movement data"], "BPMs JSON");
    let timesAndRots = await anim.generateTimesFromBPM(bpmsDict);
    let movements = await anim.generateMovements(matrix, timesAndRots['times'], timesAndRots['rotSpeeds']);
    let startTween = await anim.animateSeries(movements);

    console.log("Finished animation load");

    return startTween;
}


function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    
    if(auxThree.debugMode){
        camera.position.set( cube.position.x, 300, cube.position.z );
    }

    floorPlane.position.set(subject.position.x, -15, subject.position.z);
    roofPlane.position.set(subject.position.x, 20, subject.position.z);

    renderer.render(scene, camera);
}

async function loadAudioData(audioConfig, key){
    //Read the JSON file
    var data = await auxJs.getJson(audioConfig[key]);
    return data;
}

async function generate_maze(config){
  
    //Read the JSON file
    var json = await auxJs.getJson(config["Maze JSON"])
    var incrementador = 0;
    var high = 30;
    var matrix = []

    //LRDU
    //Generate the lines given by the JSON (the first two are omitted)
    for (var key in json) {
        if (key == "Height"){
            var height = (json[key]+1)/high;
            matrix = auxJs.inicialize_square_matrix(height, 0b1111);
        }
        incrementador += 1; 
        if (incrementador > 2){
            let x1 = Math.floor(json[key].x1);
            let x2 = Math.floor(json[key].x2);
            let y1 = Math.floor(json[key].y1);
            let y2 = Math.floor(json[key].y2);
            let x_value = x1/high;
            let y_value = y1/high;
            if (y1 == y2){
                //0bLRDU 
                //The coordinates corresponds with the node that is above of them.
                if (y_value < height){
                    auxJs.quit_direction(matrix, x_value, y_value, maskDOWN_NEGATE)
                }
                //The Up direction is quit, we have to check if is not the limit of the maze
                if (y_value > 0){
                    auxJs.quit_direction(matrix, x_value, y_value - 1, maskUP_NEGATE)
                }
                auxThree.createPlane(scene, [30, high], 0x00ffff, [x1,0,-y1], [0,0,0]);
            } else {
                
                //The coordinates corresponds with the node that is at the right of them.
                if (x_value < height){
                    auxJs.quit_direction(matrix, x_value, y_value, maskLEFT_NEGATE)  
                }
            
                if (x_value > 0){
                    auxJs.quit_direction(matrix, x_value - 1, y_value, maskRIGHT_NEGATE)  
                }

                auxThree.createPlane(scene, [30, high], 0xffff00, [x2-15,0,-y2+15], [0,90,0]);    
            }

           
              
        };

    }
   
   

    //Wall off entry point
    auxThree.createPlane(scene, [30,30],0x00ff00, [-15,0,-15], [0,90,0]);
    auxJs.quit_direction(matrix, 0, 0, maskLEFT_NEGATE)
    return matrix;
}
