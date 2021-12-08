import { mat4 } from "gl-matrix";
import { mMat, cam } from "./renderer";
import { AXIS } from "./main";

export class Camera {
  rotate(angle, axis) {
    mat4.rotate(mMat, mMat, angle, axis);
  }
  set(x, y, z) {
    mat4.lookAt(cam, [x, y, z], [0, 0, 0], AXIS.Y);
  }
}
