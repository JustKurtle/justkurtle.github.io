self.AABB = class AABB {
  constructor(pos, w, h) {
    this.pos = pos;
    this.size = new Vec2(w, h);
  }

  get w() { return this.size.x; }
  set w(n) { this.size.x = n; }

  get h() { return this.size.y; }
  set h(n) { this.size.y = n; }

  get max() { return this.pos.a(1, this.size, new Vec2()); }

  minDist(that) {
    let out = new Vec2();

    const XO1 = this.pos.x <= that.max.x && this.pos.x >= that.pos.x,
          XO2 = that.pos.x <= this.max.x && that.pos.x >= this.pos.x;
    if(XO1 || XO2) {
      const min1 = that.max.x - this.pos.x,
            min2 = that.pos.x - this.max.x;
      out.x = (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
    }

    const YO1 = this.pos.y <= that.max.y && this.pos.y >= that.pos.y,
          YO2 = that.pos.y <= this.max.y && that.pos.y >= this.pos.y;
    if(YO1 || YO2) {
      const min1 = that.max.y - this.pos.y,
            min2 = that.pos.y - this.max.y;
      out.y = (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
    }

    return out.m(1, (Math.abs(out.x) >= Math.abs(out.y)) ? new Vec2(0, 1) : new Vec2(1, 0));
  }
};
