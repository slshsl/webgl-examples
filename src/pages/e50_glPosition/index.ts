import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'

let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext | null;
let program: WebGLProgram | null
let a_Position: number;
let a_PointSize: number;

main();

function main() {
    initCanvas();
    initContext();
    initProgram();
    initDatas();
    draw();
}

function initCanvas() {
    canvas = document.getElementById('webgl') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initContext() {
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
    }
}

function initProgram() {
    //初始化着色器
    program = initShaders(gl!, vshader, fshader);
    if (!program) {
        console.log('Failed to initialize shaders.');
    }
}

function initDatas() {
    a_Position = gl!.getAttribLocation(program!, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
    }

    a_PointSize = gl!.getAttribLocation(program!, "a_PointSize");
    if (a_PointSize < 0) {
        console.log("Failed to get the storage location of a_PointSize");
    }
}

function draw() {
    gl!.vertexAttrib4f(a_Position, 0.5, 0.0, 0.0, 1.0);

    gl!.vertexAttrib1f(a_PointSize, 10.0);

    gl!.clearColor(0.0, 0.0, 0.0, 1.0);

    gl!.clear(gl!.COLOR_BUFFER_BIT);

    gl!.drawArrays(gl!.POINTS, 0, 1);
}

function resizeWindow() {
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl!.viewport(0, 0, canvas.width, canvas.height);
    })
}



