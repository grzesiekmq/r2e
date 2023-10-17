async function loadShader(filename) {
    const res = await fetch(filename);
    const file =
        await res.text();
    return file;
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO;
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function getMeshBoundingBox(attributes) {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  const positions = attributes.POSITION ? attributes.POSITION.value : [];
  const len = positions && positions.length;
  for (let i = 0; i < len; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    minX = x < minX ? x : minX;
    minY = y < minY ? y : minY;
    minZ = z < minZ ? z : minZ;
    maxX = x > maxX ? x : maxX;
    maxY = y > maxY ? y : maxY;
    maxZ = z > maxZ ? z : maxZ;
  }
  return [[minX, minY, minZ], [maxX, maxY, maxZ]];
}

function assert$3(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}

class Schema {
  constructor(fields, metadata) {
    _defineProperty(this, "fields", void 0);
    _defineProperty(this, "metadata", void 0);
    assert$3(Array.isArray(fields));
    checkNames(fields);
    this.fields = fields;
    this.metadata = metadata || new Map();
  }
  compareTo(other) {
    if (this.metadata !== other.metadata) {
      return false;
    }
    if (this.fields.length !== other.fields.length) {
      return false;
    }
    for (let i = 0; i < this.fields.length; ++i) {
      if (!this.fields[i].compareTo(other.fields[i])) {
        return false;
      }
    }
    return true;
  }
  select() {
    const nameMap = Object.create(null);
    for (var _len = arguments.length, columnNames = new Array(_len), _key = 0; _key < _len; _key++) {
      columnNames[_key] = arguments[_key];
    }
    for (const name of columnNames) {
      nameMap[name] = true;
    }
    const selectedFields = this.fields.filter(field => nameMap[field.name]);
    return new Schema(selectedFields, this.metadata);
  }
  selectAt() {
    for (var _len2 = arguments.length, columnIndices = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      columnIndices[_key2] = arguments[_key2];
    }
    const selectedFields = columnIndices.map(index => this.fields[index]).filter(Boolean);
    return new Schema(selectedFields, this.metadata);
  }
  assign(schemaOrFields) {
    let fields;
    let metadata = this.metadata;
    if (schemaOrFields instanceof Schema) {
      const otherSchema = schemaOrFields;
      fields = otherSchema.fields;
      metadata = mergeMaps(mergeMaps(new Map(), this.metadata), otherSchema.metadata);
    } else {
      fields = schemaOrFields;
    }
    const fieldMap = Object.create(null);
    for (const field of this.fields) {
      fieldMap[field.name] = field;
    }
    for (const field of fields) {
      fieldMap[field.name] = field;
    }
    const mergedFields = Object.values(fieldMap);
    return new Schema(mergedFields, metadata);
  }
}
function checkNames(fields) {
  const usedNames = {};
  for (const field of fields) {
    if (usedNames[field.name]) {
      console.warn('Schema: duplicated field name', field.name, field);
    }
    usedNames[field.name] = true;
  }
}
function mergeMaps(m1, m2) {
  return new Map([...(m1 || new Map()), ...(m2 || new Map())]);
}

class Field {
  constructor(name, type) {
    let nullable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Map();
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "nullable", void 0);
    _defineProperty(this, "metadata", void 0);
    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.metadata = metadata;
  }
  get typeId() {
    return this.type && this.type.typeId;
  }
  clone() {
    return new Field(this.name, this.type, this.nullable, this.metadata);
  }
  compareTo(other) {
    return this.name === other.name && this.type === other.type && this.nullable === other.nullable && this.metadata === other.metadata;
  }
  toString() {
    return "".concat(this.type).concat(this.nullable ? ', nullable' : '').concat(this.metadata ? ", metadata: ".concat(this.metadata) : '');
  }
}

let Type = function (Type) {
  Type[Type["NONE"] = 0] = "NONE";
  Type[Type["Null"] = 1] = "Null";
  Type[Type["Int"] = 2] = "Int";
  Type[Type["Float"] = 3] = "Float";
  Type[Type["Binary"] = 4] = "Binary";
  Type[Type["Utf8"] = 5] = "Utf8";
  Type[Type["Bool"] = 6] = "Bool";
  Type[Type["Decimal"] = 7] = "Decimal";
  Type[Type["Date"] = 8] = "Date";
  Type[Type["Time"] = 9] = "Time";
  Type[Type["Timestamp"] = 10] = "Timestamp";
  Type[Type["Interval"] = 11] = "Interval";
  Type[Type["List"] = 12] = "List";
  Type[Type["Struct"] = 13] = "Struct";
  Type[Type["Union"] = 14] = "Union";
  Type[Type["FixedSizeBinary"] = 15] = "FixedSizeBinary";
  Type[Type["FixedSizeList"] = 16] = "FixedSizeList";
  Type[Type["Map"] = 17] = "Map";
  Type[Type["Dictionary"] = -1] = "Dictionary";
  Type[Type["Int8"] = -2] = "Int8";
  Type[Type["Int16"] = -3] = "Int16";
  Type[Type["Int32"] = -4] = "Int32";
  Type[Type["Int64"] = -5] = "Int64";
  Type[Type["Uint8"] = -6] = "Uint8";
  Type[Type["Uint16"] = -7] = "Uint16";
  Type[Type["Uint32"] = -8] = "Uint32";
  Type[Type["Uint64"] = -9] = "Uint64";
  Type[Type["Float16"] = -10] = "Float16";
  Type[Type["Float32"] = -11] = "Float32";
  Type[Type["Float64"] = -12] = "Float64";
  Type[Type["DateDay"] = -13] = "DateDay";
  Type[Type["DateMillisecond"] = -14] = "DateMillisecond";
  Type[Type["TimestampSecond"] = -15] = "TimestampSecond";
  Type[Type["TimestampMillisecond"] = -16] = "TimestampMillisecond";
  Type[Type["TimestampMicrosecond"] = -17] = "TimestampMicrosecond";
  Type[Type["TimestampNanosecond"] = -18] = "TimestampNanosecond";
  Type[Type["TimeSecond"] = -19] = "TimeSecond";
  Type[Type["TimeMillisecond"] = -20] = "TimeMillisecond";
  Type[Type["TimeMicrosecond"] = -21] = "TimeMicrosecond";
  Type[Type["TimeNanosecond"] = -22] = "TimeNanosecond";
  Type[Type["DenseUnion"] = -23] = "DenseUnion";
  Type[Type["SparseUnion"] = -24] = "SparseUnion";
  Type[Type["IntervalDayTime"] = -25] = "IntervalDayTime";
  Type[Type["IntervalYearMonth"] = -26] = "IntervalYearMonth";
  return Type;
}({});

let _Symbol$toStringTag, _Symbol$toStringTag2, _Symbol$toStringTag7;
class DataType {
  static isNull(x) {
    return x && x.typeId === Type.Null;
  }
  static isInt(x) {
    return x && x.typeId === Type.Int;
  }
  static isFloat(x) {
    return x && x.typeId === Type.Float;
  }
  static isBinary(x) {
    return x && x.typeId === Type.Binary;
  }
  static isUtf8(x) {
    return x && x.typeId === Type.Utf8;
  }
  static isBool(x) {
    return x && x.typeId === Type.Bool;
  }
  static isDecimal(x) {
    return x && x.typeId === Type.Decimal;
  }
  static isDate(x) {
    return x && x.typeId === Type.Date;
  }
  static isTime(x) {
    return x && x.typeId === Type.Time;
  }
  static isTimestamp(x) {
    return x && x.typeId === Type.Timestamp;
  }
  static isInterval(x) {
    return x && x.typeId === Type.Interval;
  }
  static isList(x) {
    return x && x.typeId === Type.List;
  }
  static isStruct(x) {
    return x && x.typeId === Type.Struct;
  }
  static isUnion(x) {
    return x && x.typeId === Type.Union;
  }
  static isFixedSizeBinary(x) {
    return x && x.typeId === Type.FixedSizeBinary;
  }
  static isFixedSizeList(x) {
    return x && x.typeId === Type.FixedSizeList;
  }
  static isMap(x) {
    return x && x.typeId === Type.Map;
  }
  static isDictionary(x) {
    return x && x.typeId === Type.Dictionary;
  }
  get typeId() {
    return Type.NONE;
  }
  compareTo(other) {
    return this === other;
  }
}
_Symbol$toStringTag = Symbol.toStringTag;
class Int extends DataType {
  constructor(isSigned, bitWidth) {
    super();
    _defineProperty(this, "isSigned", void 0);
    _defineProperty(this, "bitWidth", void 0);
    this.isSigned = isSigned;
    this.bitWidth = bitWidth;
  }
  get typeId() {
    return Type.Int;
  }
  get [_Symbol$toStringTag]() {
    return 'Int';
  }
  toString() {
    return "".concat(this.isSigned ? 'I' : 'Ui', "nt").concat(this.bitWidth);
  }
}
class Int8 extends Int {
  constructor() {
    super(true, 8);
  }
}
class Int16 extends Int {
  constructor() {
    super(true, 16);
  }
}
class Int32 extends Int {
  constructor() {
    super(true, 32);
  }
}
class Uint8 extends Int {
  constructor() {
    super(false, 8);
  }
}
class Uint16 extends Int {
  constructor() {
    super(false, 16);
  }
}
class Uint32 extends Int {
  constructor() {
    super(false, 32);
  }
}
const Precision = {
  HALF: 16,
  SINGLE: 32,
  DOUBLE: 64
};
_Symbol$toStringTag2 = Symbol.toStringTag;
class Float extends DataType {
  constructor(precision) {
    super();
    _defineProperty(this, "precision", void 0);
    this.precision = precision;
  }
  get typeId() {
    return Type.Float;
  }
  get [_Symbol$toStringTag2]() {
    return 'Float';
  }
  toString() {
    return "Float".concat(this.precision);
  }
}
class Float32 extends Float {
  constructor() {
    super(Precision.SINGLE);
  }
}
class Float64 extends Float {
  constructor() {
    super(Precision.DOUBLE);
  }
}
_Symbol$toStringTag7 = Symbol.toStringTag;
class FixedSizeList extends DataType {
  constructor(listSize, child) {
    super();
    _defineProperty(this, "listSize", void 0);
    _defineProperty(this, "children", void 0);
    this.listSize = listSize;
    this.children = [child];
  }
  get typeId() {
    return Type.FixedSizeList;
  }
  get valueType() {
    return this.children[0].type;
  }
  get valueField() {
    return this.children[0];
  }
  get [_Symbol$toStringTag7]() {
    return 'FixedSizeList';
  }
  toString() {
    return "FixedSizeList[".concat(this.listSize, "]<").concat(this.valueType, ">");
  }
}

function getArrowTypeFromTypedArray(array) {
  switch (array.constructor) {
    case Int8Array:
      return new Int8();
    case Uint8Array:
      return new Uint8();
    case Int16Array:
      return new Int16();
    case Uint16Array:
      return new Uint16();
    case Int32Array:
      return new Int32();
    case Uint32Array:
      return new Uint32();
    case Float32Array:
      return new Float32();
    case Float64Array:
      return new Float64();
    default:
      throw new Error('array type not supported');
  }
}

