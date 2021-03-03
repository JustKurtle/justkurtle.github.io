import "../jiph/core.js"
import "../jiph/math.js"

self.keys = new Map();
self.onkeydown = e => keys.set(e.code, e); 
self.onkeyup = e => keys.delete(e.code);

self.M_CLICK = false;

self.Player = class Player {
  constructor(pos) {
    this.ray = new jRay(pos, new Vec3(0,0,7));
    this.box = new jBox(pos,
      0.4, 1.8, 0.4,
     -0.2,-1.6,-0.2);
    this.pos = pos;
    this.vel = new Vec3();

    this.grounded = false;

    let cRad = [Math.PI, 0];
    self.onmousemove = e => {
      let amp = 0.002;
      let angChange = [e.movementX * amp, e.movementY * amp];

      cRad[0] -= angChange[0];
      if(Math.abs(cRad[1] + angChange[1]) < Math.PI / 2) cRad[1] -= -angChange[1];
      cRad[1] %= Math.PI * 2;

      let f = new Quat(0,0,1,0);
      let u = new Quat(0,1,0,0);

      let q1 = new Quat(...u);
      let q2 = new Quat();

      q1.ry(cRad[0], q1).i(q2);
      q1.rx(cRad[1], q1).i(q2);

      this.ray.dir = new Vec3(...q1.m(f).m(q2)).m(7);
    };
    self.onmousedown = e => M_CLICK = true;
    self.onmouseup = e => M_CLICK = false;
  }

  update(dt = 1, { chunk }) {
    const f = new Vec3(this.ray.dir.x, 0, this.ray.dir.z).unit;
    const r = new Vec3(this.ray.dir.z, 0,-this.ray.dir.x).unit;

    let speed = 3 * dt;
    let jump = 0.33;
    let gravity = 0;
    let friction = new Vec3(0.82, 0.98, 0.82);
    if(!this.grounded) {
      speed = 0.25 * dt;
      jump = 0;
      gravity = dt;
      friction = new Vec3(0.98, 0.98, 0.98);
    }
    
    {
      let movement = new Vec3(0,0,0);
      for(let [k, v] of keys) {
        switch(k) {
          case "KeyW":
            movement.a(f);
            break;
          case "KeyS":
            movement.s(f);
            break;
          case "KeyA":
            movement.a(r);
            break;
          case "KeyD":
            movement.s(r);
            break;
          case "Space":
            this.vel.y += jump;
            break;
          case "KeyP":
            break;
        }
      }
      if(movement.dot(movement)) this.vel.a(movement.unit.m(speed));
    }

    this.vel.y -= gravity;
    this.pos.a(this.vel.m(friction));

    this.grounded = false;
    let boxes = chunk.tree.get(this.pos, [7,7,7]);
    let dir = new Vec3(...this.ray.dir);
    let boxhit = false;
    for(let b of boxes) {
      if(this.box.overlaps(b)) {
        let o = this.box.overlap(b);
        if(o.y > 0) this.grounded = true;
        this.vel.m([!o.x,!o.y,!o.z]);
        this.pos.a(o);
      }
      if(M_CLICK && this.ray.hits(b)) {
        this.ray.dir = this.ray.hit(b);
        boxhit = true;
      }
    }
    if(boxhit) {
      this.ray.dir.a(this.pos).a([0.5,0.5,0.5]);
      this.ray.dir[0] &= 15, this.ray.dir[1] &= 255, this.ray.dir[2] &= 15;
      chunk.set(this.ray.dir, new Block(gl, this.ray.dir[0], this.ray.dir[1], this.ray.dir[2], shader));
      chunk.get(this.ray.dir).rMat.uGlow = 0.2;
      M_CLICK = false;
      this.ray.dir = dir;
    }
  }

  draw(gl, { camera }) {
    camera.lookAt.lookTo(this.pos, this.ray.dir).i();
  }
};
