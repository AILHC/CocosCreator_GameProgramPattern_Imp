import { makeMoveCommand, IConmand, IMoveCtrlComp } from "./CommandCreator";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleCtrlComp extends cc.Component implements IMoveCtrlComp {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        //用一个数组保存命令对象
        let cmdStack: Array<IConmand> = [];
        //监听键盘按下
        //使用箭头函数可以直接绑定this以及使用this时有智能提示
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (e: cc.Event.EventKeyboard) => {
            //这个看文档吧~
            let cmd: IConmand;
            let isUndo = false;
            switch (e.keyCode) {
                case cc.macro.KEY.w:
                    cmd = makeMoveCommand(this, this.x, this.y + 10);//向上
                    break;
                case cc.macro.KEY.s:
                    cmd = makeMoveCommand(this, this.x, this.y - 10);//向下
                    break;
                case cc.macro.KEY.a:
                    cmd = makeMoveCommand(this, this.x - 10, this.y);//向左
                    break;
                case cc.macro.KEY.d:
                    cmd = makeMoveCommand(this, this.x + 10, this.y);//向右
                    break;
                case cc.macro.KEY.space:
                    cmd = cmdStack.pop();//后退，放出刚刚执行的命令
                    isUndo = true;
                    break;
                default:
                    break;
            }
            if (!isUndo) {
                cmd.execute();
                cmdStack.push(cmd);//执行过的命令放入栈里
            }else{
                cmd.undo();
            }

        })
    }
    private _x: number;
    public get x(): number {
        return this.node.x;
    }
    private _y: number;
    public get y(): number {
        return this.node.y;
    }
    moveTo(x: number, y: number) {
        this.node.x = x;
        this.node.y = y;
    }
    // update (dt) {}
}
