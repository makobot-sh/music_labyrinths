import {ninetyDeg, debugMode} from './auxiliary-three.js';
import {config, quit_direction} from './auxiliary-javascript.js';
export {
    movs,
    Animation,
    maskUP_NEGATE,
    maskDOWN_NEGATE,
    maskRIGHT_NEGATE,
    maskLEFT_NEGATE
}
import {positional_sound} from './cube.js';

const rotSpeedMult = config["Movements configs"]["Rotation speed multiplier"];
const blinkSpeed = config["Movements configs"]["Blink speed"];
const beatMultiplier = config["Movements configs"]["BPM multiplier"];
const jumpOn = config["Movements configs"]["Jump ON"];
const jumpSpeedUp = config["Movements configs"]["Jump speed up"];
const jumpSpeedDown = config["Movements configs"]["Jump speed down"];
const jumpHeight = config["Movements configs"]["Jump height"];
const audioTestOn = config["Audio test"]["Enable"];
const minMovLen = config["Movements configs"]["Min movement duration"];

const movs = {
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
    ROTL: 5,
    ROTR: 6,
}

// binary: 0bLRDU - Left, Right, Down, Up
const maskUP    = 0b0001;
const maskDOWN  = 0b0010;
const maskRIGHT = 0b0100;
const maskLEFT  = 0b1000;

const maskUP_NEGATE   = 0b1110;
const maskDOWN_NEGATE  = 0b1101;
const maskRIGHT_NEGATE = 0b1011;
const maskLEFT_NEGATE  = 0b0111;

function getMask(mov){
    let res;
    switch (mov) {
        case movs.UP:
            res = maskUP;
            break;
        case movs.DOWN:
            res = maskDOWN;
            break;
        case movs.RIGHT:
            res = maskRIGHT;
            break;
        case movs.LEFT:
            res = maskLEFT;
            break;
    }
    return res;
}

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

class Movement {
    constructor(mov){
        this.mov = mov;
    }
    
    forward(){ return this.mov; }

    behind(){
        let res;
        switch (this.mov) {
            case movs.UP:
                res = movs.DOWN;
                break;
            case movs.DOWN:
                res = movs.UP;
                break;
            case movs.RIGHT:
                res = movs.LEFT;
                break;
            case movs.LEFT:
                res = movs.RIGHT;
                break;
            case movs.ROTR:
                res = movs.ROTL;
                break;
            case movs.ROTL:
                res = movs.ROTR;
                break;
        }   
        return res;
    }

    left(){
        let res;
        switch (this.mov) {
            case movs.LEFT:
                res = movs.DOWN;
                break;
            case movs.RIGHT:
                res = movs.UP;
                break;
            case movs.UP:
                res = movs.LEFT;
                break;
            case movs.DOWN:
                res = movs.RIGHT;
                break;
        }   
        return res;
    }

    right(){
        let res;
        switch (this.mov) {
            case movs.LEFT:
                res = movs.UP;
                break;
            case movs.RIGHT:
                res = movs.DOWN;
                break;
            case movs.UP:
                res = movs.RIGHT;
                break;
            case movs.DOWN:
                res = movs.LEFT;
                break;
        }   
        return res;
    }

    set(mov){this.mov = mov;}

    mask(){ return getMask(this.mov); }
}

class Animation {
    constructor(obj){
        this.obj = obj;
    }

