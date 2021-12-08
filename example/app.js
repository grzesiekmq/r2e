import {
    run,
    AXIS
} from '../main';

import {
    Camera
} from '../camera';



import {
    loadGltf
} from '../utils/loadGltf.js';

import {
    drawScene
} from '../main';

// const gltf = await loadGltf('models/Avocado/glTF/Avocado.gltf');

const gltf = await loadGltf('models/DamagedHelmet//glTF/DamagedHelmet.gltf');


console.log('gltf', gltf);

const debug = document.querySelector('#debug');


function debugInfo() {


    debug.innerHTML = 'meshes count ' + gltf.meshes.length + '<p></p>';
    if (gltf.meshes.length > 1) {
        debug.innerHTML += 'multi mesh'.toUpperCase();
    }
}

debugInfo();






const camera = new Camera();

camera.set(0, 0, 5);

run();

function update() {
    let x = 0;
    x += 0.01;

    camera.rotate(x, AXIS.Y);

    requestAnimationFrame(update);

    drawScene(gltf);

}

update();