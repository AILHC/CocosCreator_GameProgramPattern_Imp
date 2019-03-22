export interface IMoveCtrlComp{
    x;
    y;
    moveTo(x:number,y:number);
}

export interface IConmand {
    execute();
    undo();
}
/**
 * 用面向对象的方式
 */
export class MoveCommand implements IConmand {
    actor: IMoveCtrlComp;
    xBefore: number;
    private x:number;
    private y:number;
    yBefore: number;
    constructor(actor:IMoveCtrlComp,x:number,y:number){
        this.actor = actor;
        this.x = x;
        this.y = y;
    }
    execute() {
        this.xBefore = this.actor.x;
        this.yBefore = this.actor.y;
        this.actor.moveTo(this.x, this.y);
    }
    undo() {
        this.actor.moveTo(this.xBefore, this.yBefore);
    }


}
//使用函数式编程的方式创建命令
export function makeMoveCommand(actor: IMoveCtrlComp, x: number, y: number): IConmand {
    var xBefore, yBefore;
    return {
        execute() {
            xBefore = actor.x;
            yBefore = actor.y;
            actor.moveTo(x, y);
        },
        undo() {
            actor.moveTo(xBefore, yBefore);
        }
    }
}