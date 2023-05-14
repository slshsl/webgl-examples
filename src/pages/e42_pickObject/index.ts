import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'
import { mat4, glMatrix, vec3 } from 'gl-matrix'
import dat from 'dat.gui'
import '@/assets/reset.css'

let last = Date.now();
let autoRotateAngleAroundY = 0.0;
const mouseRotateAngleAroundXY = [0.0, 0.0];

const controls = {
    autoRotateAroundYStep: 45.0,
    autoRotateAroundY: false,
    depthTest: true,
};

const gui = new dat.GUI({
    width: 400
});

function main() {

    const canvas = document.getElementById('webgl') as HTMLCanvasElement;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

    gl.clearColor(0, 0, 0, 1);

    //开启隐藏面消除
    gl.enable(gl.DEPTH_TEST);

    //模型矩阵------------------------------------------------------------------------------------------

    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');

    const modelMatrix = mat4.create();

    mat4.fromTranslation(modelMatrix, [0, 0, 0]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

    //-------------------------------------------------------------------------------------------------

    //视图矩阵------------------------------------------------------------------------------------------

    const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');

    const viewMatrix = mat4.create();

    //设置视点、视线、上方向
    mat4.lookAt(viewMatrix, [6, 6, 14], [0, 0, 0], [0, 1, 0]);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

    //-------------------------------------------------------------------------------------------------

    //投影矩阵------------------------------------------------------------------------------------------

    const u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");

    const projMatrix = mat4.create();

    //设置投影矩阵
    mat4.perspective(projMatrix, glMatrix.toRadian(75), canvas.width / canvas.height, 1, 100);

    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);

    //-------------------------------------------------------------------------------------------------

    //平行光源--------------------------------------------------------------------------------------------

    const u_PrectionalLightColor = gl.getUniformLocation(program, 'u_PrectionalLightColor');//平行光源颜色

    gl.uniform3f(u_PrectionalLightColor, 1.0, 1.0, 1.0); //设置平行光源颜色

    const u_PrectionalLightDirection = gl.getUniformLocation(program, 'u_PrectionalLightDirection');//平行光源方向

    const prectionalLightDirection = vec3.fromValues(0.5, 3.0, 4.0)// 初始化平行光源方向

    vec3.normalize(prectionalLightDirection, prectionalLightDirection);//平行光源方向归一化

    gl.uniform3fv(u_PrectionalLightDirection, prectionalLightDirection);//设置平行光源方向

    //-------------------------------------------------------------------------------------------------

    //点光源--------------------------------------------------------------------------------------------

    const u_PointLightColor = gl.getUniformLocation(program, 'u_PointLightColor');//点光源颜色

    gl.uniform3f(u_PointLightColor, 1.0, 1.0, 1.0); //设置点光源颜色

    const u_PointLightPosition = gl.getUniformLocation(program, 'u_PointLightPosition');//点光源位置

    gl.uniform3f(u_PointLightPosition, 2.3, 4.0, 3.5);//设置点光源位置

    //-------------------------------------------------------------------------------------------------

    //环境光--------------------------------------------------------------------------------------------

    const u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2); //设置环境光颜色

    //-------------------------------------------------------------------------------------------------

    //用来变换法向量的矩阵-------------------------------------------------------------------------------

    const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    const normalMatrix = mat4.create();

    //-------------------------------------------------------------------------------------------------


    const u_Clicked = gl.getUniformLocation(program, 'u_Clicked');

    const tick = function () {

        draw(gl, n, modelMatrix, u_ModelMatrix!, normalMatrix, u_NormalMatrix!);

        requestAnimationFrame(tick);
    };

    tick();

    //-------------------------------------------------------------------------------------------------
    initEventHandlers(
        canvas, gl,
        n,
        modelMatrix,
        u_ModelMatrix!,
        projMatrix,
        u_ProjMatrix!,
        normalMatrix,
        u_NormalMatrix!,
        u_Clicked!
    );

    //-------------------------------------------------------------------------------------------------
    gui.add(controls, 'autoRotateAroundY')
        .name('自动绕Y轴旋转')
        .onChange(() => {
            last = Date.now();
        });

    gui.add(controls, 'autoRotateAroundYStep')
        .min(-360)
        .max(360)
        .step(5)
        .name('自动绕Y轴旋转速度(d/s)');

    gui.add(controls, 'depthTest')
        .name('深度测试')
        .onChange((val) => {
            if (val) {
                gl.enable(gl.DEPTH_TEST);
            } else {
                gl.disable(gl.DEPTH_TEST);
            }
        });


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
        2.0, 2.0, 2.0, -2.0, 2.0, 2.0, -2.0, -2.0, 2.0, 2.0, -2.0, 2.0, // v0-v1-v2-v3 front
        2.0, 2.0, 2.0, 2.0, -2.0, 2.0, 2.0, -2.0, -2.0, 2.0, 2.0, -2.0, // v0-v3-v4-v5 right
        2.0, 2.0, 2.0, 2.0, 2.0, -2.0, -2.0, 2.0, -2.0, -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
        -2.0, 2.0, 2.0, -2.0, 2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, 2.0, // v1-v6-v7-v2 left
        -2.0, -2.0, -2.0, 2.0, -2.0, -2.0, 2.0, -2.0, 2.0, -2.0, -2.0, 2.0, // v7-v4-v3-v2 down
        2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, 2.0, -2.0, 2.0, 2.0, -2.0  // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([     // Colors
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0    // v4-v7-v6-v5 back
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

