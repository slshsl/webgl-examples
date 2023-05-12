import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'
import { mat4, glMatrix } from 'gl-matrix'

function main() {
    const canvas = document.getElementById('webgl') as HTMLCanvasElement;

    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //初始化着色器
    const program = initShaders(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to initialize shaders.');
        return;
    }

    //设置顶点位置
    const n = initVertexBuffers(gl, program);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl.clearColor(0, 0, 0, 1);

    //开启隐藏面消除
    gl.enable(gl.DEPTH_TEST);

    //模型矩阵------------------------------
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    var modelMatrix = mat4.create();
    mat4.fromTranslation(modelMatrix, [0, 0, 0]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
    //---------------------------------------

    //视图矩阵------------------------------
    const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    //设置视点、视线、上方向
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [3.06, 2.5, 10.0], [0, 0, -2], [0, 1, 0]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
    //---------------------------------------

    //投影矩阵--------------------------
    const u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");
    //设置视点、视线、上方向
    const projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable the polygon offset function
    gl.enable(gl.POLYGON_OFFSET_FILL);

    gl.drawArrays(gl.TRIANGLES, 0, n / 2); // The green triangle

    gl.polygonOffset(1.0, 1.0); // Set the polygon offset

    gl.drawArrays(gl.TRIANGLES, n / 2, n / 2); // The yellow triangle
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram): number {

    const n = 6; //点的个数

    const verticesColors = new Float32Array([
        // Vertex coordinates and color
        0.0, 2.5, -5.0, 0.4, 1.0, 0.4, // The green triangle
        -2.5, -2.5, -5.0, 0.4, 1.0, 0.4,
        2.5, -2.5, -5.0, 1.0, 0.4, 0.4,

        0.0, 3.0, -5.0, 1.0, 0.4, 0.4, // The yellow triagle
        -3.0, -3.0, -5.0, 1.0, 1.0, 0.4,
        3.0, -3.0, -5.0, 1.0, 1.0, 0.4,
    ]);

    const FSIZE = verticesColors.BYTES_PER_ELEMENT;

    //创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create thie buffer object");
        return -1;
    }

    //将缓冲区对象保存到目标上
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓存对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }

    //将缓冲区对象分配给a_Postion变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

    //连接a_Postion变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    const a_Color = gl.getAttribLocation(program, 'a_Color');
    if (a_Color < 0) {
        console.log("Failed to get the storage location of a_Color");
        return -1;
    }

    //将缓冲区对象分配给a_Color变量
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);

    //连接a_Color变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Color);

    return n;
}

main();

