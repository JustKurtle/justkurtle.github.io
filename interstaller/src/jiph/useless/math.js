const Wrath = {};

if(Wrath.Mat4 === undefined) {
  Wrath.Vec3 = {
    new() {
      return new Float32Array(3);
    },

    mag(b) { 
      return Math.hypot(...b); 
    },
    unit(b, out) { 
      const m = Math.hypot(...b); 
      out[0] = b[0] / m;
      out[1] = b[1] / m;
      out[2] = b[2] / m;
      return out; 
    },
    norm(b, out) { 
      const m = Math.hypot(...b); 
      out[0] = b[0] / m;
      out[1] = b[1] / m;
      out[2] = b[2] / m;
      return out; 
    },
    dot(a, b) { 
      return b[0] * a[0] + b[1] * a[1] + b[2] * a[2]; 
    },
    cross(a, b, out ) { 
      out[0] = b[1] * a[2] - b[2] * a[1];
      out[1] = b[2] * a[0] - b[0] * a[2];
      out[2] = b[0] * a[1] - b[1] * a[0];
      return out; 
    },
    mMat4(a, b, out) { // multiply
      let x = b[0], y = b[1], z = b[2], w = 1;
      out[0] = a[ 0] * x + a[ 1] * y + a[ 2] * z + a[ 3] * w;
      out[1] = a[ 4] * x + a[ 5] * y + a[ 6] * z + a[ 7] * w;
      out[2] = a[ 8] * x + a[ 9] * y + a[10] * z + a[11] * w;
      return out;
    },
    mScalar(a, b, out) { // multiply
      out[0] = a * b[0];
      out[1] = a * b[1];
      out[2] = a * b[2];
      return out;
    },
    m(a, b, out) { // multiply
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      out[2] = a[2] * b[2];
      return out;
    },
    dScalar(a, b, out) { // divide
      out[0] = a / b[0];
      out[1] = a / b[1];
      out[2] = a / b[2];
      return out;
    },
    d(a, b, out) { // divide
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      out[2] = a[2] / b[2];
      return out;
    },
    aScalar(a, b, out) { // add
      out[0] = a + b[0];
      out[1] = a + b[1];
      out[2] = a + b[2];
      return out;
    },
    a(a, b, out) { // add
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      return out;
    },
    sScalar(a, b, out) { // subtract
      out[0] = a - b[0];
      out[1] = a - b[1];
      out[2] = a - b[2];
      return out;
    },
    s(a, b, out) { // subtract
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      return out;
    },
  };

  Wrath.Quat =  {
    new(x = 0, y = 0, z = 0, w = 1) {
      return new Float32Array([x, y, z, w]);
    },
    unit(b, out) {
      const m = quat[0]*quat[0] + quat[1]*quat[1] + quat[2]*quat[2] + quat[3]*quat[3];
      out[0] = b[0] / m;
      out[1] = b[1] / m;
      out[2] = b[2] / m;
      out[3] = b[3] / m;
      return out;
    },
    m(a, b, out) {
      const x = b[0], y = b[1], z = b[2], w = b[3];
      out[0] = x * a[3] + w * a[0] + y * a[2] - z * a[1];
      out[1] = y * a[3] + w * a[1] + z * a[0] - x * a[2];
      out[2] = z * a[3] + w * a[2] + x * a[1] - y * a[0];
      out[3] = w * a[3] - x * a[0] - y * a[1] - z * a[2];
      return out;
    },
    i(b, out) {
      const x = b[0], y = b[1], z = b[2], w = b[3];
      let dot = x*x + y*y + z*z + w*w;
      let d = dot ? 1 / dot : 0;
      out[0] = -x * d;
      out[1] = -y * d;
      out[2] = -z * d;
      out[3] =  w * d;
      return out;
    },
    rz(rad, b, out) {
      rad *= 0.5;
      const x = b[0], y = b[1], z = b[2], w = b[3];
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      out[0] = x * c + y * s;
      out[1] = y * c - x * s;
      out[2] = z * c + w * s;
      out[3] = w * c - z * s;
      return out; 
    },
    ry(rad, b, out) {
      rad *= 0.5;
      const x = b[0], y = b[1], z = b[2], w = b[3];
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      out[0] = x * c - z * s;
      out[1] = y * c + w * s;
      out[2] = z * c + x * s;
      out[3] = w * c - y * s;
      return out;
    }, 
    rx(rad, b, out) {
      rad *= 0.5;
      const x = b[0], y = b[1], z = b[2], w = b[3];
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      out[0] = x * c + w * s;
      out[1] = y * c + z * s;
      out[2] = z * c - y * s;
      out[3] = w * c - x * s;
      return out;
    },
  };

  Wrath.Mat4 = {
    new() {
      let out = new Float32Array(16);
      out[0] = 1;
      out[5] = 1;
      out[10] = 1;
      out[15] = 1;
      return out;
    },
    set(a, out) {
      out[ 0] = a[ 0];
      out[ 1] = a[ 1];
      out[ 2] = a[ 2];
      out[ 3] = a[ 3];
      out[ 4] = a[ 4];
      out[ 5] = a[ 5];
      out[ 6] = a[ 6];
      out[ 7] = a[ 7];
      out[ 8] = a[ 8];
      out[ 9] = a[ 9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    },

    m(a, b, out) {
      let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      out[ 0] = a[ 0] * b0 + a[ 1] * b1 + a[ 2] * b2 + a[ 3] * b3;
      out[ 1] = a[ 4] * b0 + a[ 5] * b1 + a[ 6] * b2 + a[ 7] * b3;
      out[ 2] = a[ 8] * b0 + a[ 9] * b1 + a[10] * b2 + a[11] * b3;
      out[ 3] = a[12] * b0 + a[13] * b1 + a[14] * b2 + a[15] * b3;
      b0 = b[4], b1 = b[5], b2 = b[6], b3 = b[7];
      out[ 4] = a[ 0] * b0 + a[ 1] * b1 + a[ 2] * b2 + a[ 3] * b3;
      out[ 5] = a[ 4] * b0 + a[ 5] * b1 + a[ 6] * b2 + a[ 7] * b3;
      out[ 6] = a[ 8] * b0 + a[ 9] * b1 + a[10] * b2 + a[11] * b3;
      out[ 7] = a[12] * b0 + a[13] * b1 + a[14] * b2 + a[15] * b3;
      b0 = b[8], b1 = b[9], b2 = b[10], b3 = b[11];
      out[ 8] = a[ 0] * b0 + a[ 1] * b1 + a[ 2] * b2 + a[ 3] * b3;
      out[ 9] = a[ 4] * b0 + a[ 5] * b1 + a[ 6] * b2 + a[ 7] * b3;
      out[10] = a[ 8] * b0 + a[ 9] * b1 + a[10] * b2 + a[11] * b3;
      out[11] = a[12] * b0 + a[13] * b1 + a[14] * b2 + a[15] * b3;
      b0 = b[12], b1 = b[13], b2 = b[14], b3 = b[15];
      out[12] = a[ 0] * b0 + a[ 1] * b1 + a[ 2] * b2 + a[ 3] * b3;
      out[13] = a[ 4] * b0 + a[ 5] * b1 + a[ 6] * b2 + a[ 7] * b3;
      out[14] = a[ 8] * b0 + a[ 9] * b1 + a[10] * b2 + a[11] * b3;
      out[15] = a[12] * b0 + a[13] * b1 + a[14] * b2 + a[15] * b3;
      return out;
    },
    rz(rad, b, out) {
      const c = Math.cos(rad);
      const s = Math.sin(rad);
      let t0 = b[0], t1 = b[1];
      out[0] = c * t0 - s * t1;
      out[1] = s * t0 + c * t1;
          t0 = b[4], t1 = b[5];
      out[4] = c * t0 - s * t1;
      out[5] = s * t0 + c * t1;
      return out;
    },
    ry(rad, b, out) {
      const c = Math.cos(rad);
      const s = Math.sin(rad);
      let t0 = b[0], t1 = b[2];
      out[ 0] = c * t0 - s * t1;
      out[ 2] = s * t0 + c * t1;
          t0 = b[8], t1 = b[10];
      out[ 8] = c * t0 - s * t1;
      out[10] = s * t0 + c * t1;
      return out;
    },
    rx(rad, b, out) {
      const c = Math.cos(rad);
      const s = Math.sin(rad);
      let t0 = b[5], t1 = b[6];
      out[ 5] = c * t0 - s * t1;
      out[ 6] = s * t0 + c * t1;
          t0 = b[9], t1 = b[10];
      out[ 9] = c * t0 - s * t1;
      out[10] = s * t0 + c * t1;
      return out;
    },
    t(vec, out) {
      out[ 3] = vec[0];
      out[ 7] = vec[1];
      out[11] = vec[2];
      return out;
    },
    s(vec, out) {
      out[ 0] = vec[0];
      out[ 5] = vec[1];
      out[10] = vec[2];
      return out;
    },
    tp(b, out) { // transpose
      let t0 = b[1], t1 = b[2], t2 = b[3], t3 = b[6], t4 = b[7], t5 = b[11];
      out[ 1] = b[ 4]
      out[ 2] = b[ 8]
      out[ 3] = b[12]
      out[ 6] = b[ 9]
      out[ 7] = b[14]
      out[11] = b[13]

      out[ 4] = t0
      out[ 8] = t1
      out[12] = t2
      out[ 9] = t3
      out[14] = t4
      out[13] = t5
      return out;
    },

    lookAt(eye, target, up = new Vec3(0,1,0), out) {
      let f0, f1, f2;
      let r0, r1, r2;

      f0 = eye[0] - target[0];
      f1 = eye[1] - target[1];
      f2 = eye[2] - target[2];
      let m = Math.hypot(f0,f1,f2);
      out[ 2] = f0 / m;
      out[ 6] = f1 / m;
      out[10] = f2 / m;

      r0 = up[1] * f2 - up[2] * f1;
      r1 = up[2] * f0 - up[0] * f2;
      r2 = up[0] * f1 - up[1] * f0;
      m = Math.hypot(r0,r1,r2);
      out[0] = r0 / m;
      out[4] = r1 / m;
      out[8] = r2 / m;

      out[1] = f1 * r2 - f2 * r1;
      out[5] = f2 * r0 - f0 * r2;
      out[9] = f0 * r1 - f1 * r0;

      out[3] = eye[0];
      out[7] = eye[1];
      out[11] = eye[2];
      return out;
    },
    lookTo(eye, dir, up = new Vec3(0,1,0), out) {
      let r0, r1, r2;
      
      r0 = up[1] * f2 - up[2] * f1;
      r1 = up[2] * f0 - up[0] * f2;
      r2 = up[0] * f1 - up[1] * f0;
      let m = Math.hypot(r0,r1,r2);
      out[0] = r0 / m;
      out[4] = r1 / m;
      out[8] = r2 / m;

      m = Math.hypot(...dir);
      out[2] = dir[0] / -m;
      out[6] = dir[1] / -m;
      out[10] = dir[2] / -m;

      out[1] = f[1] * r[2] - f[2] * r[1];
      out[5] = f[2] * r[0] - f[0] * r[2];
      out[9] = f[0] * r[1] - f[1] * r[0];
      
      out[3] = eye[0];
      out[7] = eye[1];
      out[11] = eye[2];
      return out;
    },
    perspective(near, far, fov, aspect, out) {
      const tanFOV = Math.tan(fov / 2);
      out[ 0] = 1 / tanFOV;
      out[ 5] = aspect / tanFOV;
      out[10] = -far / (far - near);
      out[11] = -far * near / (far - near);
      out[14] = -1;
      return out;
    },
  };
}

Object.freeze(Wrath.Mat4);
Object.freeze(Wrath.Quat4);
Object.freeze(Wrath.Vec3);

export {
  Wrath
}