import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'
import textureSky from '@/assets/textures/sky.jpg'
import textureCircle from '@/assets/textures/circle.gif'

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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Set texture
    if (!initTextures(gl, program, n)) {
        console.log("Failed to intialize the texture.");
        return;
    }
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram): number {

    const n = 4; //点的个数

    const verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);

    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    //创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create thie buffer object");
        return -1;
    }

    //将缓冲区对象保存到目标上
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓存对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }

    //将缓冲区对象分配给a_Postion变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

    //连接a_Postion变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log("Failed to get the storage location of a_TexCoord");
        return -1;
    }

    //将缓冲区对象分配给a_Postion变量
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

    //连接a_Postion变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl: WebGLRenderingContext, program: WebGLProgram, n: number) {

    const texture0 = gl.createTexture(); //创建纹理对象
    if (!texture0) {
        console.log("Failed to create the texture object");
        return false;
    }

    //获取u_Sampler的存储位置
    const u_Sampler0 = gl.getUniformLocation(program, "u_Sampler0");
    if (!u_Sampler0) {
        console.log("Failed to get the storage location of u_Sampler0");
        return false;
    }

    const image0 = new Image(); //创建一个image对象
    if (!image0) {
        console.log("Failed to create the image object");
        return false;
    }

    //注册图像加载时间的响应函数
    image0.onload = function () {
        loadTexture(gl, n, texture0!, u_Sampler0!, image0, 0);
    };

    //浏览器开始加载图像
    image0.src = textureSky;

    const texture1 = gl.createTexture(); //创建纹理对象
    if (!texture1) {
        console.log("Failed to create the texture object");
        return false;
    }

    //获取u_Sampler的存储位置
    const u_Sampler1 = gl.getUniformLocation(program, "u_Sampler1");
    if (!u_Sampler1) {
        console.log("Failed to get the storage location of u_Sampler1");
        return false;
    }

    const image1 = new Image(); //创建一个image对象
    if (!image1) {
        console.log("Failed to create the image object");
        return false;
    }

    //注册图像加载时间的响应函数
    image1.onload = function () {
        loadTexture(gl, n, texture1!, u_Sampler1!, image1, 1);
    };

    //浏览器开始加载图像
    image1.src = textureCircle;

    return true;
}

//标记纹理单元是否已经就绪
let g_texUnit0 = false, g_texUnit1 = false;

function loadTexture(
    gl: WebGLRenderingContext,
    n: number,
    texture: WebGLTexture,
    u_Sampler: WebGLUniformLocation,
    image: HTMLImageElement,
    texUnit: number
) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴反转

    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    }
    else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }

    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);

    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);//绘制矩形
    }
}


main();

