self.AABB = class AABB {
  constructor(pos, width, height, xOffset = 0, yOffset = 0) {
    this.pos = pos;
    this.w = width;
    this.h = height;
    this.xOff = xOffset;
    this.yOff = yOffset;
  }

  get W() { return this.pos.x + this.xOff; }
  get N() { return this.pos.y + this.yOff; }
  get E() { return this.W + this.w; }
  get S() { return this.N + this.h; }

  get max() { return this.pos.a(1, this.size, new Vec2()); }

  minOut(that) {
    let out = new Vec2();

    const XO1 = this.W <= that.E && this.W >= that.W,
          XO2 = that.W <= this.E && that.W >= this.W;
    if(XO1 || XO2) {
      const min1 = that.E - this.W,
            min2 = that.W - this.E;
      out.x = (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
    }

    const YO1 = this.N <= that.S && this.N >= that.N,
          YO2 = that.N <= this.S && that.N >= this.N;
    if(YO1 || YO2) {
      const min1 = that.S - this.N,
            min2 = that.N - this.S;
      out.y = (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
    }

    return out.m(1, (Math.abs(out.x) >= Math.abs(out.y)) ? new Vec2(0, 1) : new Vec2(1, 0));
  }
};
