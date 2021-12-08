import {
    loadShader
} from './utils/loadShader';
import {
    mat4
} from 'gl-matrix';

import {
    Renderer

} from './renderer';

import {
    counts
} from './utils/loadGltf'

/** @type {WebGLRenderingContext} */

const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl2');

let program = null;

let pMat, cam = null;

export const AXIS = {
    'X': [1, 0, 0],
    'Y': [0, 1, 0],
    'Z': [0, 0, 1],
    'NO_ROTATE': [0, 0, 0]
};

const renderer = new Renderer();

export function initBuffer(type, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    // unbind
    gl.bindBuffer(type, null);

    return buffer;
}

export function drawScene(gltf) {

    for (const mesh of gltf.meshes) {


        for (const count of counts) {

            renderer.render(count);
        }
    }



}

async function initShaders() {

    const vs = gl.createShader(gl.VERTEX_SHADER);

    const vshader = await loadShader('vs.vert');

    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);

    const fshader = await loadShader('fs.frag');

    gl.shaderSource(fs, fshader);
    gl.compileShader(fs);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
}

async function init() {
    let view = null;

    function createMatrices() {

        pMat = mat4.create();
        view = mat4.create();
        cam = mat4.create();
    }

    function setupMatrices(cam, view, pMat) {
        mat4.invert(cam, view);
        mat4.perspective(pMat, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
        mat4.lookAt(cam, [0, 0, 1], [0, 0, 0], [0, 1, 0])

        return true;
    }

    createMatrices();
    setupMatrices(cam, view, pMat);

    program = await initShaders();
}

export async function run(debug = true) {

    await init();

    if (debug) {

        console.info('shaders initialized');

        if (cam && pMat) {
            console.info('matrices initialized');

        }
    }

    const vertexPos = gl.getAttribLocation(program, 'vertexPos');

    gl.vertexAttribPointer(vertexPos, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vertexPos);

}

export {
    gl,
    pMat,

    cam,
    program
}