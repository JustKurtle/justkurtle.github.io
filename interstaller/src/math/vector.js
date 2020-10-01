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

  m(mod = 1, that = new Vec2(1, 1)) { return new Vec2(this.x * (that.x * mod), this.y * (that.y * mod)); }
  a(mod = 1, that = new Vec2(1, 1)) { return new Vec2(this.x + (that.x * mod), this.y + (that.y * mod)); }
}
