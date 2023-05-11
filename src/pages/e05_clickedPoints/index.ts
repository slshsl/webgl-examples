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

    const a_Position = gl.getAttribLocation(program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    const a_PointSize = gl.getAttribLocation(program, "a_PointSize");
    if (a_PointSize < 0) {
        console.log("Failed to get the storage location of a_PointSize");
        return;
    }

    //获取u_FragColor 变量存储位置
    const u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    //注册鼠标点击事件响应函数
    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position);
    };

    gl.vertexAttrib1f(a_PointSize, 10.0);

    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points: number[] = []; //鼠标点击位置数组

function click(ev: MouseEvent, gl: WebGLRenderingContext, canvas: HTMLCanvasElement, a_Position: number) {
    let x = ev.clientX;
    let y = ev.clientY;
    const rect = (ev.target! as HTMLCanvasElement).getBoundingClientRect();
    x = (x - rect.left - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    //将坐标存储到g_points数组中
    g_points.push(x);
    g_points.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const len = g_points.length;
    for (let i = 0; i < len; i += 2) {
        //将点的位置传递到变量中
        gl.vertexAttrib4f(a_Position, g_points[i], g_points[i + 1], 0.0, 1.0);

        //绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

main();

