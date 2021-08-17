import * as auxJs from './auxiliary-javascript.js';
import * as auxThree from './auxiliary-three.js';
import {movs,Animation, maskUP_NEGATE, maskDOWN_NEGATE, maskRIGHT_NEGATE, maskLEFT_NEGATE} from './animation.js';

// 0. Our Javascript will go here.
// 1. Creating the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, //FOV (in degrees)
    window.innerWidth / window.innerHeight, //Aspect ratio
    1, //Near clipping plane (objects nearer won't be rendered)
    700 ); //Far clipping plane (object further won't be rendered)
var subject = camera;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, //Size at which we render our app (width, height)
window.innerHeight, 
true); //UpdateStyle (Ommitable): if set to false, size of app is same as canvas but is rendered at lower resolution
//eg: etSize(window.innerWidth/2, window.innerHeight/2, false) renders app at half resolution
document.body.appendChild( renderer.domElement ); //<canvas> element our renderer uses to display the scene to us

//2. Create the object we will move in place of the camera if on debug mode
const geometry = new THREE.BoxGeometry(10,10,10); //Object that contains all the vertices (points) and faces (fill) of the cube
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); //Three comes with various materials that take an object of properties to be applied to them. Here we only use color, in hexa.
const cube = new THREE.Mesh( geometry, material ); //a Mesh takes a geometry and applies a material to it. Meshes can be inserted on our scene and moved around.
cube.position.set( 0, 0, -15);

if (auxThree.debugMode){
    camera.position.set( 0, 300, -100);
    camera.lookAt( 0, 0, -100)
    subject = cube;
    scene.add( cube ); // by default, it is added at (0,0,0)
} else {
    camera.position.set( 0, 0, -15);
}

//let times = [1000,1500,2000,2500,2700,3000,3500,4000];
/*
let times = [1000]
for(var i = 0; i < 400; i++){
    times.push(i*500);
}
*/

var file = "./beatmaps/928482/aaudio.mp3"
const listener = new THREE.AudioListener();
camera.add( listener );

const sound = new THREE.Audio( listener );
let anim = new Animation(subject);

const done = await Promise.all([loadAudio(),generateMazeAndMovement(anim)]);

console.log("Starting all!")
//startTween.start();
//sound.play();
done[0].play();
done[1].start();

//3. Create render/animate loop
// This creates a loop that causes the renderer to draw the scene *every time the screen is refreshed*
// Note: this pauses when the user navigates to another browser tab!
animate();

/* ============================================================== */

async function loadAudio(){
    const audioLoader = new THREE.AudioLoader();

    let audioLoad = await new Promise(function(resolve, reject) {   // return a promise
        audioLoader.load( file,
            // onLoad callback
            function( buffer ) {
                //TODO: sound.preload?
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 0.1 );
                resolve();
            },  
            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // onError callback
            function ( err ) {
                console.log( 'Un error ha ocurrido' );
                reject();
            }
        )
    });
    console.log("Finished audio load");
    return sound;
}

async function generateMazeAndMovement(anim){
    // binary: 0bLRDU - Left, Right, Down, Up
    var matrix = await generate_maze();
    let times = await load_hitpoints();
    let movements = await anim.generateMovements(matrix, times);
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
    //4. Animating movement
    // 1200 
    // move from (0,0,0) to (0,0,-50)
    //plane.rotation.x += 0.01
    //plane.rotation.y += 0.01
    //camera.position.z -= 1
    renderer.render( scene, camera );
    //sound.pause();
}

async function load_hitpoints(){
    //Read the JSON file
    var json = await auxJs.getJson("../beatmaps/928482/928482_2.json")
    var hitpoints = []

    for (let t of json['times']){
        hitpoints.push(parseInt(t))
    }

    return hitpoints
}

async function generate_maze(){
  
    //Read the JSON file
    var json = await auxJs.getJson("../parser/data_lines.json")
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

                auxThree.createPlane(scene, [30,high],0xffff00, [x2-15,0,-y2+15], [0,90,0]);    
            }
        
        };
    }
    //Wall off entry point
    auxThree.createPlane(scene, [30,30],0x00ff00, [-15,0,-15], [0,90,0]);
    auxJs.quit_direction(matrix, 0, 0, maskLEFT_NEGATE)
    return matrix;
}