const OBJECT_RE = /^[og]\s*(.+)?/;
const MATERIAL_RE = /^mtllib /;
const MATERIAL_USE_RE = /^usemtl /;
class MeshMaterial {
  constructor(_ref) {
    let {
      index,
      name = '',
      mtllib,
      smooth,
      groupStart
    } = _ref;
    this.index = index;
    this.name = name;
    this.mtllib = mtllib;
    this.smooth = smooth;
    this.groupStart = groupStart;
    this.groupEnd = -1;
    this.groupCount = -1;
    this.inherited = false;
  }
  clone() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.index;
    return new MeshMaterial({
      index,
      name: this.name,
      mtllib: this.mtllib,
      smooth: this.smooth,
      groupStart: 0
    });
  }
}
class MeshObject {
  constructor() {
    let name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    this.name = name;
    this.geometry = {
      vertices: [],
      normals: [],
      colors: [],
      uvs: []
    };
    this.materials = [];
    this.smooth = true;
    this.fromDeclaration = null;
  }
  startMaterial(name, libraries) {
    const previous = this._finalize(false);
    if (previous && (previous.inherited || previous.groupCount <= 0)) {
      this.materials.splice(previous.index, 1);
    }
    const material = new MeshMaterial({
      index: this.materials.length,
      name,
      mtllib: Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : '',
      smooth: previous !== undefined ? previous.smooth : this.smooth,
      groupStart: previous !== undefined ? previous.groupEnd : 0
    });
    this.materials.push(material);
    return material;
  }
  currentMaterial() {
    if (this.materials.length > 0) {
      return this.materials[this.materials.length - 1];
    }
    return undefined;
  }
  _finalize(end) {
    const lastMultiMaterial = this.currentMaterial();
    if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {
      lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
      lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
      lastMultiMaterial.inherited = false;
    }
    if (end && this.materials.length > 1) {
      for (let mi = this.materials.length - 1; mi >= 0; mi--) {
        if (this.materials[mi].groupCount <= 0) {
          this.materials.splice(mi, 1);
        }
      }
    }
    if (end && this.materials.length === 0) {
      this.materials.push({
        name: '',
        smooth: this.smooth
      });
    }
    return lastMultiMaterial;
  }
}
class ParserState {
  constructor() {
    this.objects = [];
    this.object = null;
    this.vertices = [];
    this.normals = [];
    this.colors = [];
    this.uvs = [];
    this.materialLibraries = [];
    this.startObject('', false);
  }
  startObject(name) {
    let fromDeclaration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (this.object && !this.object.fromDeclaration) {
      this.object.name = name;
      this.object.fromDeclaration = fromDeclaration;
      return;
    }
    const previousMaterial = this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined;
    if (this.object && typeof this.object._finalize === 'function') {
      this.object._finalize(true);
    }
    this.object = new MeshObject(name);
    this.object.fromDeclaration = fromDeclaration;
    if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === 'function') {
      const declared = previousMaterial.clone(0);
      declared.inherited = true;
      this.object.materials.push(declared);
    }
    this.objects.push(this.object);
  }
  finalize() {
    if (this.object && typeof this.object._finalize === 'function') {
      this.object._finalize(true);
    }
  }
  parseVertexIndex(value, len) {
    const index = parseInt(value);
    return (index >= 0 ? index - 1 : index + len / 3) * 3;
  }
  parseNormalIndex(value, len) {
    const index = parseInt(value);
    return (index >= 0 ? index - 1 : index + len / 3) * 3;
  }
  parseUVIndex(value, len) {
    const index = parseInt(value);
    return (index >= 0 ? index - 1 : index + len / 2) * 2;
  }
  addVertex(a, b, c) {
    const src = this.vertices;
    const dst = this.object.geometry.vertices;
    dst.push(src[a + 0], src[a + 1], src[a + 2]);
    dst.push(src[b + 0], src[b + 1], src[b + 2]);
    dst.push(src[c + 0], src[c + 1], src[c + 2]);
  }
  addVertexPoint(a) {
    const src = this.vertices;
    const dst = this.object.geometry.vertices;
    dst.push(src[a + 0], src[a + 1], src[a + 2]);
  }
  addVertexLine(a) {
    const src = this.vertices;
    const dst = this.object.geometry.vertices;
    dst.push(src[a + 0], src[a + 1], src[a + 2]);
  }
  addNormal(a, b, c) {
    const src = this.normals;
    const dst = this.object.geometry.normals;
    dst.push(src[a + 0], src[a + 1], src[a + 2]);
    dst.push(src[b + 0], src[b + 1], src[b + 2]);
    dst.push(src[c + 0], src[c + 1], src[c + 2]);
  }
  addColor(a, b, c) {
    const src = this.colors;
    const dst = this.object.geometry.colors;
    dst.push(src[a + 0], src[a + 1], src[a + 2]);
    dst.push(src[b + 0], src[b + 1], src[b + 2]);
    dst.push(src[c + 0], src[c + 1], src[c + 2]);
  }
  addUV(a, b, c) {
    const src = this.uvs;
    const dst = this.object.geometry.uvs;
    dst.push(src[a + 0], src[a + 1]);
    dst.push(src[b + 0], src[b + 1]);
    dst.push(src[c + 0], src[c + 1]);
  }
  addUVLine(a) {
    const src = this.uvs;
    const dst = this.object.geometry.uvs;
    dst.push(src[a + 0], src[a + 1]);
  }
  addFace(a, b, c, ua, ub, uc, na, nb, nc) {
    const vLen = this.vertices.length;
    let ia = this.parseVertexIndex(a, vLen);
    let ib = this.parseVertexIndex(b, vLen);
    let ic = this.parseVertexIndex(c, vLen);
    this.addVertex(ia, ib, ic);
    if (ua !== undefined && ua !== '') {
      const uvLen = this.uvs.length;
      ia = this.parseUVIndex(ua, uvLen);
      ib = this.parseUVIndex(ub, uvLen);
      ic = this.parseUVIndex(uc, uvLen);
      this.addUV(ia, ib, ic);
    }
    if (na !== undefined && na !== '') {
      const nLen = this.normals.length;
      ia = this.parseNormalIndex(na, nLen);
      ib = na === nb ? ia : this.parseNormalIndex(nb, nLen);
      ic = na === nc ? ia : this.parseNormalIndex(nc, nLen);
      this.addNormal(ia, ib, ic);
    }
    if (this.colors.length > 0) {
      this.addColor(ia, ib, ic);
    }
  }
  addPointGeometry(vertices) {
    this.object.geometry.type = 'Points';
    const vLen = this.vertices.length;
    for (const vertex of vertices) {
      this.addVertexPoint(this.parseVertexIndex(vertex, vLen));
    }
  }
  addLineGeometry(vertices, uvs) {
    this.object.geometry.type = 'Line';
    const vLen = this.vertices.length;
    const uvLen = this.uvs.length;
    for (const vertex of vertices) {
      this.addVertexLine(this.parseVertexIndex(vertex, vLen));
    }
    for (const uv of uvs) {
      this.addUVLine(this.parseUVIndex(uv, uvLen));
    }
  }
}
function parseOBJMeshes(text) {
  const state = new ParserState();
  if (text.indexOf('\r\n') !== -1) {
    text = text.replace(/\r\n/g, '\n');
  }
  if (text.indexOf('\\\n') !== -1) {
    text = text.replace(/\\\n/g, '');
  }
  const lines = text.split('\n');
  let line = '';
  let lineFirstChar = '';
  let lineLength = 0;
  let result = [];
  const trimLeft = typeof ''.trimLeft === 'function';
  for (let i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    line = trimLeft ? line.trimLeft() : line.trim();
    lineLength = line.length;
    if (lineLength === 0) continue;
    lineFirstChar = line.charAt(0);
    if (lineFirstChar === '#') continue;
    if (lineFirstChar === 'v') {
      const data = line.split(/\s+/);
      switch (data[0]) {
        case 'v':
          state.vertices.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
          if (data.length >= 7) {
            state.colors.push(parseFloat(data[4]), parseFloat(data[5]), parseFloat(data[6]));
          }
          break;
        case 'vn':
          state.normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
          break;
        case 'vt':
          state.uvs.push(parseFloat(data[1]), parseFloat(data[2]));
          break;
      }
    } else if (lineFirstChar === 'f') {
      const lineData = line.substr(1).trim();
      const vertexData = lineData.split(/\s+/);
      const faceVertices = [];
      for (let j = 0, jl = vertexData.length; j < jl; j++) {
        const vertex = vertexData[j];
        if (vertex.length > 0) {
          const vertexParts = vertex.split('/');
          faceVertices.push(vertexParts);
        }
      }
      const v1 = faceVertices[0];
      for (let j = 1, jl = faceVertices.length - 1; j < jl; j++) {
        const v2 = faceVertices[j];
        const v3 = faceVertices[j + 1];
        state.addFace(v1[0], v2[0], v3[0], v1[1], v2[1], v3[1], v1[2], v2[2], v3[2]);
      }
    } else if (lineFirstChar === 'l') {
      const lineParts = line.substring(1).trim().split(' ');
      let lineVertices;
      const lineUVs = [];
      if (line.indexOf('/') === -1) {
        lineVertices = lineParts;
      } else {
        lineVertices = [];
        for (let li = 0, llen = lineParts.length; li < llen; li++) {
          const parts = lineParts[li].split('/');
          if (parts[0] !== '') lineVertices.push(parts[0]);
          if (parts[1] !== '') lineUVs.push(parts[1]);
        }
      }
      state.addLineGeometry(lineVertices, lineUVs);
    } else if (lineFirstChar === 'p') {
      const lineData = line.substr(1).trim();
      const pointData = lineData.split(' ');
      state.addPointGeometry(pointData);
    } else if ((result = OBJECT_RE.exec(line)) !== null) {
      const name = (' ' + result[0].substr(1).trim()).substr(1);
      state.startObject(name);
    } else if (MATERIAL_USE_RE.test(line)) {
      state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
    } else if (MATERIAL_RE.test(line)) {
      state.materialLibraries.push(line.substring(7).trim());
    } else if (lineFirstChar === 's') {
      result = line.split(' ');
      if (result.length > 1) {
        const value = result[1].trim().toLowerCase();
        state.object.smooth = value !== '0' && value !== 'off';
      } else {
        state.object.smooth = true;
      }
      const material = state.object.currentMaterial();
      if (material) material.smooth = state.object.smooth;
    } else {
      if (line === '\0') continue;
      throw new Error("Unexpected line: \"".concat(line, "\""));
    }
  }
  state.finalize();
  const meshes = [];
  const materials = [];
  for (const object of state.objects) {
    const {
      geometry
    } = object;
    if (geometry.vertices.length === 0) continue;
    const mesh = {
      header: {
        vertexCount: geometry.vertices.length / 3
      },
      attributes: {}
    };
    switch (geometry.type) {
      case 'Points':
        mesh.mode = 0;
        break;
      case 'Line':
        mesh.mode = 1;
        break;
      default:
        mesh.mode = 4;
        break;
    }
    mesh.attributes.POSITION = {
      value: new Float32Array(geometry.vertices),
      size: 3
    };
    if (geometry.normals.length > 0) {
      mesh.attributes.NORMAL = {
        value: new Float32Array(geometry.normals),
        size: 3
      };
    }
    if (geometry.colors.length > 0) {
      mesh.attributes.COLOR_0 = {
        value: new Float32Array(geometry.colors),
        size: 3
      };
    }
    if (geometry.uvs.length > 0) {
      mesh.attributes.TEXCOORD_0 = {
        value: new Float32Array(geometry.uvs),
        size: 2
      };
    }
    mesh.materials = [];
    for (const sourceMaterial of object.materials) {
      const _material = {
        name: sourceMaterial.name,
        flatShading: !sourceMaterial.smooth
      };
      mesh.materials.push(_material);
      materials.push(_material);
    }
    mesh.name = object.name;
    meshes.push(mesh);
  }
  return {
    meshes,
    materials
  };
}

