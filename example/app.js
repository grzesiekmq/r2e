import { run, AXIS, drawScene } from "../src/main";

import { Camera } from "../src/camera";

import { loadGltf } from "../src/utils/loadGltf";
import { loadTexture } from "../src/utils/loadTexture";

async function main() {
  const gltf = await loadGltf("models/DamagedHelmet/glTF/DamagedHelmet.gltf");

  const texture = await loadTexture(
    "models/BarramundiFish/BarramundiFish_baseColor.png"
  );

  console.log(texture);

  console.log("gltf", gltf);

  const debug = document.querySelector("#debug");

  function debugInfo() {
    debug.innerHTML = "meshes count " + gltf.meshes.length + "<p></p>";
    if (gltf.meshes.length > 1) {
      debug.innerHTML += "multi mesh".toUpperCase();
    }
  }

  debugInfo();

  const camera = new Camera();

  camera.set(0, 0, 5);
}

main();

run();

function update() {
  let x = 0;
  x += 0.01;

  camera.rotate(x, AXIS.Y);

  requestAnimationFrame(update);

  drawScene(gltf);
}

update();
