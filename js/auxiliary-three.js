import * as auxJs from './auxiliary-javascript.js';

export {
    ninetyDeg,
    debugMode,
    deg2rad,
    rad2deg,
    create_cube,
    TextureManager,
    Scene
}

class Scene {
    constructor(settings){
        var camera_settings = settings["Camera"]
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( camera_settings["FOV"], //FOV (in degrees)
                    window.innerWidth / window.innerHeight, //Aspect ratio
                    camera_settings["Near clipping plane"], //Near clipping plane (objects nearer won't be rendered)
                    camera_settings["Far clipping plane"]); //Far clipping plane (object further won't be rendered)
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, //Size at which we render our app (width, height)
                    window.innerHeight, 
                    true); //UpdateStyle (Ommitable): if set to false, size of app is same as canvas but is rendered at lower resolution
                    //eg: etSize(window.innerWidth/2, window.innerHeight/2, false) renders app at half resolution
        document.getElementById("player").appendChild(renderer.domElement); //<canvas> element our renderer uses to display the scene to us        
        this.renderer = renderer;
        this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 500);
        this.light = new THREE.AmbientLight( 0xFEFEFE , 1);
        this.scene.add(this.light);
    }
};

class TextureManager {
    constructor(settings, texturePackJson){
        this.textureEnable = settings["Enable"];
        if (this.textureEnable){
            this.texturePackPaths = texturePackJson;
            this.texturePack = {};
        }
    }

    getTexture(id){
        //return this.texturePack[id];
        let texture = undefined;
        if (this.textureEnable){
            if(this.textureEnable && !(id in this.texturePack) ){
                console.log("Getting texture for: " +id);
                let path = this.texturePackPaths[id];
                if (path != undefined && path["Enable"]){
                    texture = this.createTexture(path["Path"]);
                    this.texturePack[id] = texture;
                    texture.wrapS = THREE.RepeatWrapping; 
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(path["RepeatH"],path["RepeatV"]);
                } else {
                    texture = undefined;
                }
            } else {
                texture = this.texturePack[id];
            }
        }
       
        return texture;    
    }; 


    texturesEnable(){
        return this.texturesEnable;
    }

    
    createTexture(path){
        var texture = new THREE.TextureLoader().load(path);

        // assuming you want the texture to repeat in both directions:
        texture.wrapS = THREE.RepeatWrapping; 
        texture.wrapT = THREE.RepeatWrapping;
        return texture
    }

    createPlane(scene, dimentions, pos, deg, id, color = 0xAAAAAA){
        const geometry = new THREE.PlaneGeometry( dimentions[0], dimentions[1]);
        
        let texture = this.getTexture(id);
        if (id == undefined || texture == undefined){
            var material = new THREE.MeshPhongMaterial( {color: color, side: THREE.DoubleSide} );
        } else {
            var material = new THREE.MeshPhongMaterial({ map : texture });
        }
        const plane = new THREE.Mesh( geometry, material );
        plane.position.set(pos[0],pos[1],pos[2]);
        plane.receiveShadow = false;
        plane.material.side = THREE.DoubleSide;
        const rot = new THREE.Vector3(0, Math.PI /2, 0);
        plane.rotation.x = deg2rad(deg[0]);
        plane.rotation.y = deg2rad(deg[1]);
        plane.rotation.z = deg2rad(deg[2]);
        scene.add(plane);
        return plane;
    }
};
var ninetyDeg = '1.5707963267948966';
var debugMode = auxJs.config["Debug Mode"];

function deg2rad(deg){
    var pi = Math.PI;
    return deg * pi/180;
};

function rad2deg(radians){
    var pi = Math.PI;
    return radians * (180/pi);
};

function create_cube(){
    const geometry = new THREE.BoxGeometry(10,10,10); //Object that contains all the vertices (points) and faces (fill) of the cube
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); //Three comes with various materials that take an object of properties to be applied to them. Here we only use color, in hexa.
    const cube = new THREE.Mesh(geometry, material);
    return cube;
}



