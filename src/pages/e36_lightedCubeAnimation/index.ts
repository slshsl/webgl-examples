import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'
import { mat4, glMatrix, vec3 } from 'gl-matrix'

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

    //光线颜色--------------------------
    const u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0); //设置光线颜色为白色
    //---------------------------------------

    //光线方向--------------------------
    const u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection');
    let lightDirection = vec3.fromValues(0.5, 3.0, 4.0)    //设置光线方向（世界坐标系下）
    vec3.normalize(lightDirection, lightDirection);//归一化
    gl.uniform3fv(u_LightDirection, lightDirection);
    //---------------------------------------

    //
    const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

    let currentAngle = 0.0;
    const ANGLE_STEP = 45.0;

    let normalMatrix = mat4.create();

    var tick = function () {
        currentAngle = getNextAngle(currentAngle, ANGLE_STEP);//更新当前旋转角度

        //计算模型矩阵
        mat4.fromRotation(modelMatrix, glMatrix.toRadian(currentAngle), [0, 1, 0]);//围绕y轴旋转
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

        // 规则：用法向量乘以模型矩阵的逆转置矩阵，就可以求得变换后的法向量。
        mat4.invert(normalMatrix, modelMatrix)
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);

        // Clear color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw the cube
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
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([     // Colors
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v0-v5-v6-v1 up
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v7-v4-v3-v2 down
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0      // v4-v7-v6-v5 back
    ]);

    const normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
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

    if (!initArrayBuffer(gl, program, normals, 3, gl.FLOAT, 'a_Normal'))
        return -1;

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    data: Float32Array,
    num: number,
    type: number,
    attribute: string
) {
    var buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}

let last = Date.now();
function getNextAngle(angle: number, step: number) {
    const now = Date.now();
    const elapsed = (now - last);
    last = now;
    let newAngle = angle + (step * elapsed) / 1000.0;
    return newAngle %= 360;
}

main();