function getOBJSchema(attributes) {
  let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let metadataMap;
  for (const key in metadata) {
    metadataMap = metadataMap || new Map();
    if (key !== 'value') {
      metadataMap.set(key, JSON.stringify(metadata[key]));
    }
  }
  const fields = [];
  for (const attributeName in attributes) {
    const attribute = attributes[attributeName];
    const field = getArrowFieldFromAttribute(attributeName, attribute);
    fields.push(field);
  }
  return new Schema(fields, metadataMap);
}
function getArrowFieldFromAttribute(attributeName, attribute) {
  const metadataMap = new Map();
  for (const key in attribute) {
    if (key !== 'value') {
      metadataMap.set(key, JSON.stringify(attribute[key]));
    }
  }
  const type = getArrowTypeFromTypedArray(attribute.value);
  const isSingleValue = !('size' in attribute) || attribute.size === 1;
  return isSingleValue ? new Field(attributeName, type, false, metadataMap) : new Field(attributeName, new FixedSizeList(attribute.size, new Field('value', type)), false, metadataMap);
}

function parseOBJ(text, options) {
  const {
    meshes
  } = parseOBJMeshes(text);
  const vertexCount = meshes.reduce((s, mesh) => s + mesh.header.vertexCount, 0);
  const attributes = mergeAttributes(meshes, vertexCount);
  const header = {
    vertexCount,
    boundingBox: getMeshBoundingBox(attributes)
  };
  const schema = getOBJSchema(attributes, {
    mode: 4,
    boundingBox: header.boundingBox
  });
  return {
    loaderData: {
      header: {}
    },
    schema,
    header,
    mode: 4,
    attributes
  };
}
function mergeAttributes(meshes, vertexCount) {
  const positions = new Float32Array(vertexCount * 3);
  let normals;
  let colors;
  let uvs;
  let i = 0;
  for (const mesh of meshes) {
    const {
      POSITION,
      NORMAL,
      COLOR_0,
      TEXCOORD_0
    } = mesh.attributes;
    positions.set(POSITION.value, i * 3);
    if (NORMAL) {
      normals = normals || new Float32Array(vertexCount * 3);
      normals.set(NORMAL.value, i * 3);
    }
    if (COLOR_0) {
      colors = colors || new Float32Array(vertexCount * 3);
      colors.set(COLOR_0.value, i * 3);
    }
    if (TEXCOORD_0) {
      uvs = uvs || new Float32Array(vertexCount * 2);
      uvs.set(TEXCOORD_0.value, i * 2);
    }
    i += POSITION.value.length / 3;
  }
  const attributes = {};
  attributes.POSITION = {
    value: positions,
    size: 3
  };
  if (normals) {
    attributes.NORMAL = {
      value: normals,
      size: 3
    };
  }
  if (colors) {
    attributes.COLOR_0 = {
      value: colors,
      size: 3
    };
  }
  if (uvs) {
    attributes.TEXCOORD_0 = {
      value: uvs,
      size: 2
    };
  }
  return attributes;
}

const DELIMITER_PATTERN = /\s+/;
function parseMTL(text, options) {
  const materials = [];
  let currentMaterial = {
    name: 'placeholder'
  };
  const lines = text.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    }
    const pos = line.indexOf(' ');
    let key = pos >= 0 ? line.substring(0, pos) : line;
    key = key.toLowerCase();
    let value = pos >= 0 ? line.substring(pos + 1) : '';
    value = value.trim();
    switch (key) {
      case 'newmtl':
        currentMaterial = {
          name: value
        };
        materials.push(currentMaterial);
        break;
      case 'ka':
        currentMaterial.ambientColor = parseColor(value);
        break;
      case 'kd':
        currentMaterial.diffuseColor = parseColor(value);
        break;
      case 'map_kd':
        currentMaterial.diffuseTextureUrl = value;
        break;
      case 'ks':
        currentMaterial.specularColor = parseColor(value);
        break;
      case 'map_ks':
        currentMaterial.specularTextureUrl = value;
        break;
      case 'ke':
        currentMaterial.emissiveColor = parseColor(value);
        break;
      case 'map_ke':
        currentMaterial.emissiveTextureUrl = value;
        break;
      case 'ns':
        currentMaterial.shininess = parseFloat(value);
        break;
      case 'map_ns':
        break;
      case 'ni':
        currentMaterial.refraction = parseFloat(value);
        break;
      case 'illum':
        currentMaterial.illumination = parseFloat(value);
        break;
    }
  }
  return materials;
}
function parseColor(value, options) {
  const rgb = value.split(DELIMITER_PATTERN, 3);
  const color = [parseFloat(rgb[0]), parseFloat(rgb[1]), parseFloat(rgb[2])];
  return color;
}

const VERSION$3 = "3.4.14" ;
const OBJLoader$1 = {
  name: 'OBJ',
  id: 'obj',
  module: 'obj',
  version: VERSION$3,
  worker: true,
  extensions: ['obj'],
  mimeTypes: ['text/plain'],
  testText: testOBJFile,
  options: {
    obj: {}
  }
};
function testOBJFile(text) {
  return text[0] === 'v';
}

const VERSION$2 = "3.4.14" ;
const MTLLoader = {
  name: 'MTL',
  id: 'mtl',
  module: 'mtl',
  version: VERSION$2,
  worker: true,
  extensions: ['mtl'],
  mimeTypes: ['text/plain'],
  testText: text => text.includes('newmtl'),
  options: {
    mtl: {}
  }
};

const OBJLoader = {
  ...OBJLoader$1,
  parse: async (arrayBuffer, options) => parseOBJ(new TextDecoder().decode(arrayBuffer)),
  parseTextSync: (text, options) => parseOBJ(text)
};
({
  ...MTLLoader,
  parse: async (arrayBuffer, options) => parseMTL(new TextDecoder().decode(arrayBuffer), options === null || options === void 0 ? void 0 : options.mtl),
  parseTextSync: (text, options) => parseMTL(text, options === null || options === void 0 ? void 0 : options.mtl)
});

function assert$2(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}

const isBrowser$2 = Boolean(typeof process !== 'object' || String(process) !== '[object process]' || process.browser);
const matches$1 = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
matches$1 && parseFloat(matches$1[1]) || 0;

const VERSION$1 = "3.2.10" ;

function assert$1(condition, message) {
  if (!condition) {
    throw new Error(message || 'loaders.gl assertion failed.');
  }
}

const isBrowser$1 = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const isMobile = typeof window !== 'undefined' && typeof window.orientation !== 'undefined';
const matches = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
matches && parseFloat(matches[1]) || 0;

class WorkerJob {
  constructor(jobName, workerThread) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "workerThread", void 0);

    _defineProperty(this, "isRunning", true);

    _defineProperty(this, "result", void 0);

    _defineProperty(this, "_resolve", () => {});

    _defineProperty(this, "_reject", () => {});

    this.name = jobName;
    this.workerThread = workerThread;
    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  postMessage(type, payload) {
    this.workerThread.postMessage({
      source: 'loaders.gl',
      type,
      payload
    });
  }

  done(value) {
    assert$1(this.isRunning);
    this.isRunning = false;

    this._resolve(value);
  }

  error(error) {
    assert$1(this.isRunning);
    this.isRunning = false;

    this._reject(error);
  }

}

class Worker$1 {}

const workerURLCache = new Map();
function getLoadableWorkerURL(props) {
  assert$1(props.source && !props.url || !props.source && props.url);
  let workerURL = workerURLCache.get(props.source || props.url);

  if (!workerURL) {
    if (props.url) {
      workerURL = getLoadableWorkerURLFromURL(props.url);
      workerURLCache.set(props.url, workerURL);
    }

    if (props.source) {
      workerURL = getLoadableWorkerURLFromSource(props.source);
      workerURLCache.set(props.source, workerURL);
    }
  }

  assert$1(workerURL);
  return workerURL;
}

function getLoadableWorkerURLFromURL(url) {
  if (!url.startsWith('http')) {
    return url;
  }

  const workerSource = buildScriptSource(url);
  return getLoadableWorkerURLFromSource(workerSource);
}

function getLoadableWorkerURLFromSource(workerSource) {
  const blob = new Blob([workerSource], {
    type: 'application/javascript'
  });
  return URL.createObjectURL(blob);
}

function buildScriptSource(workerUrl) {
  return "try {\n  importScripts('".concat(workerUrl, "');\n} catch (error) {\n  console.error(error);\n  throw error;\n}");
}

function getTransferList(object, recursive = true, transfers) {
  const transfersSet = transfers || new Set();

  if (!object) ; else if (isTransferable(object)) {
    transfersSet.add(object);
  } else if (isTransferable(object.buffer)) {
    transfersSet.add(object.buffer);
  } else if (ArrayBuffer.isView(object)) ; else if (recursive && typeof object === 'object') {
    for (const key in object) {
      getTransferList(object[key], recursive, transfersSet);
    }
  }

  return transfers === undefined ? Array.from(transfersSet) : [];
}

function isTransferable(object) {
  if (!object) {
    return false;
  }

  if (object instanceof ArrayBuffer) {
    return true;
  }

  if (typeof MessagePort !== 'undefined' && object instanceof MessagePort) {
    return true;
  }

  if (typeof ImageBitmap !== 'undefined' && object instanceof ImageBitmap) {
    return true;
  }

  if (typeof OffscreenCanvas !== 'undefined' && object instanceof OffscreenCanvas) {
    return true;
  }

  return false;
}

const NOOP = () => {};

class WorkerThread {
  static isSupported() {
    return typeof Worker !== 'undefined' && isBrowser$1 || typeof Worker$1 !== 'undefined' && !isBrowser$1;
  }

