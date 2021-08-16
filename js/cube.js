import * as aux from './auxiliary.js';
import {movs,Animation} from './animation.js';

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

generate_maze();
//tween_animation(cube);
var animCube = new Animation(cube);
animCube.move(movs.UP,2000);

//3. Create render/animate loop
// This creates a loop that causes the renderer to draw the scene *every time the screen is refreshed*
// Note: this pauses when the user navigates to another browser tab!
animate();

/* ============================================================== */

function tween_animation(obj){
    var tweenRot = new TWEEN.Tween( obj.rotation ).to( {y: '+'+aux.ninetyDeg} , aux.rotSpeed);
    var tweenDer = new TWEEN.Tween( obj.position ).to( {x:"+30",y:"+0",z:"+0"}, 2000 ).onComplete(function(){
        tweenRot.start();
    });
    
    var tweenUp = new TWEEN.Tween( obj.position ).to( {x:"+0",y:"+0",z:"-30"}, 2000 ).onComplete(function(){
        tweenRot.start();
    });
    
    var tweenDown = new TWEEN.Tween( obj.position ).to( {x:"+0",y:"+0",z:"+30"}, 2000 ).onComplete(function(){
        tweenRot.start();
    });

    var tweenLeft = new TWEEN.Tween( obj.position ).to( {x:"-30",y:"+0",z:"+0"}, 2000 ).onComplete(function(){
        tweenRot.start();
    });
    tweenDer.chain(tweenUp);
    tweenUp.chain(tweenLeft);
    tweenLeft.chain(tweenDown);
    tweenDown.chain(tweenDer);
    tweenDer.start()    
};

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


function generate_maze(){
    // 2. Adding the planes based in the JSON data
    //Read the JSON file
    fetch("../parser/data_lines.json")
    .then(response => response.json())
    .then(json => { 
        var incrementador = 0;
        //Generate the lines given by the JSON (the first two are omitted)
        for (var key in json) {
            incrementador = incrementador + 1
            if (incrementador > 2){
                let x1 = Math.floor(json[key].x1);
                let x2 = Math.floor(json[key].x2);
                let y1 = Math.floor(json[key].y1);
                let y2 = Math.floor(json[key].y2);
                if (y1 == y2){
                    aux.createPlane(scene, [30,30],0x00ffff, [x1,0,-y1], [0,0,0]);
                } else {
                    aux.createPlane(scene, [30,30],0xffff00, [x2-15,0,-y2+15], [0,90,0]);
                }
            };
        }
        //aux.createPlane(scene, [30,30],0x00ff00, [-15,0,-15], [0,90,0]);
    }
    );
    //aux.createPlane(scene, [30,30],0x00ff00, [x1,0,-y1], [0,0,0]);
}
