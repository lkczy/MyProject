// RotatedColoredTriangle_Matrix.js
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ViewMatrix;\n'+
    'uniform mat4 u_ModelMatrix;\n'+
    'varying vec4 v_Color;\n' +//varying变量
    'void main(){\n' +
    'gl_Position = a_Position * u_ViewMatrix * u_ModelMatrix;\n' +
    'v_Color=a_Color;\n'+
    '}\n';

//片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n'+
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

    //设置顶点位置和颜色（蓝色三角形在最前面)
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // 清除 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //获取u_ViewMatrix和u_ModelMatrix的存储地址
    var u_ViewMatrix=gl.getUniformLocation(gl.program,'u_ViewMatrix');
    var u_ModelMatrix=gl.getUniformLocation(gl.program,'u_ModelMatrix');
    if(u_ViewMatrix<0){
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }
    if(u_ModelMatrix<0){
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    //设置视点、视线和上方向
    var viewMatrix=new Matrix4();
    viewMatrix.setLookAt(0.25, 0.25, 0.25,  0,0,0, 0,1,0);

    //计算旋转矩阵
    var modelMatrix=new Matrix4();
    modelMatrix.setRotate(-45,0,0,1);//围绕z轴旋转

    //将矩阵传给对应的uniform变量
    gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);

    //绘制三个点
    gl.drawArrays(gl.TRIANGLES, 0, n);//n is 3
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        //顶点坐标和点的颜色
        0.0,0.5,-0.4,   0.4,1.0,0.4,//绿色三角形在最后面
        -0.5,-0.5,-0.4, 0.4,1.0,0.4,
        0.5,-0.5,-0.4,  0.4,1.0,0.4,

        0.5,0.4,-0.2,   1.0,1.0,0.4,//黄色三角形在中间
        -0.5,0.4,-0.2,  1.0,1.0,0.4,
        0.0,-0.6,-0.2,  1.0,1.0,0.4,

        0.0,0.5,0.0,    0.4,0.4,1.0,//蓝色三角在最前面
        -0.5,-0.5,0.0,  0.4,0.4,1.0,
        0.5,-0.5,0.0,   0.4,0.4,1.0
    ]);
    var n = 9;//点的个数

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    var vertexColorBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    //将数据写入缓冲区对象
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    //获取attribute变量的储存位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}