  constructor(props) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "source", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "terminated", false);

    _defineProperty(this, "worker", void 0);

    _defineProperty(this, "onMessage", void 0);

    _defineProperty(this, "onError", void 0);

    _defineProperty(this, "_loadableURL", '');

    const {
      name,
      source,
      url
    } = props;
    assert$1(source || url);
    this.name = name;
    this.source = source;
    this.url = url;
    this.onMessage = NOOP;

    this.onError = error => console.log(error);

    this.worker = isBrowser$1 ? this._createBrowserWorker() : this._createNodeWorker();
  }

  destroy() {
    this.onMessage = NOOP;
    this.onError = NOOP;
    this.worker.terminate();
    this.terminated = true;
  }

  get isRunning() {
    return Boolean(this.onMessage);
  }

  postMessage(data, transferList) {
    transferList = transferList || getTransferList(data);
    this.worker.postMessage(data, transferList);
  }

  _getErrorFromErrorEvent(event) {
    let message = 'Failed to load ';
    message += "worker ".concat(this.name, " from ").concat(this.url, ". ");

    if (event.message) {
      message += "".concat(event.message, " in ");
    }

    if (event.lineno) {
      message += ":".concat(event.lineno, ":").concat(event.colno);
    }

    return new Error(message);
  }

  _createBrowserWorker() {
    this._loadableURL = getLoadableWorkerURL({
      source: this.source,
      url: this.url
    });
    const worker = new Worker(this._loadableURL, {
      name: this.name
    });

    worker.onmessage = event => {
      if (!event.data) {
        this.onError(new Error('No data received'));
      } else {
        this.onMessage(event.data);
      }
    };

    worker.onerror = error => {
      this.onError(this._getErrorFromErrorEvent(error));
      this.terminated = true;
    };

    worker.onmessageerror = event => console.error(event);

    return worker;
  }

  _createNodeWorker() {
    let worker;

    if (this.url) {
      const absolute = this.url.includes(':/') || this.url.startsWith('/');
      const url = absolute ? this.url : "./".concat(this.url);
      worker = new Worker$1(url, {
        eval: false
      });
    } else if (this.source) {
      worker = new Worker$1(this.source, {
        eval: true
      });
    } else {
      throw new Error('no worker');
    }

    worker.on('message', data => {
      this.onMessage(data);
    });
    worker.on('error', error => {
      this.onError(error);
    });
    worker.on('exit', code => {});
    return worker;
  }

}

class WorkerPool {
  static isSupported() {
    return WorkerThread.isSupported();
  }

  constructor(props) {
    _defineProperty(this, "name", 'unnamed');

    _defineProperty(this, "source", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "maxConcurrency", 1);

    _defineProperty(this, "maxMobileConcurrency", 1);

    _defineProperty(this, "onDebug", () => {});

    _defineProperty(this, "reuseWorkers", true);

    _defineProperty(this, "props", {});

    _defineProperty(this, "jobQueue", []);

    _defineProperty(this, "idleQueue", []);

    _defineProperty(this, "count", 0);

    _defineProperty(this, "isDestroyed", false);

    this.source = props.source;
    this.url = props.url;
    this.setProps(props);
  }

  destroy() {
    this.idleQueue.forEach(worker => worker.destroy());
    this.isDestroyed = true;
  }

  setProps(props) {
    this.props = { ...this.props,
      ...props
    };

    if (props.name !== undefined) {
      this.name = props.name;
    }

    if (props.maxConcurrency !== undefined) {
      this.maxConcurrency = props.maxConcurrency;
    }

    if (props.maxMobileConcurrency !== undefined) {
      this.maxMobileConcurrency = props.maxMobileConcurrency;
    }

    if (props.reuseWorkers !== undefined) {
      this.reuseWorkers = props.reuseWorkers;
    }

    if (props.onDebug !== undefined) {
      this.onDebug = props.onDebug;
    }
  }

  async startJob(name, onMessage = (job, type, data) => job.done(data), onError = (job, error) => job.error(error)) {
    const startPromise = new Promise(onStart => {
      this.jobQueue.push({
        name,
        onMessage,
        onError,
        onStart
      });
      return this;
    });

    this._startQueuedJob();

    return await startPromise;
  }

  async _startQueuedJob() {
    if (!this.jobQueue.length) {
      return;
    }

    const workerThread = this._getAvailableWorker();

    if (!workerThread) {
      return;
    }

    const queuedJob = this.jobQueue.shift();

    if (queuedJob) {
      this.onDebug({
        message: 'Starting job',
        name: queuedJob.name,
        workerThread,
        backlog: this.jobQueue.length
      });
      const job = new WorkerJob(queuedJob.name, workerThread);

      workerThread.onMessage = data => queuedJob.onMessage(job, data.type, data.payload);

      workerThread.onError = error => queuedJob.onError(job, error);

      queuedJob.onStart(job);

      try {
        await job.result;
      } finally {
        this.returnWorkerToQueue(workerThread);
      }
    }
  }

  returnWorkerToQueue(worker) {
    const shouldDestroyWorker = this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency();

    if (shouldDestroyWorker) {
      worker.destroy();
      this.count--;
    } else {
      this.idleQueue.push(worker);
    }

    if (!this.isDestroyed) {
      this._startQueuedJob();
    }
  }

  _getAvailableWorker() {
    if (this.idleQueue.length > 0) {
      return this.idleQueue.shift() || null;
    }

    if (this.count < this._getMaxConcurrency()) {
      this.count++;
      const name = "".concat(this.name.toLowerCase(), " (#").concat(this.count, " of ").concat(this.maxConcurrency, ")");
      return new WorkerThread({
        name,
        source: this.source,
        url: this.url
      });
    }

    return null;
  }

  _getMaxConcurrency() {
    return isMobile ? this.maxMobileConcurrency : this.maxConcurrency;
  }

}

const DEFAULT_PROPS = {
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: true,
  onDebug: () => {}
};
class WorkerFarm {
  static isSupported() {
    return WorkerThread.isSupported();
  }

  static getWorkerFarm(props = {}) {
    WorkerFarm._workerFarm = WorkerFarm._workerFarm || new WorkerFarm({});

    WorkerFarm._workerFarm.setProps(props);

    return WorkerFarm._workerFarm;
  }

  constructor(props) {
    _defineProperty(this, "props", void 0);

    _defineProperty(this, "workerPools", new Map());

    this.props = { ...DEFAULT_PROPS
    };
    this.setProps(props);
    this.workerPools = new Map();
  }

  destroy() {
    for (const workerPool of this.workerPools.values()) {
      workerPool.destroy();
    }

    this.workerPools = new Map();
  }

  setProps(props) {
    this.props = { ...this.props,
      ...props
    };

    for (const workerPool of this.workerPools.values()) {
      workerPool.setProps(this._getWorkerPoolProps());
    }
  }

  getWorkerPool(options) {
    const {
      name,
      source,
      url
    } = options;
    let workerPool = this.workerPools.get(name);

    if (!workerPool) {
      workerPool = new WorkerPool({
        name,
        source,
        url
      });
      workerPool.setProps(this._getWorkerPoolProps());
      this.workerPools.set(name, workerPool);
    }

    return workerPool;
  }

  _getWorkerPoolProps() {
    return {
      maxConcurrency: this.props.maxConcurrency,
      maxMobileConcurrency: this.props.maxMobileConcurrency,
      reuseWorkers: this.props.reuseWorkers,
      onDebug: this.props.onDebug
    };
  }

}

_defineProperty(WorkerFarm, "_workerFarm", void 0);

const NPM_TAG = 'latest';
function getWorkerURL(worker, options = {}) {
  const workerOptions = options[worker.id] || {};
  const workerFile = "".concat(worker.id, "-worker.js");
  let url = workerOptions.workerUrl;

  if (!url && worker.id === 'compression') {
    url = options.workerUrl;
  }

  if (options._workerType === 'test') {
    url = "modules/".concat(worker.module, "/dist/").concat(workerFile);
  }

  if (!url) {
    let version = worker.version;

    if (version === 'latest') {
      version = NPM_TAG;
    }

    const versionTag = version ? "@".concat(version) : '';
    url = "https://unpkg.com/@loaders.gl/".concat(worker.module).concat(versionTag, "/dist/").concat(workerFile);
  }

  assert$1(url);
  return url;
}

function validateWorkerVersion(worker, coreVersion = VERSION$1) {
  assert$1(worker, 'no worker provided');
  const workerVersion = worker.version;

  if (!coreVersion || !workerVersion) {
    return false;
  }

  return true;
}

function canParseWithWorker(loader, options) {
  if (!WorkerFarm.isSupported()) {
    return false;
  }

  if (!isBrowser$1 && !(options !== null && options !== void 0 && options._nodeWorkers)) {
    return false;
  }

  return loader.worker && (options === null || options === void 0 ? void 0 : options.worker);
}
async function parseWithWorker(loader, data, options, context, parseOnMainThread) {
  const name = loader.id;
  const url = getWorkerURL(loader, options);
  const workerFarm = WorkerFarm.getWorkerFarm(options);
  const workerPool = workerFarm.getWorkerPool({
    name,
    url
  });
  options = JSON.parse(JSON.stringify(options));
  context = JSON.parse(JSON.stringify(context || {}));
  const job = await workerPool.startJob('process-on-worker', onMessage.bind(null, parseOnMainThread));
  job.postMessage('process', {
    input: data,
    options,
    context
  });
  const result = await job.result;
  return await result.result;
}

async function onMessage(parseOnMainThread, job, type, payload) {
  switch (type) {
    case 'done':
      job.done(payload);
      break;

    case 'error':
      job.error(new Error(payload.error));
      break;

    case 'process':
      const {
        id,
        input,
        options
      } = payload;

      try {
        const result = await parseOnMainThread(input, options);
        job.postMessage('done', {
          id,
          result
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        job.postMessage('error', {
          id,
          error: message
        });
      }

      break;

    default:
      console.warn("parse-with-worker unknown message ".concat(type));
  }
}

function isBuffer$1(value) {
  return value && typeof value === 'object' && value.isBuffer;
}
function bufferToArrayBuffer(buffer) {
  if (isBuffer$1(buffer)) {
    const typedArray = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length);
    return typedArray.slice().buffer;
  }

  return buffer;
}

function toArrayBuffer(data) {
  if (isBuffer$1(data)) {
    return bufferToArrayBuffer(data);
  }

  if (data instanceof ArrayBuffer) {
    return data;
  }

  if (ArrayBuffer.isView(data)) {
    if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
      return data.buffer;
    }

    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }

  if (typeof data === 'string') {
    const text = data;
    const uint8Array = new TextEncoder().encode(text);
    return uint8Array.buffer;
  }

  if (data && typeof data === 'object' && data._toArrayBuffer) {
    return data._toArrayBuffer();
  }

  throw new Error('toArrayBuffer');
}
function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
  byteLength = byteLength || arrayBuffer1.byteLength;

  if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
    return false;
  }

  const array1 = new Uint8Array(arrayBuffer1);
  const array2 = new Uint8Array(arrayBuffer2);

  for (let i = 0; i < array1.length; ++i) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}
