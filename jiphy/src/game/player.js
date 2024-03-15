import "../jiph/core.js"
import "../jiph/math.js"

self.keys = new Map();
self.onkeydown = e => keys.set(e.code, e); 
self.onkeyup = e => keys.delete(e.code);

let mouse = [false,false,false,false,false];
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
    addEventListener("mousemove", e => {
      let dAng = [e.movementX * 0.002, e.movementY * 0.002];

      cRad[0] -= dAng[0];
      if(Math.abs(cRad[1] + dAng[1]) < Math.PI / 2) cRad[1] -= -dAng[1];
      cRad[1] %= Math.PI * 2;

      let f = new Quat(0,0,1,0);
      let u = new Quat(0,1,0,0);

      let q1 = new Quat(...u);
      let q2 = new Quat();

      q1.ry(cRad[0], q1).i(q2);
      q1.rx(cRad[1], q1).i(q2);

      this.ray.dir = new Vec3(...q1.m(f).m(q2)).m(7);
    });
    addEventListener("mousedown", e => mouse[e.button] = true);
    addEventListener("mouseup", e => mouse[e.button] = false);
  }

  update(dt = 1, { chunks }) {
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
      friction = new Vec3(0.999, 0.999, 0.999);
    }
    
    {
      let move = new Vec3(0,0,0);
      for(let [k, v] of keys) {
        switch(k) {
          case "KeyW":
            move.a(f);
            break;
          case "KeyS":
            move.s(f);
            break;
          case "KeyA":
            move.a(r);
            break;
          case "KeyD":
            move.s(r);
            break;
          case "Space":
            this.vel.y += jump;
            break;
          case "KeyP":
            break;
        }
      }
      if(move.dot(move)) this.vel.a(move.unit.m(speed));
    }

    this.vel.y -= gravity;
    this.pos.a(this.vel.m(friction));

    this.grounded = false;
    for(let chunk of chunks) {
      let box = new jBox(new Vec3(),1,1,1,-0.5,-0.5,-0.5);
      let ray = this.ray.copy();
      let bPos = [], hDir = 0;
      let boxhit = false;
      for(let b = cCode(this.pos.s(3, []));b < cCode(this.pos.a(4, []));b++) {
        if(chunk.data[b] != 0) box.src = new Vec3(...cDecode(b));
        if(this.box.overlaps(box)) {
          let o = this.box.overlap(box);
          if(o.y > 0) this.grounded = true;
          this.vel.m([!o.x,!o.y,!o.z]);
          this.pos.a(o);
        }
        if((mouse[2] || mouse[0]) && ray.hits(box)) {
          ray.dir = ray.hit(box);
          bPos = new Vec3(...cDecode(b));
          hDir = ray.dir.a(this.pos, new Vec3()).a([0.5,0.5,0.5]);
        }
      }
      if(hDir) {
        if(mouse[2]) {
          console.log(hDir);
          chunk.set(hDir, 1);
          // mouse[2] = false;
        } 
        if(mouse[0]) {
          console.log(bPos);
          chunk.set(bPos, 0);
          mouse[0] = false;
        }
        chunk.update();
      }
    }
  }

  draw(gl, { camera }) {
    camera.lookAt.lookTo(this.pos, this.ray.dir).i();
  }
};
