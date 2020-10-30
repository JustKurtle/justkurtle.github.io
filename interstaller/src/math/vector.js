self.Vec3 = class Vec3 extends Float32Array{
  constructor(x = 0, y = 0, z = 0) {
    super([x, y, z]);
  }

  get x() { return this[0]; }
  set x(_v) { this[0] = _v; }
  get y() { return this[1]; }
  set y(_v) { this[1] = _v; }
  get z() { return this[2]; }
  set z(_v) { this[2] = _v; }

  get mag() { return Math.hypot(this[0], this[1], this[2]); }
  get unit() { return new Vec3(this[0] / this.mag, this[1] / this.mag, this[2] / this.mag); }
  dot(that) { return (this[0] * that[0] + this[1] * that[1] + this[2] * that[2]); }
  cross(that) { return new Vec3(this[1] * that[2] - this[2] * that[1], this[2] * that[0] - this[0] * that[2], this[0] * that[1] - this[1] * that[0]); }

  m(that) {
    const out = new Vec3(this);
    switch(that.constructor.name) {
      case "Number":
        for(let i in this) out[i] = this[i] * that;
        break;
      default:
        for(let i in this) out[i] = this[i] * that[i];
    }
    return out;
  }
  d(that) {
    const out = new Vec3(this);
    switch(that.constructor.name) {
      case "Number":
        for(let i in this) out[i] = this[i] / that;
        break;
      default:
        for(let i in this) out[i] = this[i] / that[i];
    }
    return out;
  }
  a(that) {
    const out = new Vec3(this);
    switch(that.constructor.name) {
      case "Number":
        for(let i in this) out[i] = this[i] + that;
        break;
      default:
        for(let i in this) out[i] = this[i] + that[i];
    }
    return out;
  }
  s(that) {
    const out = new Vec3(this);
    switch(that.constructor.name) {
      case "Number":
        for(let i in this) out[i] = this[i] - that;
        break;
      default:
        for(let i in this) out[i] = this[i] - that[i];
    }
    return out;
  }
}
