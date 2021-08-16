import {ninetyDeg, rotSpeed} from './auxiliary.js';
export {
    movs,
    Animation
}

const movs = {
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
    ROTL: 5,
    ROTR: 6,
}

const movsN = {
    0: movs.NONE,
    1: movs.UP,
    2: movs.DOWN,
    3: movs.LEFT,
    4: movs.RIGHT,
    5: movs.ROTL,
    6: movs.ROTR,
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
                tween = new TWEEN.Tween( this.obj.rotation ).to( {y: '+'+ninetyDeg} , rotSpeed);
                break;
            case movs.RIGHT:
                tween = new TWEEN.Tween( this.obj.rotation ).to( {y: '-'+ninetyDeg} , rotSpeed);
                break;
        }
        //tween.start();
        return tween;
    }

    animateSeries(dirs, times){

    }
}