function concatenateArrayBuffers(...sources) {
  const sourceArrays = sources.map(source2 => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
  const byteLength = sourceArrays.reduce((length, typedArray) => length + typedArray.byteLength, 0);
  const result = new Uint8Array(byteLength);
  let offset = 0;

  for (const sourceArray of sourceArrays) {
    result.set(sourceArray, offset);
    offset += sourceArray.byteLength;
  }

  return result.buffer;
}

async function concatenateArrayBuffersAsync(asyncIterator) {
  const arrayBuffers = [];

  for await (const chunk of asyncIterator) {
    arrayBuffers.push(chunk);
  }

  return concatenateArrayBuffers(...arrayBuffers);
}

let pathPrefix = '';
const fileAliases = {};
function resolvePath(filename) {
  for (const alias in fileAliases) {
    if (filename.startsWith(alias)) {
      const replacement = fileAliases[alias];
      filename = filename.replace(alias, replacement);
    }
  }

  if (!filename.startsWith('http://') && !filename.startsWith('https://')) {
    filename = "".concat(pathPrefix).concat(filename);
  }

  return filename;
}

function filename(url) {
  const slashIndex = url && url.lastIndexOf('/');
  return slashIndex >= 0 ? url.substr(slashIndex + 1) : '';
}

const isBoolean = x => typeof x === 'boolean';

const isFunction = x => typeof x === 'function';

const isObject = x => x !== null && typeof x === 'object';
const isPureObject = x => isObject(x) && x.constructor === {}.constructor;
const isIterable = x => x && typeof x[Symbol.iterator] === 'function';
const isAsyncIterable = x => x && typeof x[Symbol.asyncIterator] === 'function';
const isResponse = x => typeof Response !== 'undefined' && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
const isBlob = x => typeof Blob !== 'undefined' && x instanceof Blob;
const isBuffer = x => x && typeof x === 'object' && x.isBuffer;
const isReadableDOMStream = x => typeof ReadableStream !== 'undefined' && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
const isReadableNodeStream = x => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
const isReadableStream = x => isReadableDOMStream(x) || isReadableNodeStream(x);

const DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
const MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;
function parseMIMEType(mimeString) {
  const matches = MIME_TYPE_PATTERN.exec(mimeString);

  if (matches) {
    return matches[1];
  }

  return mimeString;
}
function parseMIMETypeFromURL(url) {
  const matches = DATA_URL_PATTERN.exec(url);

  if (matches) {
    return matches[1];
  }

  return '';
}

const QUERY_STRING_PATTERN = /\?.*/;
function getResourceUrlAndType(resource) {
  if (isResponse(resource)) {
    const url = stripQueryString(resource.url || '');
    const contentTypeHeader = resource.headers.get('content-type') || '';
    return {
      url,
      type: parseMIMEType(contentTypeHeader) || parseMIMETypeFromURL(url)
    };
  }

  if (isBlob(resource)) {
    return {
      url: stripQueryString(resource.name || ''),
      type: resource.type || ''
    };
  }

  if (typeof resource === 'string') {
    return {
      url: stripQueryString(resource),
      type: parseMIMETypeFromURL(resource)
    };
  }

  return {
    url: '',
    type: ''
  };
}
function getResourceContentLength(resource) {
  if (isResponse(resource)) {
    return resource.headers['content-length'] || -1;
  }

  if (isBlob(resource)) {
    return resource.size;
  }

  if (typeof resource === 'string') {
    return resource.length;
  }

  if (resource instanceof ArrayBuffer) {
    return resource.byteLength;
  }

  if (ArrayBuffer.isView(resource)) {
    return resource.byteLength;
  }

  return -1;
}

function stripQueryString(url) {
  return url.replace(QUERY_STRING_PATTERN, '');
}

async function makeResponse(resource) {
  if (isResponse(resource)) {
    return resource;
  }

  const headers = {};
  const contentLength = getResourceContentLength(resource);

  if (contentLength >= 0) {
    headers['content-length'] = String(contentLength);
  }

  const {
    url,
    type
  } = getResourceUrlAndType(resource);

  if (type) {
    headers['content-type'] = type;
  }

  const initialDataUrl = await getInitialDataUrl(resource);

  if (initialDataUrl) {
    headers['x-first-bytes'] = initialDataUrl;
  }

  if (typeof resource === 'string') {
    resource = new TextEncoder().encode(resource);
  }

  const response = new Response(resource, {
    headers
  });
  Object.defineProperty(response, 'url', {
    value: url
  });
  return response;
}
async function checkResponse(response) {
  if (!response.ok) {
    const message = await getResponseError(response);
    throw new Error(message);
  }
}

async function getResponseError(response) {
  let message = "Failed to fetch resource ".concat(response.url, " (").concat(response.status, "): ");

  try {
    const contentType = response.headers.get('Content-Type');
    let text = response.statusText;

    if (contentType.includes('application/json')) {
      text += " ".concat(await response.text());
    }

    message += text;
    message = message.length > 60 ? "".concat(message.slice(0, 60), "...") : message;
  } catch (error) {}

  return message;
}

async function getInitialDataUrl(resource) {
  const INITIAL_DATA_LENGTH = 5;

  if (typeof resource === 'string') {
    return "data:,".concat(resource.slice(0, INITIAL_DATA_LENGTH));
  }

  if (resource instanceof Blob) {
    const blobSlice = resource.slice(0, 5);
    return await new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = event => {
        var _event$target;

        return resolve(event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
      };

      reader.readAsDataURL(blobSlice);
    });
  }

  if (resource instanceof ArrayBuffer) {
    const slice = resource.slice(0, INITIAL_DATA_LENGTH);
    const base64 = arrayBufferToBase64(slice);
    return "data:base64,".concat(base64);
  }

  return null;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

async function fetchFile(url, options) {
  if (typeof url === 'string') {
    url = resolvePath(url);
    let fetchOptions = options;

    if (options !== null && options !== void 0 && options.fetch && typeof (options === null || options === void 0 ? void 0 : options.fetch) !== 'function') {
      fetchOptions = options.fetch;
    }

    return await fetch(url, fetchOptions);
  }

  return await makeResponse(url);
}

function isElectron(mockUserAgent) {
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true;
  }

  if (typeof process !== 'undefined' && typeof process.versions === 'object' && Boolean(process.versions.electron)) {
    return true;
  }

  const realUserAgent = typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent;
  const userAgent = mockUserAgent || realUserAgent;

  if (userAgent && userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}

function isBrowser() {
  const isNode = typeof process === 'object' && String(process) === '[object process]' && !process.browser;
  return !isNode || isElectron();
}

const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document,
  process: typeof process === 'object' && process
};
const window_ = globals.window || globals.self || globals.global;
const process_ = globals.process || {};

const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'untranspiled source';
isBrowser();

function getStorage(type) {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return storage;
  } catch (e) {
    return null;
  }
}

class LocalStorage {
  constructor(id) {
    let defaultSettings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sessionStorage';

    _defineProperty(this, "storage", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "config", {});

    this.storage = getStorage(type);
    this.id = id;
    this.config = {};
    Object.assign(this.config, defaultSettings);

    this._loadConfiguration();
  }

  getConfiguration() {
    return this.config;
  }

  setConfiguration(configuration) {
    this.config = {};
    return this.updateConfiguration(configuration);
  }

  updateConfiguration(configuration) {
    Object.assign(this.config, configuration);

    if (this.storage) {
      const serialized = JSON.stringify(this.config);
      this.storage.setItem(this.id, serialized);
    }

    return this;
  }

  _loadConfiguration() {
    let configuration = {};

    if (this.storage) {
      const serializedConfiguration = this.storage.getItem(this.id);
      configuration = serializedConfiguration ? JSON.parse(serializedConfiguration) : {};
    }

    Object.assign(this.config, configuration);
    return this;
  }

}

function formatTime(ms) {
  let formatted;

  if (ms < 10) {
    formatted = "".concat(ms.toFixed(2), "ms");
  } else if (ms < 100) {
    formatted = "".concat(ms.toFixed(1), "ms");
  } else if (ms < 1000) {
    formatted = "".concat(ms.toFixed(0), "ms");
  } else {
    formatted = "".concat((ms / 1000).toFixed(2), "s");
  }

  return formatted;
}
function leftPad(string) {
  let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  const padLength = Math.max(length - string.length, 0);
  return "".concat(' '.repeat(padLength)).concat(string);
}

function formatImage(image, message, scale) {
  let maxWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 600;
  const imageUrl = image.src.replace(/\(/g, '%28').replace(/\)/g, '%29');

  if (image.width > maxWidth) {
    scale = Math.min(scale, maxWidth / image.width);
  }

  const width = image.width * scale;
  const height = image.height * scale;
  const style = ['font-size:1px;', "padding:".concat(Math.floor(height / 2), "px ").concat(Math.floor(width / 2), "px;"), "line-height:".concat(height, "px;"), "background:url(".concat(imageUrl, ");"), "background-size:".concat(width, "px ").concat(height, "px;"), 'color:transparent;'].join('');
  return ["".concat(message, " %c+"), style];
}

let COLOR;

(function (COLOR) {
  COLOR[COLOR["BLACK"] = 30] = "BLACK";
  COLOR[COLOR["RED"] = 31] = "RED";
  COLOR[COLOR["GREEN"] = 32] = "GREEN";
  COLOR[COLOR["YELLOW"] = 33] = "YELLOW";
  COLOR[COLOR["BLUE"] = 34] = "BLUE";
  COLOR[COLOR["MAGENTA"] = 35] = "MAGENTA";
  COLOR[COLOR["CYAN"] = 36] = "CYAN";
  COLOR[COLOR["WHITE"] = 37] = "WHITE";
  COLOR[COLOR["BRIGHT_BLACK"] = 90] = "BRIGHT_BLACK";
  COLOR[COLOR["BRIGHT_RED"] = 91] = "BRIGHT_RED";
  COLOR[COLOR["BRIGHT_GREEN"] = 92] = "BRIGHT_GREEN";
  COLOR[COLOR["BRIGHT_YELLOW"] = 93] = "BRIGHT_YELLOW";
  COLOR[COLOR["BRIGHT_BLUE"] = 94] = "BRIGHT_BLUE";
  COLOR[COLOR["BRIGHT_MAGENTA"] = 95] = "BRIGHT_MAGENTA";
  COLOR[COLOR["BRIGHT_CYAN"] = 96] = "BRIGHT_CYAN";
  COLOR[COLOR["BRIGHT_WHITE"] = 97] = "BRIGHT_WHITE";
})(COLOR || (COLOR = {}));

function getColor(color) {
  return typeof color === 'string' ? COLOR[color.toUpperCase()] || COLOR.WHITE : color;
}

function addColor(string, color, background) {
  if (!isBrowser && typeof string === 'string') {
    if (color) {
      color = getColor(color);
      string = "\x1B[".concat(color, "m").concat(string, "\x1B[39m");
    }

    if (background) {
      color = getColor(background);
      string = "\x1B[".concat(background + 10, "m").concat(string, "\x1B[49m");
    }
  }

  return string;
}

