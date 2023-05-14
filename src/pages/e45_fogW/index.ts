import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'
import { mat4, glMatrix } from 'gl-matrix'
import '@/assets/reset.css'

function main() {

    const canvas = document.getElementById('webgl') as HTMLCanvasElement;

    canvas.width = 400;
    canvas.height = 400;

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

    gl.viewport(0, 0, canvas.width, canvas.height);

    //开启隐藏面消除
    gl.enable(gl.DEPTH_TEST);

    //投影矩阵------------------------------------------------------------------------------------------
    const projMatrix = mat4.create();
    //设置投影矩阵
    mat4.perspective(projMatrix, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 1000);
    //-------------------------------------------------------------------------------------------------

    //视图矩阵------------------------------------------------------------------------------------------
    const eye = new Float32Array([25, 65, 35, 1.0]);
    const u_Eye = gl.getUniformLocation(program, 'u_Eye');
    gl.uniform4fv(u_Eye, eye);// Eye point

    const viewMatrix = mat4.create();
    //设置视点、视线、上方向
    mat4.lookAt(viewMatrix, [eye[0], eye[1], eye[2]], [0, 2, 0], [0, 1, 0]);
    //-------------------------------------------------------------------------------------------------

    //模型矩阵------------------------------------------------------------------------------------------
    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    const modelMatrix = mat4.create();
    mat4.fromTranslation(modelMatrix, [0, 0, 0]);
    mat4.scale(modelMatrix, modelMatrix, [10, 10, 10]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
    //-------------------------------------------------------------------------------------------------

    //MVP矩阵------------------------------------------------------------------------------------------
    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    const mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
    //-------------------------------------------------------------------------------------------------

    //雾的颜色
    const fogColor = new Float32Array([0.137, 0.231, 0.423]);
    //雾化的起，点和终点与视，点间的距离[起点距离，终，点距离]
    const fogDist = new Float32Array([55, 80]);

    const u_FogColor = gl.getUniformLocation(program, 'u_FogColor');
    const u_FogDist = gl.getUniformLocation(program, 'u_FogDist');

    gl.uniform3fv(u_FogColor, fogColor); // Colors

    gl.uniform2fv(u_FogDist, fogDist);   // Starting point and end point

    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);

    const tick = () => {

        // Clear color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Draw
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

        requestAnimationFrame(tick);
    };

    tick();

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
    const vertices = new Float32Array([
        1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,    // v0-v1-v2-v3 front
        1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,    // v0-v3-v4-v5 right
        1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1,    // v0-v5-v6-v1 up
        -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1,    // v1-v6-v7-v2 left
        -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,    // v7-v4-v3-v2 down
        1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1     // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([     // Colors
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ]);

    const indices = new Uint8Array([       // Indices of the vertices
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);

    // Create a buffer object
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer)
        return -1;

    // Write the vertex coordinates and color to the buffer object
    if (!initArrayBuffer(gl, program, vertices, 3, gl.FLOAT, 'a_Position'))
        return -1;

    if (!initArrayBuffer(gl, program, colors, 3, gl.FLOAT, 'a_Color'))
        return -1;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    data: BufferSource,
    num: number,
    type: number,
    attribute: string
) {
    const buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    const a_attribute = gl.getAttribLocation(program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}

main();

