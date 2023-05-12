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
    mat4.lookAt(viewMatrix, [3, 3, 7], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
    //---------------------------------------

    //投影矩阵--------------------------
    const u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");
    //设置视点、视线、上方向
    const projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram): number {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    const verticesColors = new Float32Array([
        // Vertex coordinates and color
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 White
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 Magenta
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 Red
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3 Yellow
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4 Green
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5 Cyan
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6 Blue
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, // v7 Black
    ]);

    // 顶点索引
    const indices = new Uint8Array([
        //(Uint8Array)是无符号8位整型数
        0, 1, 2, 0, 2, 3, // front
        0, 3, 4, 0, 4, 5, // right
        0, 5, 6, 0, 6, 1, // up
        1, 6, 7, 1, 7, 2, // left
        7, 4, 3, 7, 3, 2, // down
        4, 7, 6, 4, 6, 5, // back
    ]);
    console.log(indices);

    // Create a buffer object
    const vertexColorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!vertexColorBuffer || !indexBuffer) {
        return -1;
    }

    // Write the vertex coordinates and color to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Position and enable the assignment
    const a_Position = gl.getAttribLocation(program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    // Assign the buffer object to a_Color and enable the assignment
    const a_Color = gl.getAttribLocation(program, "a_Color");
    if (a_Color < 0) {
        console.log("Failed to get the storage location of a_Color");
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    // 将顶点索引数据写入缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

main();

