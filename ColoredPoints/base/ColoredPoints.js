// ClickedPoints.js
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'gl_PointSize=10.0;\n' +
    '}\n';

//片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n'+
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';


function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');

    // 获取WebGL上下文
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    //获取a_Position变量的储存位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    //获取u_FragColor变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    //注册鼠标点击事件响应函数
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position,u_FragColor); };

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // 清除 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}
var g_points = [];//鼠标点击位置数组
var g_colors = [];//存储点颜色的数组
function click(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX;//鼠标点击处的X坐标
    var y = ev.clientY;//鼠标点击处的Y坐标
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    //将坐标储存到g_points数组中
    g_points.push([x,y]);
    //将点的颜色储存到g_colors数组中
    if (x >= 0.0 && y >= 0.0) {     //第一象限
        g_colors.push([1.0, 0.0, 0.0, 1.0]);//红色
    } else if (x < 0.0 && y < 0.0) {    //第三象限
        g_colors.push([0.0, 1.0, 0.0, 1.0]);//绿色
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);//白色
    }

    // 清除 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
        
    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];
        //将点的位置传递到变量a_Position变量中
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        //将点的颜色传递到变量u_FragColor变量中
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //绘制一个点
        gl.drawArrays(gl.POINTS, 0, 1);
    }    
}


