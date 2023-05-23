import { getWebGLContext, initShaders } from '../../util/webgl-utils'
import vshader from './shaderSource.vs.glsl'
import fshader from './shaderSource.fs.glsl'
import { mat4, glMatrix } from 'gl-matrix'
import textureSkyCloud from '@/assets/textures/sky_cloud.jpg'

// Size of off screen
const OFFSCREEN_WIDTH = 256;
const OFFSCREEN_HEIGHT = 256;

function main() {
    // Retrieve <canvas> element
    const canvas = document.getElementById('webgl') as HTMLCanvasElement;

    // Get the rendering context for WebGL
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    const program: any = initShaders(gl, vshader, fshader)
    if (!program) {
        console.log('Failed to intialize shaders.');
        return;
    }

    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    (program as any).a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    (program as any).u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    if (program.a_Position < 0 || program.a_TexCoord < 0 || !program.u_MvpMatrix) {
        console.log('Failed to get the storage location of a_Position, a_TexCoord, u_MvpMatrix');
        return;
    }

    // Set the vertex information
    const cube = initVertexBuffersForCube(gl);
    const plane = initVertexBuffersForPlane(gl);
    if (!cube || !plane) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Set texture
    const texture = initTextures(gl);
    if (!texture) {
        console.log('Failed to intialize the texture.');
        return;
    }

    // Initialize framebuffer object (FBO)
    const fbo = initFramebufferObject(gl);
    if (!fbo) {
        console.log('Failed to intialize the framebuffer object (FBO)');
        return;
    }

    // Enable depth test
    gl.enable(gl.DEPTH_TEST);   //  gl.enable(gl.CULL_FACE);

    const viewMatrix = mat4.create();   // Prepare view projection matrix for color buffer
    mat4.lookAt(viewMatrix, [0.0, 0.0, 7.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    const projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 100);
    const viewProjMatrix = mat4.create();
    mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);

    const viewMatrixFBO = mat4.create();   // Prepare view projection matrix for color buffer
    mat4.lookAt(viewMatrixFBO, [0.0, 0.0, 7.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    const projMatrixFBO = mat4.create();
    mat4.perspective(projMatrixFBO, glMatrix.toRadian(30), OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
    const viewProjMatrixFBO = mat4.create();
    mat4.multiply(viewProjMatrixFBO, projMatrixFBO, viewMatrixFBO);

    // Start drawing
    let currentAngle = 0.0; // Current rotation angle (degrees)
    const tick = function () {
        currentAngle = animate(currentAngle);  // Update current rotation angle
        draw(gl, canvas, fbo, plane, cube, currentAngle, texture, viewProjMatrix, viewProjMatrixFBO);
        window.requestAnimationFrame(tick);
    };
    tick();
}

function initVertexBuffersForCube(gl: WebGLRenderingContext) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    // Vertex coordinates
    const vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
    ]);

    // Texture coordinates
    const texCoords = new Float32Array([
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v0-v1-v2-v3 front
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,    // v0-v3-v4-v5 right
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,    // v0-v5-v6-v1 up
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,    // v7-v4-v3-v2 down
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0     // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ])

    const o: any = {};  // Create the "Object" object to return multiple objects.

    // Write vertex information to buffer object
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

    o.numIndices = indices.length;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

function initVertexBuffersForPlane(gl: WebGLRenderingContext) {
    // Create face
    //  v1------v0
    //  |        |
    //  |        |
    //  |        |
    //  v2------v3

    // Vertex coordinates
    const vertices = new Float32Array([
        1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0    // v0-v1-v2-v3
    ]);

    // Texture coordinates
    const texCoords = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);

    // Indices of the vertices
    const indices = new Uint8Array([0, 1, 2, 0, 2, 3]);

    const o: any = {}; // Create the "Object" object to return multiple objects.

    // Write vertex information to buffer object
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

    o.numIndices = indices.length;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

function initArrayBufferForLaterUse(
    gl: WebGLRenderingContext,
    data: BufferSource,
    num: number,
    type: number
): WebGLBuffer | null {
    // Create a buffer object
    const buffer: any = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Store the necessary information to assign the object to the attribute variable later
    buffer.num = num;
    buffer.type = type;

    return buffer;
}

function initElementArrayBufferForLaterUse(
    gl: WebGLRenderingContext,
    data: BufferSource,
    type: number
): WebGLBuffer | null {
    // Create a buffer object
    const buffer: any = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.type = type;

    return buffer;
}

function initTextures(gl: WebGLRenderingContext): WebGLTexture | null {
    const texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the Texture object');
        return null;
    }

    // Get storage location of u_Sampler
    const u_Sampler = gl.getUniformLocation((gl as any).program, 'u_Sampler');
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return null;
    }

    const image = new Image();  // Create image object
    if (!image) {
        console.log('Failed to create the Image object');
        return null;
    }
    // Register the event handler to be called when image loading is completed
    image.onload = function () {
        // Write image data to texture object
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        // Pass the texure unit 0 to u_Sampler
        gl.uniform1i(u_Sampler, 0);

        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind the texture object
    };

    // Tell the browser to load an Image
    image.src = textureSkyCloud;

    return texture;
}

function initFramebufferObject(gl: WebGLRenderingContext): WebGLFramebuffer | null {
    let framebuffer: any, texture: any, depthBuffer: any;

    // Define the error handling function
    const error = function () {
        if (framebuffer) gl.deleteFramebuffer(framebuffer);
        if (texture) gl.deleteTexture(texture);
        if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
        return null;
    }

    // Create a frame buffer object (FBO)
    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
        console.log('Failed to create frame buffer object');
        return error();
    }

    // Create a texture object and set its size and parameters
    texture = gl.createTexture(); // Create a texture object
    if (!texture) {
        console.log('Failed to create texture object');
        return error();
    }
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    framebuffer.texture = texture; // Store the texture object

    // Create a renderbuffer object and Set its size and parameters
    depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
    if (!depthBuffer) {
        console.log('Failed to create renderbuffer object');
        return error();
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // Bind the object to target
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    // Attach the texture and the renderbuffer object to the FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // Check if FBO is configured correctly
    const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        console.log('Frame buffer object is incomplete: ' + e.toString());
        return error();
    }

    // Unbind the buffer object
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);


    return framebuffer;
}

