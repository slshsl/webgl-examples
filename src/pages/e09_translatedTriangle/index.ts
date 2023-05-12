import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'

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

    const Tx = 0.5, Ty = 0.5, Tz = 0.0;

    const u_Translation = gl.getUniformLocation(program, 'u_Translation');

    if (!u_Translation) {
        console.log("Failed to get the storage location of u_Translation");
        return;
    }

    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram): number {
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    const n = 4; //点的个数

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

main();

