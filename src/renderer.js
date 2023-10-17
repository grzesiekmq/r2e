import { gl, program, pMat, vertexPos } from "./main";
import { mat4 } from "gl-matrix";
// import { vBuffer, iBuffer } from "./utils/loadGltf";
import {vBuffer, isVertices, isIndices } from "./utils/loadObj";
let camMatrix,
  pMatrix,
  mMatrix = null;

const mMat = mat4.create();
const cam = mat4.create();

function setUniforms(pMatrix, camMatrix, mMatrix, pMat, cam, mMat) {
  gl.uniformMatrix4fv(pMatrix, false, pMat);
  gl.uniformMatrix4fv(camMatrix, false, cam);
  gl.uniformMatrix4fv(mMatrix, false, mMat);
}

export class Renderer {
  render(count) {
    // console.log(count)

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    if (program) {
      camMatrix = gl.getUniformLocation(program, "camMatrix");
      pMatrix = gl.getUniformLocation(program, "pMatrix");
      mMatrix = gl.getUniformLocation(program, "mMatrix");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.enableVertexAttribArray(vertexPos);
    gl.vertexAttribPointer(vertexPos, 3, gl.FLOAT, false, 0, 0);
if(isIndices){

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
}

    setUniforms(pMatrix, camMatrix, mMatrix, pMat, cam, mMat);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);


    if(isVertices){
      gl.drawArrays(gl.TRIANGLES, 0, count)
    }
    else{

      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }
  }
}

export { mMat, cam };
