import { GLTFLoader } from "@loaders.gl/gltf";
import { load } from "@loaders.gl/core";
import { initBuffer, gl } from "../main";

let counts = [];
export async function loadGltf(filename) {
  const gltf = await load(filename, GLTFLoader);

  for (const mesh of gltf.meshes) {
    for (const primitive of mesh.primitives) {
      console.log();

      const vertices = primitive.attributes.POSITION.value;
      const indices = primitive.indices.value;

      counts.push(primitive.indices.count);

      console.log("------VERTICES AND INDICES-------");
      console.log("vertices", vertices.length);
      console.log("indices", indices.length);

      const vBuffer = initBuffer(gl.ARRAY_BUFFER, vertices);
      const iBuffer = initBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);

      console.log(vBuffer, iBuffer);

      gl.getParameter(gl.ARRAY_BUFFER_BINDING);
      gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);

      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    }
  }
  console.log(counts);

  return gltf;
}
export { counts };
