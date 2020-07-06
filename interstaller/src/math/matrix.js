self.Mat4 = class Mat4 extends Float32Array {
  constructor(data = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) {
    super(data);
  }

  s(that = new Mat4(), out = this) {
    for(let i in that) {
      out[i] = that[i];
    }
    return out;
  }

  m(that = new Mat4(), out = this) {
    let temp = [];
    for(let i in that) {
      i *= 1;

      if(i%4 === 0) {
        temp = [
          out[i],
          out[i+1],
          out[i+2],
          out[i+3]
        ];
      }

      out[i] =
        that[i%4] * temp[0] +
        that[i%4+4] * temp[1] +
        that[i%4+8] * temp[2] +
        that[i%4+12] * temp[3];
    }
    return out;
  }

  perspective(near = 1, far = 1000, fovy = 70/180*PI, aspect = innerWidth / innerHeight, out = this) {
    const f = 1.0 / tan(fovy / 2);
    const a = f / aspect;
    const b = (far + near) / (far - near);
    const c = 2 * far * near / (far - near);

    out.s([
     -a, 0, 0, 0,
      0,-f, 0, 0,
      0, 0,-b,-1,
      0, 0,-c, 0
    ]);
    return out;
  }

  r(angles = [0,0,0], out = this) {
    if(angles[0] !== 0) {
      const c = Math.cos(angles[0]);
      const s = Math.sin(angles[0]);

      out.m([
          1, 0, 0, 0,
          0, c, s, 0,
          0,-s, c, 0,
          0, 0, 0, 1
      ]);
    }
    if(angles[1] !== 0) {
      const c = Math.cos(angles[1]);
      const s = Math.sin(angles[1]);
      out.m([
        c, 0, s, 0,
        0, 1, 0, 0,
       -s, 0, c, 0,
        0, 0, 0, 1
      ]);
    }
    if(angles[2] !== 0) {
      const c = Math.cos(angles[2]);
      const s = Math.sin(angles[2]);
      out.m([
          c, s, 0, 0,
         -s, c, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
      ]);
    }
      return out;
  }

  t(v = [0, 0, 0], out = this) {
    out[12] += v[0];
    out[13] += v[1];
    out[14] += v[2];

    return out;
  }

}
