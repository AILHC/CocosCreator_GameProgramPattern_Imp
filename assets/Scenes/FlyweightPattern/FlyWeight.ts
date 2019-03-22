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
export default class FlyWeight extends cc.Component {

    selectPiecesType: string = "b";

    // LIFE-CYCLE CALLBACKS:


    start() {
        let g = this.getComponent(cc.Graphics);
        let piecesFactory = new PiecesFactory();
        //画个棋盘
        let w = 40;//方格宽度和高度
        let rw = 400;//棋盘的宽高
        let x = -200, y = -200;
        g.strokeColor = cc.Color.BLUE;
        // g.rect(x, y, rw, rw);//设置绘制的矩形样式
        // g.stroke();//绘制
        // g.clear();//清理这次绘制的样式

        for (let i = 0; i <= 10; i++) {
            //第i条竖直线
            g.moveTo(x + (i * w), y);//移起点
            g.lineTo(x + (i * w), y + rw);//画到哪里？
            g.stroke();//画
            //第i条横线
            g.moveTo(x, y + (i * w));
            g.lineTo(x + rw, y + (i * w));
            g.stroke();
        }
        //监听点击
        this.node.on(cc.Node.EventType.MOUSE_DOWN, (e: cc.Event.EventMouse) => {
            //先简单粗暴的绘制

            let cpieces = piecesFactory.getChessPieces(this.selectPiecesType);
            //将世界坐标转换为节点的局部坐标 将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点
            let point = this.node.convertToNodeSpaceAR(e.getLocation())
            //实现精确点击，YEAH!!~
            //和原点坐标相减
            let subResultX = point.x - x;
            let subResultY = point.y - y;
            
            let xi = Math.round(subResultX/w);//看在那个格子
            let yi = Math.round(subResultY/w)
            if(yi<0||xi<0||yi>10||xi>10){
                //不下子，因为在棋盘外
                return;
            }
            let newPoint = new cc.Vec2(x+ (xi*w),y+(yi*w));
            cpieces.downPieces(g, newPoint);
        }, this)
        // 关于点击穿透：
        //CocosCreator提供了一个官方组件：BlockInputEvents  https://docs.cocos.com/creator/manual/zh/components/block-input-events.html
        // BlockInputEvents 组件将拦截所属节点 bounding box 内的所有输入事件（鼠标和触摸），防止输入穿透到下层节点，一般用于上层 UI 的背景。
        //怎么精确点击呢？
    }
    onSelected(target: cc.Toggle, eventData: string) {

        this.selectPiecesType = eventData;
    }

    // update (dt) {}
}
/**
 * 抽象享元角色：棋子
 */
export interface IChessPieces {
    downPieces(g: cc.Graphics, p: cc.Vec2);
}
/**
 * 白棋子
 */
export class WhitePieces implements IChessPieces {
    downPieces(g: cc.Graphics, p: cc.Vec2) {
        // g.clear();
        g.fillColor = cc.Color.WHITE;
        g.strokeColor = cc.Color.WHITE;
        g.circle(p.x, p.y, 10);
        g.stroke();
        g.fill();
    }

}
/**
 * 黑棋子
 */
export class BlackPieces implements IChessPieces {
    downPieces(g: cc.Graphics, p: cc.Vec2) {
        // g.clear();

        g.fillColor = cc.Color.BLACK;
        g.strokeColor = cc.Color.BLACK;
        g.circle(p.x, p.y, 10);
        g.stroke();
        g.fill();
    }
}
/**
 * 享元工厂
 */
export class PiecesFactory {
    private map;
    constructor() {
        this.map = {};
        this.map["w"] = new WhitePieces();
        this.map["b"] = new BlackPieces();
    }
    /**
     * 获取棋子
     * @param type 
     */
    public getChessPieces(type: string): IChessPieces {
        if (type && type.trim() !== "") {
            return this.map[type];
        }
    }
}