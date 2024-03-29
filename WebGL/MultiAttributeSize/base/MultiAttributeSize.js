// MultiPoints.js
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'gl_PointSize=a_PointSize;\n' +
    'v_Color=a_Color;\n'+
    '}\n';

//片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
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

    //设置顶点位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // 清除 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三个点
    gl.drawArrays(gl.POINTS, 0, n);//n is 3
}

function initVertexBuffers(gl) {
    var verticesSizes = new Float32Array([
        //顶点坐标、尺寸、颜色
        0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
        0.5, -0.5, 30.0, 0.0, 0.0, 1.0
    ]);
    var n = 3;//点的个数
    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    var sizeBuffer = gl.createBuffer();
    var colorBuffer=gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    //获取attribute变量的储存位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);


    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,verticesSizes,gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(gl.program,'a_Color');
    if(a_Color<0){
        console.log('Failed to get the stornge location of a_Color');
        return;
    }
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*6,FSIZE*3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}


