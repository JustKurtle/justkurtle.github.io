function check(sMin, sMax, oMin, oMax) {
  const O1 = sMin <= oMax && sMin >= oMin,
        O2 = oMin <= sMax && oMin >= sMin;
  if(O1 || O2) {
    const min1 = oMax - sMin,
          min2 = oMin - sMax;
    return (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
  }
  return null;
}

self.AABB = class AABB {
  constructor(pos, w, h, xOff = 0, yOff = 0) {
    this.pos = pos;
    this.offset = new Vec3f(xOff, yOff);

    this.w = w;
    this.h = h;
  }

  get x() { return this.pos.x + this.offset.x; }
  get y() { return this.pos.y + this.offset.y; }
  get xm() { return this.x + this.w; }
  get ym() { return this.y + this.h; }

  intersect(that) {
    const x = check(this.x, this.xm, that.x, that.xm);
    const y = check(this.y, this.ym, that.y, that.ym);

    switch(Math.min(x * x, y * y)) {
      case x * x:
        return new Vec3f(x, 0);
      case y * y:
        return new Vec3f(0, y);
      default:
        return new Vec3f();
    }
  }
};
self.jBox = class AABB {
  constructor(pos, w, h, d, xOff = 0, yOff = 0, zOff = 0) {
    this.pos = pos;
    this.offset = new Vec3f(xOff, yOff, zOff);

    this.w = w;
    this.h = h;
    this.d = d;
  }

  get x() { return this.pos.x + this.offset.x; }
  get y() { return this.pos.y + this.offset.y; }
  get z() { return this.pos.z + this.offset.z; }
  get xm() { return this.x + this.w; }
  get ym() { return this.y + this.h; }
  get zm() { return this.z + this.d; }

  intersect(that) {
    const x = check(this.x, this.xm, that.x, that.xm);
    const y = check(this.y, this.ym, that.y, that.ym);
    const z = check(this.z, this.zm, that.z, that.zm);

    switch(Math.min(x * x, y * y, z * z)) {
      case x * x:
        return new Vec3f(x, 0, 0);
      case y * y:
        return new Vec3f(0, y, 0);
      case z * z:
        return new Vec3f(0, 0, z);
      default:
        return new Vec3f();
    }
  }
};