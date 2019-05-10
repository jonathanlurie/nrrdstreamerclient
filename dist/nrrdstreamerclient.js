(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.nrrdstreamerclient = factory());
}(this, (function () { 'use strict';

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  var degree = Math.PI / 180;

  /**
   * 3x3 Matrix
   * @module mat3
   */

  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */

  function create$2() {
    var out = new ARRAY_TYPE(9);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }

    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }

  /**
   * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
   * @module mat4
   */

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */

  function create$3() {
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
   * Create a new mat4 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m03 Component in column 0, row 3 position (index 3)
   * @param {Number} m10 Component in column 1, row 0 position (index 4)
   * @param {Number} m11 Component in column 1, row 1 position (index 5)
   * @param {Number} m12 Component in column 1, row 2 position (index 6)
   * @param {Number} m13 Component in column 1, row 3 position (index 7)
   * @param {Number} m20 Component in column 2, row 0 position (index 8)
   * @param {Number} m21 Component in column 2, row 1 position (index 9)
   * @param {Number} m22 Component in column 2, row 2 position (index 10)
   * @param {Number} m23 Component in column 2, row 3 position (index 11)
   * @param {Number} m30 Component in column 3, row 0 position (index 12)
   * @param {Number} m31 Component in column 3, row 1 position (index 13)
   * @param {Number} m32 Component in column 3, row 2 position (index 14)
   * @param {Number} m33 Component in column 3, row 3 position (index 15)
   * @returns {mat4} A new mat4
   */

  function fromValues$3(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */

  function invert$3(out, a) {
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
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create$4() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Calculates the length of a vec3
   *
   * @param {vec3} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */

  function fromValues$4(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to normalize
   * @returns {vec3} out
   */

  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function cross(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec3} out
   */

  function transformMat4(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  /**
   * Alias for {@link vec3.length}
   * @function
   */

  var len = length;
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach = function () {
    var vec = create$4();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  }();

  /**
   * 4 Dimensional Vector
   * @module vec4
   */

  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */

  function create$5() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }

    return out;
  }
  /**
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to normalize
   * @returns {vec4} out
   */

  function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len = x * x + y * y + z * z + w * w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }

    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  /**
   * Perform some operation over an array of vec4s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$1 = function () {
    var vec = create$5();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 4;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }

      return a;
    };
  }();

  /**
   * Quaternion
   * @module quat
   */

  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */

  function create$6() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    out[3] = 1;
    return out;
  }
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out the receiving quaternion
   * @param {vec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @returns {quat} out
   **/

  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    var omega, cosom, sinom, scale0, scale1; // calc cosine

    cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    } // calculate coefficients


    if (1.0 - cosom > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    } // calculate final values


    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   * @param {quat} out the receiving quaternion
   * @param {mat3} m rotation matrix
   * @returns {quat} out
   * @function
   */

  function fromMat3(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w

      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)

      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      // |w| <= 1/2
      var i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }

    return out;
  }
  /**
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quaternion to normalize
   * @returns {quat} out
   * @function
   */

  var normalize$2 = normalize$1;
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {vec3} a the initial vector
   * @param {vec3} b the destination vector
   * @returns {quat} out
   */

  var rotationTo = function () {
    var tmpvec3 = create$4();
    var xUnitVec3 = fromValues$4(1, 0, 0);
    var yUnitVec3 = fromValues$4(0, 1, 0);
    return function (out, a, b) {
      var dot$$1 = dot(a, b);

      if (dot$$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$$1;
        return normalize$2(out, out);
      }
    };
  }();
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {quat} c the third operand
   * @param {quat} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  var sqlerp = function () {
    var temp1 = create$6();
    var temp2 = create$6();
    return function (out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  }();
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {vec3} view  the vector representing the viewing direction
   * @param {vec3} right the vector representing the local "right" direction
   * @param {vec3} up    the vector representing the local "up" direction
   * @returns {quat} out
   */

  var setAxes = function () {
    var matr = create$2();
    return function (out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize$2(out, fromMat3(out, matr));
    };
  }();

  /**
   * 2 Dimensional Vector
   * @module vec2
   */

  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */

  function create$8() {
    var out = new ARRAY_TYPE(2);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }

    return out;
  }
  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$2 = function () {
    var vec = create$8();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 2;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }

      return a;
    };
  }();

  const NRRD_TYPES_TO_TYPEDARRAY = {
    "signed char": Int8Array,
    "int8": Int8Array,
    "int8_t": Int8Array,
    "uchar": Uint8Array,
    "unsigned char": Uint8Array,
    "uint8": Uint8Array,
    "uint8_t": Uint8Array,
    "short": Int16Array,
    "short int": Int16Array,
    "signed short": Int16Array,
    "signed short int": Int16Array,
    "int16": Int16Array,
    "int16_t": Int16Array,
    "ushort": Uint16Array,
    "unsigned short": Uint16Array,
    "unsigned short int": Uint16Array,
    "uint16": Uint16Array,
    "uint16_t": Uint16Array,
    "int": Int32Array,
    "signed int": Int32Array,
    "int32": Int32Array,
    "int32_t": Int32Array,
    "uint": Uint32Array,
    "unsigned int": Uint32Array,
    "uint32": Uint32Array,
    "uint32_t": Uint32Array,
    "longlong": BigInt64Array,           // OK for Node/V8/Chrome but not Firefox
    "long long": BigInt64Array,
    "long long int": BigInt64Array,
    "signed long long": BigInt64Array,
    "signed long long int": BigInt64Array,
    "int64": BigInt64Array,
    "int64_t": BigInt64Array,
    "ulonglong": BigUint64Array,
    "unsigned long long": BigUint64Array,
    "unsigned long long int": BigUint64Array,
    "uint64": BigUint64Array,
    "uint64_t": BigUint64Array,
    "float": Float32Array,
    "double": Float64Array
  };

  const NRRD_HEADER_BYTE_SIZE_MAX = 600;
  const NEW_LINE_CHAR = '\n';

  /**
   * This is to stream **NRRD** files from client side in Javascript, aka. picking
   * a values given some [x, y, z] coordinates without having to fetch/download the
   * entire file.
   * Note that the [x, y, z] coordinates are natively in world space coordinates.
   *
   *  example:
   * ```javascript
   *  let filepath = 'http://127.0.0.1:8080/annotation_25_uncomp.nrrd'
   *  let ns = new nrrdstreamerclient(filepath)
   *
   *  ns.getNrrdHeader(function(nrrdHeader){
   *     ns.streamNrrdValue([2000, 4000, 4000],
   *     function(payload){
   *       console.log(payload)
   *       // The payload object is of form:
   *       // {
   *       //    error: null,
   *       //    position: [2000, 4000, 4000],
   *       //    value: 400
   *       // }
   *     })
   *  })
   * ```
   *
   * As the header of the NRRD file must be fetched before streaming any actual value,
   * the method is automatically called if necessary, so that the previous block of code
   * could be:
   * ```javascript
   *  let filepath = 'http://127.0.0.1:8080/annotation_25_uncomp.nrrd'
   *  let ns = new nrrdstreamerclient(filepath)
   *
   *  ns.streamNrrdValue([2000, 4000, 4000],
   *  function(payload){
   *    console.log(payload)
   *    // The payload object is of form:
   *    // {
   *    //    error: null,
   *    //    position: [2000, 4000, 4000],
   *    //    value: 400
   *    // }
   *  })
   * ```
   *
   * **IMPORTANT**: The NRRD file to be streamed must be uncompressed (`encoding: raw`)
   *
   * **TODO**
   * - Add convenience method to bet volume boundaries in world space and voxel space
   * - make it compatible with multiband volume (ie. quaternion or vector NRRD) or time series (ie. fMRI)
   *
   *
   */
  class NrrdStreamer {

    /**
     * @constructor
     */
    constructor(url, httpHeaders = {}){
      this._url = url;
      this._httpHeaders = httpHeaders;
      this._nrrdHeader = null;
      this._dataByteOffset = null;
      this._nrrdVersion = null;
    }


    /**
     * Set the HTTP header for future GET requests
     * @param {Object} httpHeaders - OPTIONAL the entries for HTTP headers
     */
    setHttpHeader(httpHeaders){
      this._httpHeaders = httpHeaders;
    }


    /**
     * Fetch the header of the NRRD file and parses it. As this methods is asynchronous,
     * The NRRD header object is not returned but passed as the argument of the callback function
     * @param {Function} cb - callback function called when the header is parsed
     */
    getNrrdHeader(cb){
      let that = this;
      // make a copy of the header
      let getHeaders = JSON.parse(JSON.stringify(this._httpHeaders));
      getHeaders['range'] = `bytes=0-${NRRD_HEADER_BYTE_SIZE_MAX}`;

      fetch(this._url,{
        headers: getHeaders
      })
      .then(function(response) {
        return response.text()
      })
      .then(function(headerText) {
        that._findDataOffset(headerText);
        that._parseNrrdHeader(headerText, cb);
      });
    }


    /**
     * @private
     * Look at the raw text buffer from the NRRD header and verify at what byte
     * offset the actual data starts.
     * @param {string} nrrdTextHeader - the text buffer that contains the header but that is most likely a bit larger
     */
    _findDataOffset(nrrdTextHeader){
      for(let i=1; i<nrrdTextHeader.length; i++){
        if(nrrdTextHeader[i] === NEW_LINE_CHAR && nrrdTextHeader[i-1] === NEW_LINE_CHAR){
          this._dataByteOffset = i + 1;
          break
        }
      }
    }


    /**
     * @private
     * @param {string} nrrdTextHeader - the text buffer that contains the header but that is most likely a bit larger
     * @param {Function} cb - callback function called to be called when the header is parsed
     */
    _parseNrrdHeader(nrrdTextHeader, cb){
      let trimmedHeader = nrrdTextHeader.slice(0, this._dataByteOffset).trim();

      let lines = trimmedHeader.split(NEW_LINE_CHAR);
      let magicNumber = lines[0].trim();

      let preMap = lines.slice(1)
      .filter( s => { // removing empty lines
        return s.length > 0
      })
      .filter( s => { // removing comments
        return (s[0] !== '#')
      })
      .map( s => {
        let keyVal = s.split(':');
        return {
          key: keyVal[0].trim(),
          val: keyVal[1].trim()
        }
      });

      let nrrdHeader = {};
      preMap.forEach( field => {
        nrrdHeader[field.key] = field.val;
      });


      // parsing each fields of the header
      if(nrrdHeader['sizes']){
        nrrdHeader['sizes'] = nrrdHeader.sizes.split(' ').map( n => parseInt(n));
      }

      if(nrrdHeader['space directions']){
        nrrdHeader['space directions'] = nrrdHeader['space directions'].split(' ')
            .map(triple => {
              return triple.slice(1, triple.length-1).split(',').map(n => parseFloat(n))
            });
      }

      if(nrrdHeader['dimension']){
        nrrdHeader['dimension'] = parseInt(nrrdHeader['dimension']);
      }

      if(nrrdHeader['space origin']){
        nrrdHeader['space origin'] = nrrdHeader['space origin']
            .slice(1, nrrdHeader['space origin'].length-1)
            .split(',')
            .map(n => parseFloat(n));
      }

      if(nrrdHeader['kinds']){
        nrrdHeader['kinds'] = nrrdHeader['kinds'].split(' ');
      }

      if(nrrdHeader['space dimension']){
        nrrdHeader['space dimension'] = parseInt(nrrdHeader['space dimension']);
      }

      this._nrrdHeader = nrrdHeader;
      cb(nrrdHeader);
    }


    /**
     * Get the value from the volume at a specific position
     * @param {Array} position - array as [x, y, z] in worls space coordinates
     * @param {Function} cb - callback function called when the streaming is done
     */
    streamNrrdValue(position, cb){
      let that = this;
      if(this._nrrdHeader){
        this._streamValue(position, cb);
      } else {
        this.getNrrdHeader(function(nrrdHeader){
          that._streamValue(position, cb);
        });
      }
    }


    /**
     * @private
     * Private equivalent of streamNrrdValue, but assumes the NRRD header is already parsed.
     * @param {Array} position - array as [x, y, z] in worls space coordinates
     * @param {Function} cb - callback function called when the streaming is done
     */
    _streamValue(position, cb){
      let resultPayload = {
        error: null,
        position: position,
        value: null
      };

      if(this._nrrdHeader.encoding !== 'raw'){
        resultPayload.error = new Error(`To stream content, the encoding of the NRRD file must be 'raw' (aka. uncompressed). Found: '${this._nrrdHeader.encoding}'`);
        return cb(resultPayload)
      }

      let xsize = this._nrrdHeader['sizes'][0];
      let ysize = this._nrrdHeader['sizes'][1];
      let zsize = this._nrrdHeader['sizes'][2];

      let dataType = NRRD_TYPES_TO_TYPEDARRAY[this._nrrdHeader.type];
      let byteSizePerVoxel = dataType.BYTES_PER_ELEMENT;

      let voxPos = this._getPositionWorldToVoxel(position);
      let voxelIndexFlat = xsize * ysize * voxPos[2] + xsize * voxPos[1] + voxPos[0];
      let byteIndexFlat = voxelIndexFlat * byteSizePerVoxel + this._dataByteOffset;



      if(voxPos[0]<0 || voxPos[0]>this._nrrdHeader.sizes[0] ||
         voxPos[1]<0 || voxPos[1]>this._nrrdHeader.sizes[1] ||
         voxPos[2]<0 || voxPos[2]>this._nrrdHeader.sizes[2])
      {
        resultPayload.error = new Error(`The position is outside the volume.`);
        return cb(resultPayload)
      }

      let getHeaders = JSON.parse(JSON.stringify(this._httpHeaders));
      getHeaders['range'] = `bytes=${byteIndexFlat}-${byteIndexFlat + byteSizePerVoxel - 1}`;

      fetch(this._url,{
        headers: getHeaders
      })
      .then(function(response) {
        return response.blob()
      })
      .then(function(responseBlob) {
        let fileReader = new FileReader();
        fileReader.onload  = function(event) {
          let arrayBuffer = event.target.result;
          resultPayload.value = new dataType(arrayBuffer)[0];
          cb(resultPayload);
        };
        fileReader.readAsArrayBuffer(responseBlob);
      });
    }


    /**
     * @private
     * Converts world space coordinates to voxel space so that we can query the volume
     * using its buffer representation.
     * @param {Array} worldCoordinates - position as [x, y, z]
     * @reuturn {Array} as [x, y, z] in voxel space. Those are rounded.
     */
    _getPositionWorldToVoxel(worldCoordinates){
      let of = this._nrrdHeader['space origin']; // offset
      let sc = this._nrrdHeader['space directions']; // scale
      let v2w = fromValues$3(sc[0][0], sc[0][1], sc[0][2], 0,
                                         sc[1][0], sc[1][1], sc[1][2], 0,
                                         sc[2][0], sc[2][1], sc[2][2], 0,
                                         of[0], of[1], of[2], 1);
      let w2v = create$3();
      invert$3(w2v, v2w);
      let worldPos = fromValues$4(worldCoordinates[0], worldCoordinates[1], worldCoordinates[2]);
      let voxelPos = create$4();
      transformMat4(voxelPos, worldPos, w2v);
      return voxelPos.map(n => Math.round(n))
    }

  }

  return NrrdStreamer;

})));
//# sourceMappingURL=nrrdstreamerclient.js.map
