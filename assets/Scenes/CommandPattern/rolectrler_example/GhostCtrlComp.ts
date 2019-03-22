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
export default class GhostCtrlComp extends cc.Component implements IMoveCtrlComp {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property
    aiInterval: number = 0.1;//秒
    start() {
        //这是一个幽灵的AI，简单的AI，会随机产生移动移动命令（产生间隔自己设置）
        //使用箭头函数可以直接绑定this以及使用this时有智能提示
        let keys = [cc.macro.KEY.w, cc.macro.KEY.s, cc.macro.KEY.d, cc.macro.KEY.a];
        this.schedule(() => {
            let keyCode = keys[Math.ceil(Math.random()*keys.length)-1]
            this.onAIKeyDown(keyCode)
        }, this.aiInterval, cc.macro.REPEAT_FOREVER);
        
    }
    onAIKeyDown(keyCode) {
        let cmd: IConmand;
        switch (keyCode) {
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

            default:
                break;
        }
        cmd.execute();
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
