import "../jiph/core.js"
import "../jiph/math.js"

const keys = [];

self.Player = class Player {
  constructor(pos, box) {
    this.box = box;
    this.pos = pos;

    this.lookDir = new Vec3f(0,0,1);

    this.box.srcPos = this.pos;

    let cRad = [0, 0];
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
      e.movementX = e.touches[0].clientX - pt.clientX;
      e.movementY = e.touches[0].clientY - pt.clientY;
      pt = e.touches[0];

      self.onmousemove(e);
    };
    self.onkeydown = e => (!e.repeat && keys.indexOf(e.code) < 0) ? keys.push(e.code) : undefined;
    self.onkeyup = e => delete keys[keys.indexOf(e.code)];
  }

  update(dt = 1) {
    const f = this.lookDir.unit.m([1,0,1]);
    const u = new Vec3f(0,1,0);
    const r = u.cross(f);
    
    f.m(dt * 4);
    r.m(dt * 4);
    u.m(dt * 4);

    {
      let i = keys.length;
      while(i--) {
        switch(keys[i]) {
          case "KeyW":
            this.pos.a(f);
            break;
          case "KeyS":
            this.pos.s(f);
            break;
          case "KeyA":
            this.pos.a(r);
            break;
          case "KeyD":
            this.pos.s(r);
            break;
          case "KeyQ":
            this.pos.s(u);
            break;
          case "KeyE":
            this.pos.a(u);
            break;
        }
      }
    }

  }

  draw(gl, { camera }) {
    camera.lookAt.lookTo(this.pos, this.lookDir).i();
  }
};
