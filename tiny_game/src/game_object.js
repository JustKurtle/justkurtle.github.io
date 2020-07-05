self.GameObj = class GameObj {
  constructor(x, y, w, h, color) {
    this.pos = new Vec2(x, y);
    this.aabb = new AABB(this.pos, w, h);
    this.color = color;
  }

  update() {}

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.aabb.size.x, this.aabb.size.y);
  }
};

self.PhysBox = class PhysBox extends GameObj{
  constructor(x, y, w, h, color) {
    super(x, y, w, h, color);
    this.vel = new Vec2();
  }

  update() {
    const gf = new Vec2(0.8, 0.98);
    const ngf = new Vec2(0.98, 0.98);

    this.vel.m(1, (this.grounded) ? gf : ngf);
    this.pos.a(1, this.vel);
  }
};
