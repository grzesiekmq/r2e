import { GLTFLoader } from "@loaders.gl/gltf";
import { load } from "@loaders.gl/core";
import { initBuffer, gl } from "../main";

let count = 0;
let vBuffer = null
let iBuffer = null
export async function loadGltf(filename) {
  const gltf = await load(filename, GLTFLoader);

  for (const mesh of gltf.meshes) {
    for (const primitive of mesh.primitives) {
      console.log();

      const vertices = primitive.attributes.POSITION.value;
      const indices = primitive.indices.value;

      count = primitive.indices.count;

      console.log("------VERTICES AND INDICES-------");
      console.log("vertices", vertices.length);
      console.log("indices", indices.length);

       vBuffer = initBuffer(gl.ARRAY_BUFFER, vertices);
      iBuffer = initBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);

      console.log(vBuffer, iBuffer);

      gl.getParameter(gl.ARRAY_BUFFER_BINDING);
      gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);


    }
  }
  console.log(count);

  return gltf;
}
export { count, vBuffer, iBuffer };