    move(dir, time){
        //Default: no movement
        var tween = new TWEEN.Tween( this.obj.position ).to( {x:"+0"} , time);
        switch (dir) {
            case movs.UP:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"+0",y:"+0",z:"-30"}, time );
                break;
            case movs.DOWN:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"+0",y:"+0",z:"+30"}, time );
                break;
            case movs.LEFT:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"-30",y:"+0",z:"+0"}, time );
                break;
            case movs.RIGHT:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"+30",y:"+0",z:"+0"}, time );
                break;
            case movs.ROTL:
                tween = new TWEEN.Tween( this.obj.rotation ).to( {y: '+'+ninetyDeg} , time);
                break;
            case movs.ROTR:
                tween = new TWEEN.Tween( this.obj.rotation ).to( {y: '-'+ninetyDeg} , time);
                break;
        }
        //tween.start();
        return tween;
    }

    async generateTimesFromBPM(timingPointArr){
        let timeCounter = timingPointArr[0]['start'];
        let times = [];
        let rotSpeeds = [];
        let startBPMIdx = 0;
        let nextBPMIdx = 1;
        while(startBPMIdx < timingPointArr.length -1){
            //Ignore relative bpm changes (because we don't understand them rn):
            while(nextBPMIdx < timingPointArr.length && timingPointArr[nextBPMIdx]['beatLen'] < 0) { nextBPMIdx++; }
            //The timingPointArr always ends with a timing point of beatLen 0 and start value of the last hitpoint available
            //so nextBPMIdx will be a valid index of timingPointArr

            let beatLen = timingPointArr[startBPMIdx]['beatLen'];
            while( beatLen < minMovLen ){ beatLen *= 2; }
            while( timeCounter + beatLen < timingPointArr[nextBPMIdx]['start']){
                //If the time to push wouldn't be able to complete itself, we won't push it
                times.push(timeCounter);
                rotSpeeds.push(beatLen * beatMultiplier * rotSpeedMult);
                timeCounter += beatLen;
            }
            //We push the next start point directly, which might make the last beat in a bpm section a bit longer
            //but we prefer this to a too short beat (might be dizzying)
            times.push(timingPointArr[nextBPMIdx]['start']);
            rotSpeeds.push(beatLen * rotSpeedMult);
            timeCounter = timingPointArr[nextBPMIdx]['start'];
            startBPMIdx = nextBPMIdx;
            nextBPMIdx = startBPMIdx+1;
        }
        console.log(times);
        return {"times": times, "rotSpeeds": rotSpeeds};
    }

    async generateMovements(walls, times, rotSpeeds){
        let pos = {"x" : 0, "y" : 0};
        let timer = times[0];
        var movements = [];
        let viewDir = new Movement(movs.UP);
        let rotSpeed = rotSpeeds[0];

        movements.push({ "mov" : movs.NONE, "t" : times[0], "beat" : true});
        for (let i = 1; i < times.length; ++i) {
            let beat = times[i];
            let dirs = [];
            let currWalls = walls[pos.y][pos.x];
            if(rotSpeeds.length>1){
                rotSpeed = rotSpeeds[i];
            }

            let movDuration = beat - timer;
            if ( movDuration > minMovLen ){
                if ( movDuration >= minMovLen+rotSpeed ){
                    // If difference is bigger than rotSpeed, i have enough time 
                    // to rotate and go to next point, else i can only move
                    // in the direction i was to be able to hit this time
                    if( (currWalls & getMask(viewDir.left())) != 0){ dirs.push(viewDir.left()) };
                    if( (currWalls & getMask(viewDir.right())) != 0){ dirs.push(viewDir.right()) };    
                }
                if ( (currWalls & viewDir.mask()) != 0){ dirs.push(viewDir.forward()) };

                // Only turn around if there's no other direction to go
                if ( (currWalls == getMask(viewDir.behind())) && (movDuration >= minMovLen+rotSpeed*2) ){
                    // Trapped, can only move behind
                    // Will only happen in this beat
                    dirs.push(viewDir.behind());
                    // Don't come back to this spot (we wall it off)
                    this.blockOffDeadEnd(viewDir, walls, pos);
                }

                if( dirs.length > 0 ){
                    let dir = dirs.sample();
                    let forwardDuration = movDuration;

                    if(dir == viewDir.left()) {
                        // need to rotate once
                        forwardDuration -= rotSpeed; //take out rotation duration from foward movement duration 
                        movements.push({ "mov" : movs.ROTL, "t" : rotSpeed, "beat" : true});
                    } else if (dir == viewDir.right()) {
                        // need to rotate once
                        forwardDuration -= rotSpeed;
                        movements.push({ "mov" : movs.ROTR, "t" : rotSpeed, "beat" : true});
                    } else if (dir == viewDir.behind()) {
                        // need to rotate twice
                        forwardDuration -= rotSpeed*2;
                        movements.push({ "mov" : movs.ROTR, "t" : rotSpeed, "beat" : true});
                        movements.push({ "mov" : movs.ROTR, "t" : rotSpeed, "beat" : false});
                    }                
                    movements.push({ "mov" : dir, "t" : forwardDuration, "beat" : dir == viewDir.forward()});
                    timer += movDuration;
                    viewDir.set(dir);

                    switch (dir) {
                        case movs.LEFT:
                            pos.x -= 1;
                            break;
                        case movs.RIGHT:
                            pos.x += 1;
                            break;
                        case movs.UP:
                            pos.y += 1;
                            break;
                        case movs.DOWN:
                            pos.y -= 1;
                            break;
                    }
                }
                
                //If no movement was pushed, we skip this beat
                continue;
            } else {
                // beat <= timer
                // Last movement took too long, so this beat is skipped
                continue;
            }
        }
        return movements;
    }

    blockOffDeadEnd(viewDir, walls, pos) {
        switch (viewDir.behind()) {
            case movs.UP:
                quit_direction(walls, pos.x, pos.y, maskUP_NEGATE);
                quit_direction(walls, pos.x, pos.y + 1, maskDOWN_NEGATE);
                break;
            case movs.DOWN:
                quit_direction(walls, pos.x, pos.y, maskDOWN_NEGATE);
                quit_direction(walls, pos.x, pos.y - 1, maskUP_NEGATE);
                break;
            case movs.LEFT:
                quit_direction(walls, pos.x, pos.y, maskLEFT_NEGATE);
                quit_direction(walls, pos.x - 1, pos.y, maskRIGHT_NEGATE);
                break;
            case movs.RIGHT:
                quit_direction(walls, pos.x, pos.y, maskRIGHT_NEGATE);
                quit_direction(walls, pos.x + 1, pos.y, maskLEFT_NEGATE);
                break;
        }
    }

    async animateSeries(movements){
        // movements is an array of objects with the following properties:
        //    mov  : the type of movement (a value like those in the "movs" dict)
        //    t    : the duration of the movement
        //    beat : whether the movement is on beat or not
        var firstTween = this.move(movements[0].mov,movements[0].t);
        var lastTween = firstTween;
        for (let i = 1; i < movements.length; ++i) {
            let action = movements[i];
            let nextTween = this.move(movements[i].mov,movements[i].t);
            let tweens = [nextTween]
            if(action.beat){
                if(audioTestOn){
                    nextTween.onStart( function() { 
                        positional_sound.play();
                    } );
                }
                if(debugMode){
                    //make cube blink
                    let blinkTween = new TWEEN.Tween( this.obj.material.color ).to( {"r":1,"g":0,"b":0}, blinkSpeed).chain(new TWEEN.Tween( this.obj.material.color ).to( {"r":0,"g":1,"b":0}, blinkSpeed));
                    tweens.push(blinkTween);
                }
                if(jumpOn){
                    let jumpTweenUp   = new TWEEN.Tween( this.obj.position       ).to( {y:"-"+jumpHeight}, jumpSpeedUp);
                    //jumpTweenUp.easing(TWEEN.Easing.Cubic.In);
                    let jumpTweenDown = new TWEEN.Tween( this.obj.position       ).to( {y:"+"+jumpHeight}, jumpSpeedDown);
                    //jumpTweenDown.easing(TWEEN.Easing.Cubic.Out);
                    jumpTweenUp.chain(jumpTweenDown);
                    tweens.push(jumpTweenUp);
                }
            }
            if(tweens.length==3){lastTween.chain(tweens[0],tweens[1],tweens[2]);};
            if(tweens.length==2){lastTween.chain(tweens[0],tweens[1]);};
            if(tweens.length==1){lastTween.chain(tweens[0]);};
            lastTween = nextTween;
        }
        return firstTween;
    }
}