function animate(angle: number, step: number) {
    if (controls.autoRotateAroundY) {
        const now = Date.now();
        const elapsed = (now - last);
        last = now;
        let newAngle = angle + (step * elapsed) / 1000.0;
        return newAngle %= 360;
    }
    return autoRotateAngleAroundY;
}

function draw(
    gl: WebGLRenderingContext,
    n: number,
    modelMatrix: mat4,
    u_ModelMatrix: WebGLUniformLocation,
    normalMatrix: mat4,
    u_NormalMatrix: WebGLUniformLocation,
) {
    autoRotateAngleAroundY = animate(autoRotateAngleAroundY, controls.autoRotateAroundYStep);//更新当前旋转角度

    //计算模型矩阵
    mat4.fromRotation(modelMatrix, glMatrix.toRadian(autoRotateAngleAroundY), [0.0, 1.0, 0.0]);//围绕y轴旋转

    mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(mouseRotateAngleAroundXY[0]), [1.0, 0.0, 0.0]); // Rotation around x-axis
    mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(mouseRotateAngleAroundXY[1]), [0.0, 1.0, 0.0]); // Rotation around y-axis

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

    // 规则：用法向量乘以模型矩阵的逆转置矩阵，就可以求得变换后的法向量。
    mat4.invert(normalMatrix, modelMatrix)
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initEventHandlers(
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    n: number,
    modelMatrix: mat4,
    u_ModelMatrix: WebGLUniformLocation,
    projMatrix: mat4,
    u_ProjMatrix: WebGLUniformLocation,
    normalMatrix: mat4,
    u_NormalMatrix: WebGLUniformLocation,
    u_Clicked: WebGLUniformLocation,
) {
    resizeWindow(canvas, gl, projMatrix, u_ProjMatrix)
    mouseRotateAroundXY(canvas);
    pickByMouseClick(
        canvas,
        gl,
        n,
        modelMatrix,
        u_ModelMatrix,
        normalMatrix,
        u_NormalMatrix,
        u_Clicked
    )
}

function resizeWindow(
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    projMatrix: mat4,
    u_ProjMatrix: WebGLUniformLocation
) {
    window.addEventListener('resize', () => {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        gl.viewport(0, 0, canvas.width, canvas.height);

        //设置投影矩阵
        mat4.perspective(projMatrix, glMatrix.toRadian(75), canvas.width / canvas.height, 1, 100);

        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);
    })
}

function mouseRotateAroundXY(canvas: HTMLCanvasElement) {
    let dragging = false;         // Dragging or not
    let lastX = -1, lastY = -1;   // Last position of the mouse

    canvas.onmousedown = function (ev: MouseEvent) {   // Mouse is pressed
        const x = ev.clientX, y = ev.clientY;
        // Start dragging if a moue is in <canvas>
        const rect = (ev.target as HTMLCanvasElement).getBoundingClientRect();
        if (
            rect.left <= x &&
            x < rect.right &&
            rect.top <= y &&
            y < rect.bottom
        ) {
            lastX = x; lastY = y;
            dragging = true;
        }
    };

    canvas.onmouseup = function (ev: MouseEvent) { dragging = false; }; // Mouse is released

    canvas.onmousemove = function (ev: MouseEvent) { // Mouse is moved
        const x = ev.clientX, y = ev.clientY;
        if (dragging) {
            const factor = 100 / canvas.height; // The rotation ratio
            const dx = factor * (x - lastX);
            const dy = factor * (y - lastY);

            // Limit x-axis rotation angle to -90 to 90 degrees
            mouseRotateAngleAroundXY[0] = mouseRotateAngleAroundXY[0] + dy;
            mouseRotateAngleAroundXY[1] = mouseRotateAngleAroundXY[1] + dx;

        }
        lastX = x, lastY = y;
    };
}


function pickByMouseClick(
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    n: number,
    modelMatrix: mat4,
    u_ModelMatrix: WebGLUniformLocation,
    normalMatrix: mat4,
    u_NormalMatrix: WebGLUniformLocation,
    u_Clicked: WebGLUniformLocation
) {
    canvas.onmousedown = function (ev) {   // Mouse is pressed
        const x = ev.clientX, y = ev.clientY;

        const rect = (ev.target! as HTMLCanvasElement).getBoundingClientRect();

        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {

            // If pressed position is inside <canvas>, check if it is above object
            const x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;

            const picked = check(
                gl,
                n,
                x_in_canvas,
                y_in_canvas,
                modelMatrix,
                u_ModelMatrix,
                normalMatrix,
                u_NormalMatrix,
                u_Clicked,
            );

            if (picked) alert('The cube was selected! ');
        }
    }
}

function check(
    gl: WebGLRenderingContext,
    n: number,
    x: number,
    y: number,
    modelMatrix: mat4,
    u_ModelMatrix: WebGLUniformLocation,
    normalMatrix: mat4,
    u_NormalMatrix: WebGLUniformLocation,
    u_Clicked: WebGLUniformLocation,
) {
    let picked = false;

    gl.uniform1i(u_Clicked, 1);  // Pass true to u_Clicked

    draw(gl, n, modelMatrix, u_ModelMatrix!, normalMatrix, u_NormalMatrix!); // Draw cube with red

    // Read pixel at the clicked position
    const pixels = new Uint8Array(4); // Array for storing the pixel value

    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    if (pixels[0] == 128) // The mouse in on cube if R(pixels[0]) is 128
        picked = true;

    gl.uniform1i(u_Clicked, 0);  // Pass false to u_Clicked(rewrite the cube)

    draw(gl, n, modelMatrix, u_ModelMatrix!, normalMatrix, u_NormalMatrix!); // Draw the cube

    return picked;
}

main();

