import RoleCtrlComp from "./RoleCtrlComp";
export interface IMoveCtrlComp{
    x;
    y;
    moveTo(x:number,y:number);
}

export interface IConmand {
    execute();
    undo();
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