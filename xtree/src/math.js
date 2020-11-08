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

  get mag() { return Math.hypot(...this); }
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

// 100% needed, don't look too hard
function check(sMin, sMax, oMin, oMax) {
  const O1 = sMin <= oMax && sMin >= oMin,
        O2 = oMin <= sMax && oMin >= sMin;
  if(O1 || O2) {
    const min1 = oMax - sMin,
          min2 = oMin - sMax;
    return (min1 * min1 <= min2 * min2) ? min1 : min2;
  }
  return null;
}

self.AABB = class AABB {
  constructor(x, y, w, h, xOff = 0, yOff = 0) {
    this.srcPos = new Vec3(x, y);
    this.xOff = xOff;
    this.yOff = yOff;
    this.w = w;
    this.h = h;
  }

  get x() { return this.srcPos.x + this.xOff; }
  get y() { return this.srcPos.y + this.yOff; }
  get xm() { return this.srcPos.x + this.w; }
  get ym() { return this.srcPos.y + this.h; }

  intersect(that) {
    const x = check(this.x, this.xm, that.x, that.xm);
    const y = check(this.y, this.ym, that.y, that.ym);

    switch(Math.min(x * x, y * y)) {
      case x * x:
        return new Vec3(x, 0);
      case y * y:
        return new Vec3(0, y);
      default:
        return new Vec3();
    }
  }
  intersects(that) {
    const x = check(this.x, this.xm, that.x, that.xm);
    const y = check(this.y, this.ym, that.y, that.ym);
    return (x !== null && y !== null);
  }
  contains(that) {
    const x = check(this.x, this.xm - that.w, that.x, that.x);
    const y = check(this.y, this.ym - that.h, that.y, that.y);
    return (x && y) !== null;
  }
};