function autobind(obj) {
  let predefined = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['constructor'];
  const proto = Object.getPrototypeOf(obj);
  const propNames = Object.getOwnPropertyNames(proto);

  for (const key of propNames) {
    if (typeof obj[key] === 'function') {
      if (!predefined.find(name => key === name)) {
        obj[key] = obj[key].bind(obj);
      }
    }
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function getHiResTimestamp() {
  let timestamp;

  if (isBrowser && 'performance' in window_) {
    var _window$performance, _window$performance$n;

    timestamp = window_ === null || window_ === void 0 ? void 0 : (_window$performance = window_.performance) === null || _window$performance === void 0 ? void 0 : (_window$performance$n = _window$performance.now) === null || _window$performance$n === void 0 ? void 0 : _window$performance$n.call(_window$performance);
  } else if ('hrtime' in process_) {
    var _process$hrtime;

    const timeParts = process_ === null || process_ === void 0 ? void 0 : (_process$hrtime = process_.hrtime) === null || _process$hrtime === void 0 ? void 0 : _process$hrtime.call(process_);
    timestamp = timeParts[0] * 1000 + timeParts[1] / 1e6;
  } else {
    timestamp = Date.now();
  }

  return timestamp;
}

const originalConsole = {
  debug: isBrowser ? console.debug || console.log : console.log,
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
};
const DEFAULT_SETTINGS = {
  enabled: true,
  level: 0
};

function noop() {}

const cache = {};
const ONCE = {
  once: true
};
class Log {
  constructor() {
    let {
      id
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      id: ''
    };

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "VERSION", VERSION);

    _defineProperty(this, "_startTs", getHiResTimestamp());

    _defineProperty(this, "_deltaTs", getHiResTimestamp());

    _defineProperty(this, "_storage", void 0);

    _defineProperty(this, "userData", {});

    _defineProperty(this, "LOG_THROTTLE_TIMEOUT", 0);

    this.id = id;
    this._storage = new LocalStorage("__probe-".concat(this.id, "__"), DEFAULT_SETTINGS);
    this.userData = {};
    this.timeStamp("".concat(this.id, " started"));
    autobind(this);
    Object.seal(this);
  }

  set level(newLevel) {
    this.setLevel(newLevel);
  }

  get level() {
    return this.getLevel();
  }

  isEnabled() {
    return this._storage.config.enabled;
  }

  getLevel() {
    return this._storage.config.level;
  }

  getTotal() {
    return Number((getHiResTimestamp() - this._startTs).toPrecision(10));
  }

  getDelta() {
    return Number((getHiResTimestamp() - this._deltaTs).toPrecision(10));
  }

  set priority(newPriority) {
    this.level = newPriority;
  }

  get priority() {
    return this.level;
  }

  getPriority() {
    return this.level;
  }

  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this._storage.updateConfiguration({
      enabled
    });

    return this;
  }

  setLevel(level) {
    this._storage.updateConfiguration({
      level
    });

    return this;
  }

  get(setting) {
    return this._storage.config[setting];
  }

  set(setting, value) {
    this._storage.updateConfiguration({
      [setting]: value
    });
  }

  settings() {
    if (console.table) {
      console.table(this._storage.config);
    } else {
      console.log(this._storage.config);
    }
  }

  assert(condition, message) {
    assert(condition, message);
  }

  warn(message) {
    return this._getLogFunction(0, message, originalConsole.warn, arguments, ONCE);
  }

  error(message) {
    return this._getLogFunction(0, message, originalConsole.error, arguments);
  }

  deprecated(oldUsage, newUsage) {
    return this.warn("`".concat(oldUsage, "` is deprecated and will be removed in a later version. Use `").concat(newUsage, "` instead"));
  }

  removed(oldUsage, newUsage) {
    return this.error("`".concat(oldUsage, "` has been removed. Use `").concat(newUsage, "` instead"));
  }

  probe(logLevel, message) {
    return this._getLogFunction(logLevel, message, originalConsole.log, arguments, {
      time: true,
      once: true
    });
  }

  log(logLevel, message) {
    return this._getLogFunction(logLevel, message, originalConsole.debug, arguments);
  }

  info(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.info, arguments);
  }

  once(logLevel, message) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return this._getLogFunction(logLevel, message, originalConsole.debug || originalConsole.info, arguments, ONCE);
  }

  table(logLevel, table, columns) {
    if (table) {
      return this._getLogFunction(logLevel, table, console.table || noop, columns && [columns], {
        tag: getTableHeader(table)
      });
    }

    return noop;
  }

  image(_ref) {
    let {
      logLevel,
      priority,
      image,
      message = '',
      scale = 1
    } = _ref;

    if (!this._shouldLog(logLevel || priority)) {
      return noop;
    }

    return isBrowser ? logImageInBrowser({
      image,
      message,
      scale
    }) : logImageInNode({
      image,
      message,
      scale
    });
  }

  time(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.time ? console.time : console.info);
  }

  timeEnd(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.timeEnd ? console.timeEnd : console.info);
  }

  timeStamp(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.timeStamp || noop);
  }

  group(logLevel, message) {
    let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      collapsed: false
    };
    const options = normalizeArguments({
      logLevel,
      message,
      opts
    });
    const {
      collapsed
    } = opts;
    options.method = (collapsed ? console.groupCollapsed : console.group) || console.info;
    return this._getLogFunction(options);
  }

  groupCollapsed(logLevel, message) {
    let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.group(logLevel, message, Object.assign({}, opts, {
      collapsed: true
    }));
  }

  groupEnd(logLevel) {
    return this._getLogFunction(logLevel, '', console.groupEnd || noop);
  }

  withGroup(logLevel, message, func) {
    this.group(logLevel, message)();

    try {
      func();
    } finally {
      this.groupEnd(logLevel)();
    }
  }

  trace() {
    if (console.trace) {
      console.trace();
    }
  }

  _shouldLog(logLevel) {
    return this.isEnabled() && this.getLevel() >= normalizeLogLevel(logLevel);
  }

  _getLogFunction(logLevel, message, method, args, opts) {
    if (this._shouldLog(logLevel)) {
      opts = normalizeArguments({
        logLevel,
        message,
        args,
        opts
      });
      method = method || opts.method;
      assert(method);
      opts.total = this.getTotal();
      opts.delta = this.getDelta();
      this._deltaTs = getHiResTimestamp();
      const tag = opts.tag || opts.message;

      if (opts.once) {
        if (!cache[tag]) {
          cache[tag] = getHiResTimestamp();
        } else {
          return noop;
        }
      }

      message = decorateMessage(this.id, opts.message, opts);
      return method.bind(console, message, ...opts.args);
    }

    return noop;
  }

}

_defineProperty(Log, "VERSION", VERSION);

function normalizeLogLevel(logLevel) {
  if (!logLevel) {
    return 0;
  }

  let resolvedLevel;

  switch (typeof logLevel) {
    case 'number':
      resolvedLevel = logLevel;
      break;

    case 'object':
      resolvedLevel = logLevel.logLevel || logLevel.priority || 0;
      break;

    default:
      return 0;
  }

  assert(Number.isFinite(resolvedLevel) && resolvedLevel >= 0);
  return resolvedLevel;
}

function normalizeArguments(opts) {
  const {
    logLevel,
    message
  } = opts;
  opts.logLevel = normalizeLogLevel(logLevel);
  const args = opts.args ? Array.from(opts.args) : [];

  while (args.length && args.shift() !== message) {}

  switch (typeof logLevel) {
    case 'string':
    case 'function':
      if (message !== undefined) {
        args.unshift(message);
      }

      opts.message = logLevel;
      break;

    case 'object':
      Object.assign(opts, logLevel);
      break;
  }

  if (typeof opts.message === 'function') {
    opts.message = opts.message();
  }

  const messageType = typeof opts.message;
  assert(messageType === 'string' || messageType === 'object');
  return Object.assign(opts, {
    args
  }, opts.opts);
}

function decorateMessage(id, message, opts) {
  if (typeof message === 'string') {
    const time = opts.time ? leftPad(formatTime(opts.total)) : '';
    message = opts.time ? "".concat(id, ": ").concat(time, "  ").concat(message) : "".concat(id, ": ").concat(message);
    message = addColor(message, opts.color, opts.background);
  }

  return message;
}

function logImageInNode(_ref2) {
  let {
    image,
    message = '',
    scale = 1
  } = _ref2;
  undefined({
    image,
    message,
    scale
  });
  return noop;
}

function logImageInBrowser(_ref3) {
  let {
    image,
    message = '',
    scale = 1
  } = _ref3;

  if (typeof image === 'string') {
    const img = new Image();

    img.onload = () => {
      const args = formatImage(img, message, scale);
      console.log(...args);
    };

    img.src = image;
    return noop;
  }

  const element = image.nodeName || '';

  if (element.toLowerCase() === 'img') {
    console.log(...formatImage(image, message, scale));
    return noop;
  }

  if (element.toLowerCase() === 'canvas') {
    const img = new Image();

    img.onload = () => console.log(...formatImage(img, message, scale));

    img.src = image.toDataURL();
    return noop;
  }

  return noop;
}

function getTableHeader(table) {
  for (const key in table) {
    for (const title in table[key]) {
      return title || 'untitled';
    }
  }

  return 'empty';
}

const probeLog = new Log({
  id: 'loaders.gl'
});
class NullLog {
  log() {
    return () => {};
  }

  info() {
    return () => {};
  }

  warn() {
    return () => {};
  }

  error() {
    return () => {};
  }

}
class ConsoleLog {
  constructor() {
    _defineProperty(this, "console", void 0);

    this.console = console;
  }

  log(...args) {
    return this.console.log.bind(this.console, ...args);
  }

  info(...args) {
    return this.console.info.bind(this.console, ...args);
  }

  warn(...args) {
    return this.console.warn.bind(this.console, ...args);
  }

  error(...args) {
    return this.console.error.bind(this.console, ...args);
  }

}

const DEFAULT_LOADER_OPTIONS = {
  fetch: null,
  mimeType: undefined,
  nothrow: false,
  log: new ConsoleLog(),
  CDN: 'https://unpkg.com/@loaders.gl',
  worker: true,
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: isBrowser$2,
  _nodeWorkers: false,
  _workerType: '',
  limit: 0,
  _limitMB: 0,
  batchSize: 'auto',
  batchDebounceMs: 0,
  metadata: false,
  transforms: []
};
const REMOVED_LOADER_OPTIONS = {
  throws: 'nothrow',
  dataType: '(no longer used)',
  uri: 'baseUri',
  method: 'fetch.method',
  headers: 'fetch.headers',
  body: 'fetch.body',
  mode: 'fetch.mode',
  credentials: 'fetch.credentials',
  cache: 'fetch.cache',
  redirect: 'fetch.redirect',
  referrer: 'fetch.referrer',
  referrerPolicy: 'fetch.referrerPolicy',
  integrity: 'fetch.integrity',
  keepalive: 'fetch.keepalive',
  signal: 'fetch.signal'
};

function getGlobalLoaderState() {
  globalThis.loaders = globalThis.loaders || {};
  const {
    loaders
  } = globalThis;
  loaders._state = loaders._state || {};
  return loaders._state;
}
const getGlobalLoaderOptions = () => {
  const state = getGlobalLoaderState();
  state.globalOptions = state.globalOptions || { ...DEFAULT_LOADER_OPTIONS
  };
  return state.globalOptions;
};
function normalizeOptions(options, loader, loaders, url) {
  loaders = loaders || [];
  loaders = Array.isArray(loaders) ? loaders : [loaders];
  validateOptions(options, loaders);
  return normalizeOptionsInternal(loader, options, url);
}
function getFetchFunction(options, context) {
  const globalOptions = getGlobalLoaderOptions();
  const fetchOptions = options || globalOptions;

  if (typeof fetchOptions.fetch === 'function') {
    return fetchOptions.fetch;
  }

  if (isObject(fetchOptions.fetch)) {
    return url => fetchFile(url, fetchOptions);
  }

  if (context !== null && context !== void 0 && context.fetch) {
    return context === null || context === void 0 ? void 0 : context.fetch;
  }

  return fetchFile;
}

