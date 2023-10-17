import { run, AXIS, drawScene } from "../src/main";

import { Camera } from "../src/camera";

import { loadGltf } from "../src/utils/loadGltf";
import { loadMtl, loadObj } from "../src/utils/loadObj";
//import { loadTexture } from "../src/utils/loadTexture";
const camera = new Camera();
let gltf = null
let obj = null
async function main() {
  // gltf = await loadGltf("models/DamagedHelmet/glTF/DamagedHelmet.gltf");
obj = await loadObj('models/skyline.obj')
const mtl = await loadMtl('models/skyline.mtl')
console.log(obj)
console.log('mtl', mtl)

 // const texture = await loadTexture(
 //   "models/BarramundiFish/BarramundiFish_baseColor.png"
 // );

//  console.log(texture);

  // console.log("gltf", gltf);

  const debug = document.querySelector("#debug");

  function debugInfo() {

  //   debug.innerHTML = "meshes count " + gltf.meshes.length + "<p></p>";
  //   if (gltf.meshes.length > 1) {
  //     debug.innerHTML += "multi mesh".toUpperCase();
  //   }
  }

  debugInfo();


  camera.set(0, 0, 50);
}

main();

run();

function update() {
  let x = 0;
  x += 0.01;

  // eslint-disable-next-line no-undef
  camera.rotate(x, AXIS.Y);

  requestAnimationFrame(update);

  //  if(gltf){

    drawScene(gltf);
  // }
}

update();
