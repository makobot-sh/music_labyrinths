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
        selectMap();
        _hideStartMenu();
        document.getElementById("startMenu").style.display = "none";
        document.getElementById("debugHover").style.display = "flex";
    }
    
    await populateMapOptions();
    selectMap()
    await promiseStartButton;
}

async function populateMapOptions(){
    let mapOptions = await auxJs.getJson(auxJs.config["Maps"]["Maps folder"]+"/maps_index.json");
    let select = document.getElementById('mapSelect');

    let i = 0
    for (let map of mapOptions){
        var opt = document.createElement('option');
        opt.value = map;
        opt.innerText = map;
        if(i == 0){
            opt.selected = "selected"
        }
        select.appendChild(opt);
        i += 1;
    }
}

function selectMap(){
    let e = document.getElementById('mapSelect');
    let selectedMap = e.options[e.selectedIndex].text;
    let selectionSubpath = "/"+selectedMap+"/"+selectedMap

    let mapsPath = auxJs.config["Maps"]["Maps folder"]
    auxJs.config["Sound"]["Audio Path"] = mapsPath+selectionSubpath+"_audio.mp3"
    auxJs.config["Audio movement data"]["Hitpoints JSON"] = mapsPath+selectionSubpath+"_times.json"
    auxJs.config["Audio movement data"]["BPMs JSON"] = mapsPath+selectionSubpath+"_bpms.json"
    console.log(mapsPath+selectionSubpath+"_audio.mp3")
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