import * as aux from './auxiliary.js';
// 0. Our Javascript will go here.
// 1. Creating the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, //FOV (in degrees)
    window.innerWidth / window.innerHeight, //Aspect ratio
    1, //Near clipping plane (objects nearer won't be rendered)
    500 ); //Far clipping plane (object further won't be rendered)

camera.position.set( -25, 0, 50);
//camera.lookAt( 0, 0, 0 )

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, //Size at which we render our app (width, height)
    window.innerHeight, 
    true); //UpdateStyle (Ommitable): if set to false, size of app is same as canvas but is rendered at lower resolution
    //eg: etSize(window.innerWidth/2, window.innerHeight/2, false) renders app at half resolution
document.body.appendChild( renderer.domElement ); //<canvas> element our renderer uses to display the scene to us

// 2. Adding the plane
//yellow walls
aux.createPlane(scene, [100,50],0xffff00, [-50,0,0], [0,90,0]);
aux.createPlane(scene, [200,50],0xffff00, [0,0,0], [0,90,0]);
//cyan walls
aux.createPlane(scene, [200,50],0x00ffff, [0 - 200/2,0,-100], [0,0,0]);
aux.createPlane(scene, [100,50],0x00ffff, [-50 -100/2,0,-50], [0,0,0]);
//green walls
aux.createPlane(scene, [100,50],0x00ff00, [0 -50 -100  ,0,0], [0,90,0]);
aux.createPlane(scene, [200,50],0x00ff00, [0 -200,0,0], [0,90,0]);
//


var targetPos = new THREE.Vector3( -25, 0, -75 );
var rotLeft = aux.deg2rad(90);
console.log(rotLeft);
var tween1 = new TWEEN.Tween( camera.position ).to( targetPos, 1000 );
var tween2 = new TWEEN.Tween( camera.rotation ).to( {y: aux.ninetyDeg} , aux.rotSpeed);

tween1.chain(tween2);
tween1.start();


//3. Create render/animate loop
// This creates a loop that causes the renderer to draw the scene *every time the screen is refreshed*
// Note: this pauses when the user navigates to another browser tab!
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
animate();