var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
//関数
var funcs;
(function (funcs) {
    funcs.uzumaki = function (t) { return new Point(t / 5 * Math.cos(t / 5), t / 5 * Math.sin(t / 5)); };
    funcs.lissajous = function (t) { return new Point(80 * Math.cos(t / 8), 80 * Math.sin(t / 3)); };
    funcs.sin = function (t) { return new Point(t / 2.5 - 100, 80 * Math.sin(t / 10)); };
    funcs.koiru = function (t) { return new Point(t / 2.5 - 100 + 10 * Math.cos(t / 8), 80 * Math.sin(t / 8)); };
})(funcs || (funcs = {}));
render();
//再描画
function render() {
    var fv = document.getElementById('f').value;
    var theta = Number(document.getElementById('theta').value);
    var D = Number(document.getElementById('d').value);
    p(funcs[fv], theta, D);
}
function p(f, theta, D) {
    var MAX_TIME = 500;
    var xys = [];
    for (var i = 0; i <= MAX_TIME; i++) {
        var pt = f(i);
        xys.push(pt);
    }
    render1(xys, MAX_TIME, theta);
    var r = deg2rad(theta);
    //傾きthetaの軸に対する射影
    var xs = xys.map(function (_a) {
        var x = _a.x, y = _a.y;
        return Math.cos(-r) * x - Math.sin(-r) * y;
    });
    //x座標の描画
    render2(xs, MAX_TIME);
    //差をとる
    var xys2 = [];
    for (var i = 0; i <= MAX_TIME - D; i++) {
        var x1 = xs[i], x2 = xs[i + D];
        xys2.push(new Point(x1, x2));
    }
    render3(xys2, MAX_TIME - D);
}
//0からtoまで関数を描画
function render1(xys, to, theta) {
    var canvas = document.getElementById('graph1');
    var context = canvas.getContext('2d');
    var width = canvas.width, height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.save();
    context.scale(1, -1);
    context.translate(width / 2, -height / 2);
    context.beginPath();
    var _a = xys[0], x0 = _a.x, y0 = _a.y;
    context.moveTo(x0, y0);
    for (var i = 1; i <= to; i++) {
        var _b = xys[i], x = _b.x, y = _b.y;
        context.lineTo(x, y);
    }
    context.stroke();
    //軸を描画
    var r = deg2rad(theta);
    context.strokeStyle = "#ff0000";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(150 * Math.cos(r), 150 * Math.sin(r));
    context.lineTo(-150 * Math.cos(r), -150 * Math.sin(r));
    context.stroke();
    context.restore();
}
function deg2rad(deg) {
    return deg * Math.PI / 180;
}
//x座標を描画
function render2(xs, to) {
    var canvas = document.getElementById('graph2');
    var context = canvas.getContext('2d');
    var width = canvas.width, height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.save();
    //最大最小を探す
    var max = Math.max.apply(Math, xs), min = Math.min.apply(Math, xs);
    var range = max - min, center = (min + max) / 2;
    console.log(min, max, range, center);
    context.translate(0, -center);
    context.scale(1, range / 200);
    context.translate(0, height / 2);
    context.scale(1, -1);
    context.lineWidth = 1;
    context.strokeStyle = "#999999";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.stroke();
    context.strokeStyle = "#0000ff";
    context.beginPath();
    var x0 = xs[0];
    context.moveTo(0, x0);
    for (var i = 1; i <= to; i++) {
        var x = xs[i];
        context.lineTo(i * width / to, x);
    }
    context.stroke();
    context.restore();
}
function render3(xys, to) {
    var canvas = document.getElementById('graph3');
    var context = canvas.getContext('2d');
    var width = canvas.width, height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.save();
    context.scale(1, -1);
    context.translate(width / 2, -height / 2);
    context.beginPath();
    var _a = xys[0], x0 = _a.x, y0 = _a.y;
    context.moveTo(x0, y0);
    for (var i = 1; i <= to; i++) {
        var _b = xys[i], x = _b.x, y = _b.y;
        context.lineTo(x, y);
    }
    context.stroke();
    context.restore();
}
