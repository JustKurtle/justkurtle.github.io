self.Vec2 = class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get mag() { return (this.x ** 2 + this.y ** 2) ** 0.5; }
  get unit() { return new Vec2(this.x / this.mag, this.y / this.mag); }
  get perp() { return new Vec2(-this.y, this.x); }

  copy() { return new Vec2(this.x, this.y); }
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
