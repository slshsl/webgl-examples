import { getWebGLContext, initShaders } from '../../util/webgl-utils';
import vshader from './shaderSource.vs.glsl';
import fshader from './shaderSource.fs.glsl';
import { mat4, glMatrix } from 'gl-matrix';

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

    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
    }

    let currentAngle = 0.0;
    const ANGLE_STEP = 45.0;
    let modelMatrix = mat4.create();

    const tick = function () {
        currentAngle = getNextAngle(currentAngle, ANGLE_STEP);
        draw(gl, n, glMatrix.toRadian(currentAngle), modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
    };
    tick();
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram): number {
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    const n = 3; //点的个数

    //创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create thie buffer object");
        return -1;
    }

    //将缓冲区对象保存到目标上
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓存对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }

    //将缓冲区对象分配给a_Postion变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //连接a_Postion变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}

function draw(
    gl: WebGLRenderingContext,
    n: number,
    currentAngle: number,
    modelMatrix: mat4,
    u_ModelMatrix: WebGLUniformLocation
) {
    mat4.fromRotation(modelMatrix, currentAngle, [0.0, 0.0, 1.0]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
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