function validateOptions(options, loaders) {
  validateOptionsObject(options, null, DEFAULT_LOADER_OPTIONS, REMOVED_LOADER_OPTIONS, loaders);

  for (const loader of loaders) {
    const idOptions = options && options[loader.id] || {};
    const loaderOptions = loader.options && loader.options[loader.id] || {};
    const deprecatedOptions = loader.deprecatedOptions && loader.deprecatedOptions[loader.id] || {};
    validateOptionsObject(idOptions, loader.id, loaderOptions, deprecatedOptions, loaders);
  }
}

function validateOptionsObject(options, id, defaultOptions, deprecatedOptions, loaders) {
  const loaderName = id || 'Top level';
  const prefix = id ? "".concat(id, ".") : '';

  for (const key in options) {
    const isSubOptions = !id && isObject(options[key]);
    const isBaseUriOption = key === 'baseUri' && !id;
    const isWorkerUrlOption = key === 'workerUrl' && id;

    if (!(key in defaultOptions) && !isBaseUriOption && !isWorkerUrlOption) {
      if (key in deprecatedOptions) {
        probeLog.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' no longer supported, use '").concat(deprecatedOptions[key], "'"))();
      } else if (!isSubOptions) {
        const suggestion = findSimilarOption(key, loaders);
        probeLog.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' not recognized. ").concat(suggestion))();
      }
    }
  }
}

function findSimilarOption(optionKey, loaders) {
  const lowerCaseOptionKey = optionKey.toLowerCase();
  let bestSuggestion = '';

  for (const loader of loaders) {
    for (const key in loader.options) {
      if (optionKey === key) {
        return "Did you mean '".concat(loader.id, ".").concat(key, "'?");
      }

      const lowerCaseKey = key.toLowerCase();
      const isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);

      if (isPartialMatch) {
        bestSuggestion = bestSuggestion || "Did you mean '".concat(loader.id, ".").concat(key, "'?");
      }
    }
  }

  return bestSuggestion;
}

function normalizeOptionsInternal(loader, options, url) {
  const loaderDefaultOptions = loader.options || {};
  const mergedOptions = { ...loaderDefaultOptions
  };
  addUrlOptions(mergedOptions, url);

  if (mergedOptions.log === null) {
    mergedOptions.log = new NullLog();
  }

  mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
  mergeNestedFields(mergedOptions, options);
  return mergedOptions;
}

function mergeNestedFields(mergedOptions, options) {
  for (const key in options) {
    if (key in options) {
      const value = options[key];

      if (isPureObject(value) && isPureObject(mergedOptions[key])) {
        mergedOptions[key] = { ...mergedOptions[key],
          ...options[key]
        };
      } else {
        mergedOptions[key] = options[key];
      }
    }
  }
}

function addUrlOptions(options, url) {
  if (url && !('baseUri' in options)) {
    options.baseUri = url;
  }
}

function isLoaderObject(loader) {
  var _loader;

  if (!loader) {
    return false;
  }

  if (Array.isArray(loader)) {
    loader = loader[0];
  }

  const hasExtensions = Array.isArray((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.extensions);
  return hasExtensions;
}
function normalizeLoader(loader) {
  var _loader2, _loader3;

  assert$2(loader, 'null loader');
  assert$2(isLoaderObject(loader), 'invalid loader');
  let options;

  if (Array.isArray(loader)) {
    options = loader[1];
    loader = loader[0];
    loader = { ...loader,
      options: { ...loader.options,
        ...options
      }
    };
  }

  if ((_loader2 = loader) !== null && _loader2 !== void 0 && _loader2.parseTextSync || (_loader3 = loader) !== null && _loader3 !== void 0 && _loader3.parseText) {
    loader.text = true;
  }

  if (!loader.text) {
    loader.binary = true;
  }

  return loader;
}

const getGlobalLoaderRegistry = () => {
  const state = getGlobalLoaderState();
  state.loaderRegistry = state.loaderRegistry || [];
  return state.loaderRegistry;
};
function getRegisteredLoaders() {
  return getGlobalLoaderRegistry();
}

const log = new Log({
  id: 'loaders.gl'
});

const EXT_PATTERN = /\.([^.]+)$/;
async function selectLoader(data, loaders = [], options, context) {
  if (!validHTTPResponse(data)) {
    return null;
  }

  let loader = selectLoaderSync(data, loaders, { ...options,
    nothrow: true
  }, context);

  if (loader) {
    return loader;
  }

  if (isBlob(data)) {
    data = await data.slice(0, 10).arrayBuffer();
    loader = selectLoaderSync(data, loaders, options, context);
  }

  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }

  return loader;
}
function selectLoaderSync(data, loaders = [], options, context) {
  if (!validHTTPResponse(data)) {
    return null;
  }

  if (loaders && !Array.isArray(loaders)) {
    return normalizeLoader(loaders);
  }

  let candidateLoaders = [];

  if (loaders) {
    candidateLoaders = candidateLoaders.concat(loaders);
  }

  if (!(options !== null && options !== void 0 && options.ignoreRegisteredLoaders)) {
    candidateLoaders.push(...getRegisteredLoaders());
  }

  normalizeLoaders(candidateLoaders);
  const loader = selectLoaderInternal(data, candidateLoaders, options, context);

  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }

  return loader;
}

function selectLoaderInternal(data, loaders, options, context) {
  const {
    url,
    type
  } = getResourceUrlAndType(data);
  const testUrl = url || (context === null || context === void 0 ? void 0 : context.url);
  let loader = null;
  let reason = '';

  if (options !== null && options !== void 0 && options.mimeType) {
    loader = findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.mimeType);
    reason = "match forced by supplied MIME type ".concat(options === null || options === void 0 ? void 0 : options.mimeType);
  }

  loader = loader || findLoaderByUrl(loaders, testUrl);
  reason = reason || (loader ? "matched url ".concat(testUrl) : '');
  loader = loader || findLoaderByMIMEType(loaders, type);
  reason = reason || (loader ? "matched MIME type ".concat(type) : '');
  loader = loader || findLoaderByInitialBytes(loaders, data);
  reason = reason || (loader ? "matched initial data ".concat(getFirstCharacters(data)) : '');
  loader = loader || findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.fallbackMimeType);
  reason = reason || (loader ? "matched fallback MIME type ".concat(type) : '');

  if (reason) {
    var _loader;

    log.log(1, "selectLoader selected ".concat((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.name, ": ").concat(reason, "."));
  }

  return loader;
}

function validHTTPResponse(data) {
  if (data instanceof Response) {
    if (data.status === 204) {
      return false;
    }
  }

  return true;
}

function getNoValidLoaderMessage(data) {
  const {
    url,
    type
  } = getResourceUrlAndType(data);
  let message = 'No valid loader found (';
  message += url ? "".concat(filename(url), ", ") : 'no url provided, ';
  message += "MIME type: ".concat(type ? "\"".concat(type, "\"") : 'not provided', ", ");
  const firstCharacters = data ? getFirstCharacters(data) : '';
  message += firstCharacters ? " first bytes: \"".concat(firstCharacters, "\"") : 'first bytes: not available';
  message += ')';
  return message;
}

function normalizeLoaders(loaders) {
  for (const loader of loaders) {
    normalizeLoader(loader);
  }
}

function findLoaderByUrl(loaders, url) {
  const match = url && EXT_PATTERN.exec(url);
  const extension = match && match[1];
  return extension ? findLoaderByExtension(loaders, extension) : null;
}

function findLoaderByExtension(loaders, extension) {
  extension = extension.toLowerCase();

  for (const loader of loaders) {
    for (const loaderExtension of loader.extensions) {
      if (loaderExtension.toLowerCase() === extension) {
        return loader;
      }
    }
  }

  return null;
}

function findLoaderByMIMEType(loaders, mimeType) {
  for (const loader of loaders) {
    if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
      return loader;
    }

    if (mimeType === "application/x.".concat(loader.id)) {
      return loader;
    }
  }

  return null;
}

function findLoaderByInitialBytes(loaders, data) {
  if (!data) {
    return null;
  }

  for (const loader of loaders) {
    if (typeof data === 'string') {
      if (testDataAgainstText(data, loader)) {
        return loader;
      }
    } else if (ArrayBuffer.isView(data)) {
      if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
        return loader;
      }
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;

      if (testDataAgainstBinary(data, byteOffset, loader)) {
        return loader;
      }
    }
  }

  return null;
}

function testDataAgainstText(data, loader) {
  if (loader.testText) {
    return loader.testText(data);
  }

  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => data.startsWith(test));
}

function testDataAgainstBinary(data, byteOffset, loader) {
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => testBinary(data, byteOffset, loader, test));
}

function testBinary(data, byteOffset, loader, test) {
  if (test instanceof ArrayBuffer) {
    return compareArrayBuffers(test, data, test.byteLength);
  }

  switch (typeof test) {
    case 'function':
      return test(data, loader);

    case 'string':
      const magic = getMagicString(data, byteOffset, test.length);
      return test === magic;

    default:
      return false;
  }
}

function getFirstCharacters(data, length = 5) {
  if (typeof data === 'string') {
    return data.slice(0, length);
  } else if (ArrayBuffer.isView(data)) {
    return getMagicString(data.buffer, data.byteOffset, length);
  } else if (data instanceof ArrayBuffer) {
    const byteOffset = 0;
    return getMagicString(data, byteOffset, length);
  }

  return '';
}

function getMagicString(arrayBuffer, byteOffset, length) {
  if (arrayBuffer.byteLength < byteOffset + length) {
    return '';
  }

  const dataView = new DataView(arrayBuffer);
  let magic = '';

  for (let i = 0; i < length; i++) {
    magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
  }

  return magic;
}

const DEFAULT_CHUNK_SIZE$2 = 256 * 1024;
function* makeStringIterator(string, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE$2;
  let offset = 0;
  const textEncoder = new TextEncoder();

  while (offset < string.length) {
    const chunkLength = Math.min(string.length - offset, chunkSize);
    const chunk = string.slice(offset, offset + chunkLength);
    offset += chunkLength;
    yield textEncoder.encode(chunk);
  }
}

const DEFAULT_CHUNK_SIZE$1 = 256 * 1024;
function* makeArrayBufferIterator(arrayBuffer, options = {}) {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE$1
  } = options;
  let byteOffset = 0;

  while (byteOffset < arrayBuffer.byteLength) {
    const chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
    const chunk = new ArrayBuffer(chunkByteLength);
    const sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
    const chunkArray = new Uint8Array(chunk);
    chunkArray.set(sourceArray);
    byteOffset += chunkByteLength;
    yield chunk;
  }
}

const DEFAULT_CHUNK_SIZE = 1024 * 1024;
async function* makeBlobIterator(blob, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
  let offset = 0;

  while (offset < blob.size) {
    const end = offset + chunkSize;
    const chunk = await blob.slice(offset, end).arrayBuffer();
    offset = end;
    yield chunk;
  }
}

