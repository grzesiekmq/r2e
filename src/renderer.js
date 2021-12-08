import { gl, program, pMat } from "./main";
import { mat4 } from "gl-matrix";

let camMatrix,
  pMatrix,
  mMatrix = null;

let count = 0;
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

    setUniforms(pMatrix, camMatrix, mMatrix, pMat, cam, mMat);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
}

export { mMat, cam };
