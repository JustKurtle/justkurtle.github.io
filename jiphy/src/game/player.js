import "../jiph/core.js"
import "../jiph/math.js"

self.keys = new Map();
self.onkeydown = e => {
  e.preventDefault();
  keys.set(e.code, e);
};
self.onkeyup = e => keys.delete(e.code);

self.Player = class Player {
  constructor(pos) {
    this.box = new jBox(pos,
      0.5, 1.8, 0.5,
     -0.5,-1.6,-0.5);
    this.pos = pos;
    this.vel = new Vec3f();

    let cRad = [Math.PI, 0];
    self.onmousemove = e => {
      let amp = 0.002;
      let angChange = [e.movementX * amp, e.movementY * amp];

      cRad[0] -= angChange[0];
      if(Math.abs(cRad[1] + angChange[1]) < Math.PI / 2) cRad[1] -= -angChange[1];
      cRad.map(v => v %= Math.PI * 2);

      let f = new Quat(0,0,1,0);
      let u = new Quat(0,1,0,0);

      let q1 = new Quat(...u);
      let q2 = new Quat();

      q1.ry(cRad[0], q1).i(q2);
      q1.rx(cRad[1], q1).i(q2);

      this.lookDir = new Vec3f(...q1.m(f).m(q2));
    };

    let pt = { clientX: 0, clientY: 0 };
    self.ontouchstart = e => pt = e.touches[0];
    self.ontouchmove = e => {
      console.log(e);
      e.movementX = e.touches[0].clientX - pt.clientX;
      e.movementY = e.touches[0].clientY - pt.clientY;
      pt = e.touches[0];
      self.onmousemove(e);
    };
  }
  
  lookDir = new Vec3f(0,0,1);
  #grounded = false;

  update(dt = 1, { boxTree }) {
    const f = new Vec3f(this.lookDir.x, 0, this.lookDir.z).unit;
    const r = new Vec3f(this.lookDir.z, 0,-this.lookDir.x).unit;

    let speed = 3 * dt;
    let jump = 0.33;
    let gravity = 0;
    let friction = new Vec3f(0.82, 0.98, 0.82);
    if(!this.#grounded) {
      speed = 0.25 * dt;
      jump = 0;
      gravity = dt;
      friction = new Vec3f(0.98, 0.98, 0.98);
    }
    
    {
      let movement = new Vec3f(0,0,0);
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
        }
      }
      if(movement.mag) this.vel.a(movement.unit.m(speed));
    }

    this.vel.y -= gravity;
    this.pos.a(this.vel.m(friction));

    this.#grounded = false;
    let boxes = boxTree.get(this.pos, [4,4,4])
    for(let b of boxes) {
      if(this.box.intersects(b)) {
        let overlap = this.box.intersect(b);
        if(overlap.y > 0) this.#grounded = true;
        if(overlap.x) {
          this.vel.x = 0;
        } else
        if(overlap.y) {
          this.vel.y = 0;
        } else
        if(overlap.z) {
          this.vel.z = 0;
        }
        this.pos.a(overlap);
      }
    }
  }

  draw(gl, { camera }) {
    camera.lookAt.lookTo(this.pos, this.lookDir).i();
  }
};
