const typeOf = v => v.constructor.name; 

if(Math.Mat4f === undefined) {
  self.Vec3f = class Vec3f extends Float32Array {
    constructor(x = 0, y = 0, z = 0) {
      super([x, y, z]);
    }

    get x() { return this[0]; }
    set x(_v) { this[0] = _v; }
    get y() { return this[1]; }
    set y(_v) { this[1] = _v; }
    get z() { return this[2]; }
    set z(_v) { this[2] = _v; }

    get mag() { return Math.hypot(...this); }
    get unit() { const m = Math.hypot(...this); return new Vec3f(this[0] / m, this[1] / m, this[2] / m); }
    get norm() { const m = Math.hypot(...this); this[0] /= m; this[1] /= m; this[2] /= m; return this; }
    dot(that) { return this[0] * that[0] + this[1] * that[1] + this[2] * that[2]; }
    cross(that) { return new Vec3f(this[1] * that[2] - this[2] * that[1], this[2] * that[0] - this[0] * that[2], this[0] * that[1] - this[1] * that[0]); }
    m(that, out = this) {
      switch(typeOf(that)) {
        case "Mat4f":
          for(let i in this)
            out[i] =
              that[i%4] * this[0] +
              that[i%4+4] * this[1] +
              that[i%4+8] * this[2] +
              that[i%4+12] * 1;
          break;
        case "Number":
          for(let i in this) out[i] = this[i] * that;
          break;
        default:
          for(let i in that) out[i] = this[i] * that[i];
      }
      return out;
    }
    d(that, out = this) {
      switch(typeOf(that)) {
        case "Number":
          for(let i in this) out[i] = this[i] / that;
          break;
        default:
          for(let i in that) out[i] = this[i] / that[i];
      }
      return out;
    }
    a(that, out = this) {
      switch(typeOf(that)) {
        case "Number":
          for(let i in this) out[i] = this[i] + that;
          break;
        default:
          for(let i in that) out[i] = this[i] + that[i];
      }
      return out;
    }
    s(that, out = this) {
      switch(typeOf(that)) {
        case "Number":
          for(let i in this) out[i] = this[i] - that;
          break;
        default:
          for(let i in that) out[i] = this[i] - that[i];
      }
      return out;
    }
  };

  self.Quat = class Quat extends Float32Array {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      super([x, y, z, w]);
    }

    get x() { return this[0]; }
    set x(_v) { this[0] = _v; }
    get y() { return this[1]; }
    set y(_v) { this[1] = _v; }
    get z() { return this[2]; }
    set z(_v) { this[2] = _v; }
    get w() { return this[3]; }
    set w(_v) { this[3] = _v; }

    get unit() {
      const m = this[0]*this[0] + this[1]*this[1] + this[2]*this[2] + this[3]*this[3];
      return new Quat(this[0] / m, this[1] / m, this[2] / m, this[3] / m);
    } 

    m(that, out = this) {
      const [x, y, z, w] = this;
      out[0] = x * that[3] + w * that[0] + y * that[2] - z * that[1];
      out[1] = y * that[3] + w * that[1] + z * that[0] - x * that[2];
      out[2] = z * that[3] + w * that[2] + x * that[1] - y * that[0];
      out[3] = w * that[3] - x * that[0] - y * that[1] - z * that[2];
      return out;
    }
    i(out = this) {
      const [x, y, z, w] = this;
      let dot = x*x + y*y + z*z + w*w;
      let d = dot ? 1 / dot : 0;
      out[0] = -x * d;
      out[1] = -y * d;
      out[2] = -z * d;
      out[3] =  w * d;
      return out;
    }
    rz(rad, out = this) {
      rad *= 0.5;
      const [x, y, z, w] = this;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      out[0] = x * c + y * s;
      out[1] = y * c - x * s;
      out[2] = z * c + w * s;
      out[3] = w * c - z * s;
      return out; 
    }
    ry(rad, out = this) {
      rad *= 0.5;
      const [x, y, z, w] = this;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      out[0] = x * c - z * s;
      out[1] = y * c + w * s;
      out[2] = z * c + x * s;
      out[3] = w * c - y * s;
      return out;
    }  
    rx(rad, out = this) {
      rad *= 0.5;
      const [x, y, z, w] = this;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      out[0] = x * c + w * s;
      out[1] = y * c + z * s;
      out[2] = z * c - y * s;
      out[3] = w * c - x * s;
      return out;
    }
  };

  self.Mat4f = class Mat4f extends Float32Array {
    constructor(data = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) {
      super(data);
    }

    m(that, out = this) {
      let temp = [];
      for(let i in this) {
        const j = +i % 4;
        if(j === 0) temp = [this[i], this[+i+1], this[+i+2], this[+i+3]];
        out[i] =
          that[j] * temp[0] +
          that[j+4] * temp[1] +
          that[j+8] * temp[2] +
          that[j+12] * temp[3];
      }
      return out;
    }
    r(rad, out = this) {
      if(rad[2]) {
        const c = Math.cos(rad[2]);
        const s = Math.sin(rad[2]);
        out.m([
          c,-s, 0, 0,
          s, c, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]);
      }
      if(rad[1]) {
        const c = Math.cos(rad[1]), s = Math.sin(rad[1]);
        out.m([
          c, 0,-s, 0,
          0, 1, 0, 0,
          s, 0, c, 0,
          0, 0, 0, 1
        ]);
      }
      if(rad[0]) {
        const c = Math.cos(rad[0]);
        const s = Math.sin(rad[0]);
        out.m([
          1, 0, 0, 0,
          0, c,-s, 0,
          0, s, c, 0,
          0, 0, 0, 1
        ]);
      }
      return out;
    }
    t(vec, out = this) {
      out.set(this);
      out[ 3] = vec[0];
      out[ 7] = vec[1] || 0;
      out[11] = vec[2] || 0;
      return out;
    }
    s(vec, out = this) {
      out.set(this);
      out[ 0] = vec[0];
      out[ 5] = vec[1] || 1;
      out[10] = vec[2] || 1;
      return out;
    }
    i(out = this) {
      let c = new Mat4f(this);
      let _00 = c[ 0] * c[ 5] - c[ 1] * c[ 4],
        _01 = c[ 0] * c[ 6] - c[ 2] * c[ 4],
        _02 = c[ 0] * c[ 7] - c[ 3] * c[ 4],
        _03 = c[ 1] * c[ 6] - c[ 2] * c[ 5];
      let _04 = c[ 1] * c[ 7] - c[ 3] * c[ 5],
        _05 = c[ 2] * c[ 7] - c[ 3] * c[ 6],
        _06 = c[ 8] * c[13] - c[ 9] * c[12],
        _07 = c[ 8] * c[14] - c[10] * c[12];
      let _08 = c[ 8] * c[15] - c[11] * c[12],
        _09 = c[ 9] * c[14] - c[10] * c[13],
        _10 = c[ 9] * c[15] - c[11] * c[13],
        _11 = c[10] * c[15] - c[11] * c[14];
        
      let det = _00 * _11 - _01 * _10 + _02 * _09 + _03 * _08 - _04 * _07 + _05 * _06;
      if (!det) return null;
      det = 1 / det;

      out[ 0] = (c[ 5] * _11 - c[ 6] * _10 + c[ 7] * _09) * det;
      out[ 1] = (c[ 2] * _10 - c[ 1] * _11 - c[ 3] * _09) * det;
      out[ 2] = (c[13] * _05 - c[14] * _04 + c[15] * _03) * det;
      out[ 3] = (c[10] * _04 - c[ 9] * _05 - c[11] * _03) * det;
      out[ 4] = (c[ 6] * _08 - c[ 4] * _11 - c[ 7] * _07) * det;
      out[ 5] = (c[ 0] * _11 - c[ 2] * _08 + c[ 3] * _07) * det;
      out[ 6] = (c[14] * _02 - c[12] * _05 - c[15] * _01) * det;
      out[ 7] = (c[ 8] * _05 - c[10] * _02 + c[11] * _01) * det;
      out[ 8] = (c[ 4] * _10 - c[ 5] * _08 + c[ 7] * _06) * det;
      out[ 9] = (c[ 1] * _08 - c[ 0] * _10 - c[ 3] * _06) * det;
      out[10] = (c[12] * _04 - c[13] * _02 + c[15] * _00) * det;
      out[11] = (c[ 9] * _02 - c[ 8] * _04 - c[11] * _00) * det;
      out[12] = (c[ 5] * _07 - c[ 4] * _09 - c[ 6] * _06) * det;
      out[13] = (c[ 0] * _09 - c[ 1] * _07 + c[ 2] * _06) * det;
      out[14] = (c[13] * _01 - c[12] * _03 - c[14] * _00) * det;
      out[15] = (c[ 8] * _03 - c[ 9] * _01 + c[10] * _00) * det;
      return out;
    }
    tp(out = this) {
      let temp = [];
      for(let i in this) {
        temp[i] = this[Math.floor(i / 4)]
      }
      return out;
    }

    lookAt(eye, target, up = new Vec3f(0,1,0), out = this) {
      const f = target.s(eye).unit;
      const r = up.cross(f).unit;
      const u = f.cross(r);
      out.set([
        r.x,u.x,f.x,eye.x,
        r.y,u.y,f.y,eye.y,
        r.z,u.z,f.z,eye.z,
          0,  0,  0,  1,
      ]);
      return out;
    }
    lookTo(eye, dir, up = new Vec3f(0,1,0), out = this) {
      const f = dir.unit.m(-1);
      const r = up.cross(f).unit;
      const u = f.cross(r);
      out.set([
        r.x,u.x,f.x,eye.x,
        r.y,u.y,f.y,eye.y,
        r.z,u.z,f.z,eye.z,
          0,  0,  0,  1,
      ]);
      return out;
    }
    perspective(near, far, fov, aspect, out = this) {
      const x = 1 / Math.tan(fov / 2 * Math.PI / 180);
      const y = aspect / Math.tan(fov / 2 * Math.PI / 180);
      const z = -far / (far - near);
      const w = -far * near / (far - near);
      out.set([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, w,
        0, 0,-1, 0
      ]);
      return out;
    }
  };
}
