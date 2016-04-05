class Point{
    constructor(public x:number, public y:number){
    }
}

type Func2d = (t:number)=>Point;

//関数
namespace funcs{
    export const uzumaki:Func2d = (t:number)=> new Point(t/5*Math.cos(t/5), t/5*Math.sin(t/5));
    export const uzumaki2:Func2d = (t:number)=>{
        let r = t/6*(1+0.2*Math.cos(t));
        return new Point(r*Math.cos(t/20), r*Math.sin(t/20));
    };
    export const lissajous:Func2d = (t:number)=> new Point(80*Math.cos(t/8), 80*Math.sin(t/3));
    export const sin:Func2d = (t:number)=> new Point(t/2.5-100, 80*Math.sin(t/10));
    export const koiru:Func2d = (t:number)=> new Point(t/2.5-100+10*Math.cos(t/8), 80*Math.sin(t/8));
}

render();

//再描画
function render(){
    const fv=(document.getElementById('f') as HTMLSelectElement).value;
    const theta = Number((document.getElementById('theta') as HTMLInputElement).value);
    const D = Number((document.getElementById('d') as HTMLInputElement).value);
    p(funcs[fv], theta, D);
}

function p(f:Func2d, theta:number, D:number){
    const MAX_TIME = 500;
    const xys:Array<Point> = [];
    for(let i=0;i<=MAX_TIME;i++){
        const pt = f(i);
        xys.push(pt);
    }
    render1(xys,MAX_TIME, theta);
    const r = deg2rad(theta);

    //傾きthetaの軸に対する射影
    const xs = xys.map(({x,y})=> Math.cos(-r)*x-Math.sin(-r)*y);
        
    //x座標の描画
    render2(xs, MAX_TIME);

    //差をとる
    const xys2:Array<Point> = [];
    for(let i=0;i<=MAX_TIME-D; i++){
        const x1=xs[i], x2=xs[i+D];
        xys2.push(new Point(x1, x2));
    }
    render3(xys2,MAX_TIME-D);

}
//0からtoまで関数を描画
function render1(xys:Array<Point>,to:number, theta:number):void{

    const canvas = document.getElementById('graph1') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const {width, height} = canvas;

    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#000000";
    context.lineWidth = 1;

    context.save();
    context.scale(1, -1);
    context.translate(width/2, -height/2);

    context.beginPath();
    const {x:x0, y:y0} = xys[0];
    context.moveTo(x0, y0);

    for(let i=1; i<=to; i++){
        const {x,y} = xys[i];
        context.lineTo(x, y);
    }
    context.stroke();

    //軸を描画
    const r = deg2rad(theta);
    context.strokeStyle="#ff0000";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(150*Math.cos(r), 150*Math.sin(r));
    context.lineTo(-150*Math.cos(r), -150*Math.sin(r));
    context.stroke();

    context.restore();
}

function deg2rad(deg:number):number{
    return deg*Math.PI/180;
}
//x座標を描画
function render2(xs:Array<number>,to:number):void{

    const canvas = document.getElementById('graph2') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const {width, height} = canvas;

    context.clearRect(0, 0, width, height);
    context.save();

    //最大最小を探す
    const max = Math.max(...xs), min=Math.min(...xs);
    const range = max-min, center=(min+max)/2;
    console.log(min, max, range, center);

    context.translate(0,-center);
    context.scale(1, range/200);
    context.translate(0,height/2);
    context.scale(1, -1);

    context.lineWidth = 1;
    context.strokeStyle="#999999";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.stroke();
    context.strokeStyle = "#0000ff";

    context.beginPath();
    const [x0] = xs;
    context.moveTo(0, x0);

    for(let i=1; i<=to; i++){
        const x = xs[i];
        context.lineTo(i*width/to, x);
    }
    context.stroke();

    context.restore();
}
function render3(xys:Array<Point>,to:number):void{

    const canvas = document.getElementById('graph3') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const {width, height} = canvas;

    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#000000";
    context.lineWidth = 1;

    context.save();
    context.scale(1,-1);
    context.translate(width/2, -height/2);

    context.beginPath();
    const {x:x0, y:y0} = xys[0];
    context.moveTo(x0, y0);

    for(let i=1; i<=to; i++){
        const {x,y} = xys[i];
        context.lineTo(x, y);
    }
    context.stroke();

    context.restore();
}
