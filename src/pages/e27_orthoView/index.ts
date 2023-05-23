import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'
import { mat4 } from 'gl-matrix'
import * as THREE from 'three'

function main() {
    const canvas = document.getElementById('webgl') as HTMLCanvasElement;

    const nf = document.getElementById("nearFar") as HTMLDivElement;

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

    const u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");

    //设置视点、视线、上方向
    const projMatrix = mat4.create();

    //注册键盘事件响应函数
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ProjMatrix!, projMatrix, nf);
    };

    draw(gl, n, u_ProjMatrix!, projMatrix, nf);

    const m1 = new THREE.Matrix4();

    m1.makeOrthographic(-1, 1, 1, -1, -1, 1)

    console.log(m1)

    const v1 = new THREE.Vector4(0.0, 0.5, 0.4, 1.0);

    console.log(v1.applyMatrix4(m1))

    const m2 = new THREE.Matrix4();
    const eye = new THREE.Vector3(0, 0, 2);
    const target = new THREE.Vector3(0, 0, 0);
    const up = new THREE.Vector3(0, 1, 0);
    m2.lookAt(eye, target, up);
    console.log(m2)

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    camera.position.set(1, 1, 2);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 1, 0)

    console.log(camera)


}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram): number {

    const n = 9; //点的个数

    const verticesColors = new Float32Array([
        0.0, 0.5, 0.4, 0.4, 1.0, 0.4, // The back green one
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        -0.5, 0.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
        0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, 0.5, 0.0, 1.0, 0.4, 0.4
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


let g_near = 0.0,
    g_far = 0.5;
function keydown(
    ev: KeyboardEvent,
    gl: WebGLRenderingContext,
    n: number,
    u_ProjMatrix: WebGLUniformLocation,
    projMatrix: mat4,
    nf: HTMLDivElement
) {
    switch (ev.keyCode) {
        case 39:
            g_near += 0.01;
            break; //right
        case 37:
            g_near -= 0.01;
            break; //left
        case 38:
            g_far += 0.01;
            break; //up
        case 40:
            g_far -= 0.01;
            break; //down
        default:
            return;
    }
    draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(
    gl: WebGLRenderingContext,
    n: number,
    u_ProjMatrix: WebGLUniformLocation,
    projMatrix: mat4,
    nf: HTMLDivElement
) {
    //设置视点和视线
    mat4.ortho(projMatrix, -1, 1, -1, 1, g_near, g_far);

    //将视图矩阵传递给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    //innerHTML在JS是双向功能：获取对象的内容  或  向对象插入内容；
    nf.innerHTML =
        "near: " +
        Math.round(g_near * 100) / 100 +
        ", far: " +
        Math.round(g_far * 100) / 100;

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

main();

