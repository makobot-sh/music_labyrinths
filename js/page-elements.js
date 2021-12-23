import {done} from './musical-labyrinth.js';
import * as auxJs from './auxiliary-javascript.js';
export{
    beginningScreen,
    debugMenu
}

var audioOnButtonFlag = true;

async function beginningScreen(){
    var _hideStartMenu;
    var promiseStartButton = new Promise((resolve) => { _hideStartMenu = resolve });
    
    let p = document.getElementById("playButton"); // Encuentra el elemento "p" en el sitio
    p.onclick = function(){
        _hideStartMenu();
        document.getElementById("startMenu").style.display = "none";
        document.getElementById("debugHover").style.display = "flex";
    }
    
    await promiseStartButton;
}

function debugMenu(){
    let p1 = document.getElementById("audioButton"); // Encuentra el elemento "p" en el sitio
    p1.onclick = function(){
        if (audioOnButtonFlag){
            done[0].setVolume(0);
            audioOnButtonFlag = false;
            document.getElementById("audioButton").textContent = "Audio: disabled";
        } else {           
            var audio_settings = auxJs.config["Sound"];
            done[0].setVolume(audio_settings["Volume"]);
            audioOnButtonFlag = true;
            document.getElementById("audioButton").textContent = "Audio: enabled";
        }
    }
}