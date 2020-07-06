self.Vec2 = class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get mag() { return (this.x ** 2 + this.y ** 2) ** 0.5; }
  get unit() { return new Vec2(this.x / this.mag, this.y / this.mag); }
  get perp() { return new Vec2(-this.y, this.x); }

  copy(mod = 1) { return new Vec2(this.x * mod, this.y * mod); }
  dot(that) { return (this.x * that.x + this.y * that.y); }

  m(mod = 1, that = new Vec2(1, 1), out = this) {
    out.x = this.x * (that.x * mod);
    out.y = this.y * (that.y * mod);
    return out;
  }

  a(mod = 1, that = new Vec2(1, 1), out = this) {
    out.x = this.x + (that.x * mod);
    out.y = this.y + (that.y * mod);
    return out;
  }
}

self.Vec3 = class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get mag() { return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** 0.5; }
  get unit() { return new Vec3(this.x / this.mag, this.y / this.mag, this.z / this.mag); }

  copy(mod = 1) { return new Vec3(this.x * mod, this.y * mod, this.z * mod); }
  dot(that) { return this.x * that.x + this.y * that.y + this.z * that.z; }
  cross() {}

  m(mod = 1, that = new Vec3(1, 1), out = this) {
    out.x = this.x * (that.x * mod);
    out.y = this.y * (that.y * mod);
    out.z = this.z * (that.z * mod);
    return out;
  }

  a(mod = 1, that = new Vec3(1, 1), out = this) {
    out.x = this.x + (that.x * mod);
    out.y = this.y + (that.y * mod);
    out.z = this.z + (that.z * mod);
    return out;
  }
}
