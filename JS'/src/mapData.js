self.MapData = class MapData {
  constructor(data = [1,1,1,1], color, w = 4, scale = 100) {
    this.lvl = [];
    this.color = color;
    for(let i in data) {
      if(data[i] > 0) {
        if(data[i-1] > 0 && i % w > 0) {
          this.lvl[this.lvl.length - 1].w += scale;
        } else {
          this.lvl[this.lvl.length] = new AABB(new Vec2((i % w) * scale, Math.floor(i / w) * scale), scale, scale);
        }
      }
    }
  }

  update() {}

  draw(ctx) {
    ctx.fillStyle = this.color;
    for(let b of this.lvl) {
      ctx.fillRect(b.pos.x, b.pos.y, b.w, b.h);
    }
  }
};