function makeStreamIterator(stream, options) {
  return isBrowser$2 ? makeBrowserStreamIterator(stream, options) : makeNodeStreamIterator(stream);
}

async function* makeBrowserStreamIterator(stream, options) {
  const reader = stream.getReader();
  let nextBatchPromise;

  try {
    while (true) {
      const currentBatchPromise = nextBatchPromise || reader.read();

      if (options !== null && options !== void 0 && options._streamReadAhead) {
        nextBatchPromise = reader.read();
      }

      const {
        done,
        value
      } = await currentBatchPromise;

      if (done) {
        return;
      }

      yield toArrayBuffer(value);
    }
  } catch (error) {
    reader.releaseLock();
  }
}

async function* makeNodeStreamIterator(stream, options) {
  for await (const chunk of stream) {
    yield toArrayBuffer(chunk);
  }
}

function makeIterator(data, options) {
  if (typeof data === 'string') {
    return makeStringIterator(data, options);
  }

  if (data instanceof ArrayBuffer) {
    return makeArrayBufferIterator(data, options);
  }

  if (isBlob(data)) {
    return makeBlobIterator(data, options);
  }

  if (isReadableStream(data)) {
    return makeStreamIterator(data, options);
  }

  if (isResponse(data)) {
    const response = data;
    return makeStreamIterator(response.body, options);
  }

  throw new Error('makeIterator');
}

const ERR_DATA = 'Cannot convert supplied data type';
function getArrayBufferOrStringFromDataSync(data, loader, options) {
  if (loader.text && typeof data === 'string') {
    return data;
  }

  if (isBuffer(data)) {
    data = data.buffer;
  }

  if (data instanceof ArrayBuffer) {
    const arrayBuffer = data;

    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(arrayBuffer);
    }

    return arrayBuffer;
  }

  if (ArrayBuffer.isView(data)) {
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(data);
    }

    let arrayBuffer = data.buffer;
    const byteLength = data.byteLength || data.length;

    if (data.byteOffset !== 0 || byteLength !== arrayBuffer.byteLength) {
      arrayBuffer = arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
    }

    return arrayBuffer;
  }

  throw new Error(ERR_DATA);
}
async function getArrayBufferOrStringFromData(data, loader, options) {
  const isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);

  if (typeof data === 'string' || isArrayBuffer) {
    return getArrayBufferOrStringFromDataSync(data, loader);
  }

  if (isBlob(data)) {
    data = await makeResponse(data);
  }

  if (isResponse(data)) {
    const response = data;
    await checkResponse(response);
    return loader.binary ? await response.arrayBuffer() : await response.text();
  }

  if (isReadableStream(data)) {
    data = makeIterator(data, options);
  }

  if (isIterable(data) || isAsyncIterable(data)) {
    return concatenateArrayBuffersAsync(data);
  }

  throw new Error(ERR_DATA);
}

function getLoaderContext(context, options, previousContext = null) {
  if (previousContext) {
    return previousContext;
  }

  const resolvedContext = {
    fetch: getFetchFunction(options, context),
    ...context
  };

  if (!Array.isArray(resolvedContext.loaders)) {
    resolvedContext.loaders = null;
  }

  return resolvedContext;
}
function getLoadersFromContext(loaders, context) {
  if (!context && loaders && !Array.isArray(loaders)) {
    return loaders;
  }

  let candidateLoaders;

  if (loaders) {
    candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
  }

  if (context && context.loaders) {
    const contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
    candidateLoaders = candidateLoaders ? [...candidateLoaders, ...contextLoaders] : contextLoaders;
  }

  return candidateLoaders && candidateLoaders.length ? candidateLoaders : null;
}

async function parse(data, loaders, options, context) {
  assert$1(!context || typeof context === 'object');

  if (loaders && !Array.isArray(loaders) && !isLoaderObject(loaders)) {
    context = undefined;
    options = loaders;
    loaders = undefined;
  }

  data = await data;
  options = options || {};
  const {
    url
  } = getResourceUrlAndType(data);
  const typedLoaders = loaders;
  const candidateLoaders = getLoadersFromContext(typedLoaders, context);
  const loader = await selectLoader(data, candidateLoaders, options);

  if (!loader) {
    return null;
  }

  options = normalizeOptions(options, loader, candidateLoaders, url);
  context = getLoaderContext({
    url,
    parse,
    loaders: candidateLoaders
  }, options, context);
  return await parseWithLoader(loader, data, options, context);
}

async function parseWithLoader(loader, data, options, context) {
  validateWorkerVersion(loader);

  if (isResponse(data)) {
    const response = data;
    const {
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    } = response;
    const headers = Object.fromEntries(response.headers.entries());
    context.response = {
      headers,
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    };
  }

  data = await getArrayBufferOrStringFromData(data, loader, options);

  if (loader.parseTextSync && typeof data === 'string') {
    options.dataType = 'text';
    return loader.parseTextSync(data, options, context, loader);
  }

  if (canParseWithWorker(loader, options)) {
    return await parseWithWorker(loader, data, options, context, parse);
  }

  if (loader.parseText && typeof data === 'string') {
    return await loader.parseText(data, options, context, loader);
  }

  if (loader.parse) {
    return await loader.parse(data, options, context, loader);
  }

  assert$1(!loader.parseSync);
  throw new Error("".concat(loader.id, " loader - no parser found and worker is disabled"));
}

async function load(url, loaders, options, context) {
  if (!Array.isArray(loaders) && !isLoaderObject(loaders)) {
    options = loaders;
    loaders = undefined;
  }

  const fetch = getFetchFunction(options);
  let data = url;

  if (typeof url === 'string') {
    data = await fetch(url);
  }

  if (isBlob(url)) {
    data = await fetch(url);
  }

  return await parse(data, loaders, options);
}

let vBuffer = null;
let count = 0;
let isVertices = false;
async function loadObj(filename){
    const obj = await load(filename, OBJLoader);
    const vertices = obj.attributes.POSITION.value;
    vBuffer = initBuffer(gl.ARRAY_BUFFER, vertices);
    {
        isVertices = true;
    }
    count = vertices.length;
    return obj

}

async function loadMtl(filename){
    const file = await loadShader(filename);

   const arr = file.split('\n').filter(line => !line.startsWith('#') && line.length > 0);

   console.log(arr);




   function createMaterials(){
       const materials = [];
       let material = {};
    const keywords = {
        'newmtl': newMtl,
        'Ns': ns,
        'Ka': ka,
        'Kd': kd,
        "Ks": ks,
        'Ke': ke,
        'Ni': ni,
        'd': d,
        'illum': illum,
        'map_Kd': diffuseMap,
        // '': noop

    };
    function newMtl(v){
        material = {};
        material.name = v[0];
        materials.push(material);
        console.log('mat created');

    }
    function ns(v){
        material.ns = v.map(parseFloat)[0];
    }
    function ka(v){
        material.ka = v.map(parseFloat);
    }
    function kd(v){
        material.kd = v.map(parseFloat);

    }
    function ks(v){
        material.ks = v.map(parseFloat);

    }
    function ke(v){
        material.ke = v.map(parseFloat);

    }
    function ni(v){
        material.ni = parseFloat(v[0]);

    }
    function d(v){
        material.d = parseFloat(v[0]);

    }
    function illum(v){
        material.illum = parseInt(v[0]);

    }
    function diffuseMap(v){
        material.diffuseMap = v[0];

    }

for (const line of arr) {
    // console.log('line', line)
    line.split(' ')[0];
    const values = line.split(' ').slice(1);
    // console.log('values', values)
    

    for(const key of Object.keys(keywords)){

        if(line.startsWith(key)){
            keywords[key](values);
        }
    }
}
 return materials
}

   const materials = createMaterials();


   

    return materials

}

let camMatrix,
  pMatrix,
  mMatrix = null;

const mMat = create();
const cam$1 = create();

function setUniforms(pMatrix, camMatrix, mMatrix, pMat, cam, mMat) {
  gl.uniformMatrix4fv(pMatrix, false, pMat);
  gl.uniformMatrix4fv(camMatrix, false, cam);
  gl.uniformMatrix4fv(mMatrix, false, mMat);
}

class Renderer {
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

    setUniforms(pMatrix, camMatrix, mMatrix, pMat, cam$1, mMat);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);


    if(isVertices){
      gl.drawArrays(gl.TRIANGLES, 0, count);
    }
    else {

      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }
  }
}

/** @type {WebGLRenderingContext} */

const canvas$1 = document.querySelector("#canvas");
const gl = canvas$1.getContext("webgl2");

let program = null;
let view = null;
let vertexPos = null;
let pMat,
  cam = null;

const AXIS = {
  X: [1, 0, 0],
  Y: [0, 1, 0],
  Z: [0, 0, 1],
  NO_ROTATE: [0, 0, 0],
};

const renderer = new Renderer();

function initBuffer(type, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, data, gl.STATIC_DRAW);
  // unbind
  gl.bindBuffer(type, null);

  return buffer;
}

function drawScene(gltf) {
  // for (const mesh of gltf.meshes) {


  renderer.render(count);

  // }
}

async function initShaders() {
  const vs = gl.createShader(gl.VERTEX_SHADER);

  const vshader = await loadShader("vs.vert");

  gl.shaderSource(vs, vshader);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);

  const fshader = await loadShader("fs.frag");

  gl.shaderSource(fs, fshader);
  gl.compileShader(fs);

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  return program;
}
function createMatrices() {
  pMat = create();
  view = create();
  cam = create();
}
function setupMatrices(cam, view, pMat) {
  invert(cam, view);
  perspective(
    pMat,
    Math.PI / 4,
    canvas$1.clientWidth / canvas$1.clientHeight,
    0.1,
    10000
  );
  lookAt(cam, [0, 0, 1], [0, 0, 0], [0, 1, 0]);

  return true;
}
async function init() {

  createMatrices();
  setupMatrices(cam, view, pMat);

  program = await initShaders();
  vertexPos = gl.getAttribLocation(program, "vertexPos");

}

async function run(debug = true) {
  await init();

  if (debug) {
    console.log("initialized");
    console.info("shaders initialized");

    if (cam && pMat) {
      console.info("matrices initialized");
    }
  }



}

class Camera {
  rotate(angle, axis) {
    rotate(mMat, mMat, angle, axis);
  }
  set(x, y, z) {
    lookAt(cam$1, [x, y, z], [0, 0, 0], AXIS.Y);
  }
}

//import { loadTexture } from "../src/utils/loadTexture";
const camera = new Camera();
let obj = null;
async function main() {
  // gltf = await loadGltf("models/DamagedHelmet/glTF/DamagedHelmet.gltf");
obj = await loadObj('models/skyline.obj');
const mtl = await loadMtl('models/skyline.mtl');
console.log(obj);
console.log('mtl', mtl);

 // const texture = await loadTexture(
 //   "models/BarramundiFish/BarramundiFish_baseColor.png"
 // );

//  console.log(texture);

  // console.log("gltf", gltf);

  document.querySelector("#debug");


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

    drawScene();
  // }
}

update();
//# sourceMappingURL=gl3d.module.js.map
