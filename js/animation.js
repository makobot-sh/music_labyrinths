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

class Animation {
    constructor(obj){
        this.obj = obj;
    }

    move(dir,time){
        dir = movs.UP;
        //Default: no movement
        var tween = new TWEEN.Tween( this.obj.position ).to( {x:"+0"} , time);
        switch (dir) {
            case movs.UP:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"+0",y:"+0",z:"-30"}, time );
            case movs.DOWN:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"+0",y:"+0",z:"+30"}, time );
            case movs.LEFT:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"-30",y:"+0",z:"+0"}, time );
            case movs.RIGHT:
                tween = new TWEEN.Tween( this.obj.position ).to( {x:"+30",y:"+0",z:"+0"}, time );
            case movs.ROTL:
                tween = new TWEEN.Tween( this.obj.rotation ).to( {y: '+'+ninetyDeg} , rotSpeed);
            case movs.RIGHT:
                tween = new TWEEN.Tween( this.obj.rotation ).to( {y: '-'+ninetyDeg} , rotSpeed);
        }
        tween.start();
    }
}