function draw(
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    fbo: WebGLFramebuffer,
    plane: any,
    cube: any,
    angle: number,
    texture: WebGLTexture,
    viewProjMatrix: mat4,
    viewProjMatrixFBO: mat4
) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);              // Change the drawing destination to FBO
    gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT); // Set a viewport for FBO

    gl.clearColor(0.2, 0.2, 0.4, 1.0); // Set clear color (the color is slightly changed)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear FBO

    drawTexturedCube(gl, (gl as any).program, cube, angle, texture, viewProjMatrixFBO);   // Draw the cube

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);        // Change the drawing destination to color buffer
    gl.viewport(0, 0, canvas.width, canvas.height);  // Set the size of viewport back to that of <canvas>

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color buffer

    drawTexturedPlane(gl, (gl as any).program, plane, angle, (fbo as any).texture, viewProjMatrix);  // Draw the plane
}

// Coordinate transformation matrix
const g_modelMatrix = mat4.create();
const g_mvpMatrix = mat4.create();

function drawTexturedCube(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    o: any,
    angle: number,
    texture: WebGLTexture,
    viewProjMatrix: mat4
) {
    // Calculate a model matrix
    mat4.fromRotation(g_modelMatrix, glMatrix.toRadian(20.0), [1.0, 0.0, 0.0]);
    mat4.rotate(g_modelMatrix, g_modelMatrix, glMatrix.toRadian(angle), [0.0, 1.0, 0.0]);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    mat4.multiply(g_mvpMatrix, viewProjMatrix, g_modelMatrix);
    gl.uniformMatrix4fv((program as any).u_MvpMatrix, false, g_mvpMatrix);

    drawTexturedObject(gl, program, o, texture);
}

function drawTexturedPlane(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    o: any,
    angle: number,
    texture: WebGLTexture,
    viewProjMatrix: mat4
) {
    // Calculate a model matrix
    mat4.translate(g_modelMatrix, g_modelMatrix, [0, 0, 1])
    mat4.rotate(g_modelMatrix, g_modelMatrix, glMatrix.toRadian(20.0), [1.0, 0.0, 0.0])
    mat4.rotate(g_modelMatrix, g_modelMatrix, glMatrix.toRadian(angle), [0.0, 1.0, 0.0]);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    mat4.multiply(g_mvpMatrix, viewProjMatrix, g_modelMatrix);
    gl.uniformMatrix4fv((program as any).u_MvpMatrix, false, g_mvpMatrix);

    drawTexturedObject(gl, program, o, texture);
}

function drawTexturedObject(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    o: any,
    texture: WebGLTexture,
) {
    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, (program as any).a_Position, o.vertexBuffer);    // Vertex coordinates
    initAttributeVariable(gl, (program as any).a_TexCoord, o.texCoordBuffer);  // Texture coordinates

    // Bind the texture object to the target
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
}

// Assign the buffer objects and enable the assignment
function initAttributeVariable(
    gl: WebGLRenderingContext,
    a_attribute: any,
    buffer: any,
) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

const ANGLE_STEP = 30;   // The increments of rotation angle (degrees)

let last = Date.now(); // Last time that this function was called
function animate(angle: number) {
    const now = Date.now();   // Calculate the elapsed time
    const elapsed = now - last;
    last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}

main();
