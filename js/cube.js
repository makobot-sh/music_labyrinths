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

camera.position.set( 0, 300, -100);
camera.lookAt( 0, 0, -100)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, //Size at which we render our app (width, height)
    window.innerHeight, 
    true); //UpdateStyle (Ommitable): if set to false, size of app is same as canvas but is rendered at lower resolution
    //eg: etSize(window.innerWidth/2, window.innerHeight/2, false) renders app at half resolution
document.body.appendChild( renderer.domElement ); //<canvas> element our renderer uses to display the scene to us

//2. Create the object we will move in place of the camera (for now)
const geometry = new THREE.BoxGeometry(10,10,10); //Object that contains all the vertices (points) and faces (fill) of the cube
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); //Three comes with various materials that take an object of properties to be applied to them. Here we only use color, in hexa.
const cube = new THREE.Mesh( geometry, material ); //a Mesh takes a geometry and applies a material to it. Meshes can be inserted on our scene and moved around.
cube.position.set( 0, 0, -15);
scene.add( cube ); // by default, it is added at (0,0,0)

var matrix = generate_maze();
console.log(matrix)
//tween_animation(cube);
//var animCube = new Animation(cube);
//animCube.move(movs.UP,2000).chain(animCube.move(movs.DOWN,2000)).start();

let times = [1000,1100,1150,2000];
// binary: 0bLRDU - Left, Right, Down, Up
let walls = [
    new Uint8Array([0b0110,0b1101,0b1000]),
    new Uint8Array([0b0111,0b1100,0b1100]),
    new Uint8Array([0b0001,0b0100,0b1100])
];

let animCube = new Animation(cube);

console.log(animCube.generateMovements(walls, times));

//3. Create render/animate loop
// This creates a loop that causes the renderer to draw the scene *every time the screen is refreshed*
// Note: this pauses when the user navigates to another browser tab!
animate();

/* ============================================================== */



function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    //4. Animating movement
    // 1200 
    // move from (0,0,0) to (0,0,-50)
    //plane.rotation.x += 0.01
    //plane.rotation.y += 0.01
    //camera.position.z -= 1
    renderer.render( scene, camera );
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
            matrix = auxJs.inicialize_square_matrix(json[key], 0b1111);
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
    //Entry Point
    auxThree.createPlane(scene, [30,30],0x00ff00, [-15,0,-15], [0,90,0]);
    return matrix;
}
