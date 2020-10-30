import "../material.js"
import "./core.js"
import "./math.js"

// flags
self.jUI_RESIZEABLE = 1;
self.jUI_MOVEABLE = 2;
self.jUI_HIDEABLE = 4;

const keys = [];

// the class, I made it to be overridden but I also want it
// to be able to function on its own to a minimal extent
self.jUI = class jUI {
  constructor(srcRect, material, flags = 0) {
    this.rect = srcRect; this.rect.srcPos.z = 2;
    this.sMat = material;
    this.children = [];

    window.onmousemove = e => {
      const dx = -e.movementX * 2 / innerWidth;
      const dy = e.movementY * 2 / innerHeight;

      const r = jUI.#up.cross(jUI.#dir).unit;
      const u = jUI.#up.unit;
      const f = jUI.#dir.unit;

      jUI.#dir = f.a(u.m(dy, [])).unit;
      jUI.#dir = f.a(r.m(dx, [])).unit;

      // jUI.#up = u.s(f.m(dy, [])).unit;
      // jUI.#up = u.a(r.m(dx, [])).unit;
    };
    let pt = { clientX: 0, clientY: 0 };
    window.ontouchstart = e => pt = e.touches[0];
    window.ontouchmove = e => {
      const move = [e.touches[0].clientX - pt.clientX, e.touches[0].clientY - pt.clientY];
      pt = e.touches[0];

      const dx = -move[0] * 2 / innerWidth;
      const dy = move[1] * 2 / innerHeight;

      const r = jUI.#up.cross(jUI.#dir).unit;
      const u = jUI.#up.unit;
      const f = jUI.#dir.unit;

      jUI.#dir = f.a(u.m(dy, [])).unit;
      jUI.#dir = f.a(r.m(dx, [])).unit;

      // jUI.#up = u.s(f.m(dy, [])).unit;
      // jUI.#up = u.a(r.m(dx, [])).unit;
    };
    window.onkeydown = e => (!e.repeat && keys.indexOf(e.code) < 0) ? keys.push(e.code) : undefined;
    window.onkeyup = e => delete keys[keys.indexOf(e.code)];

    this.#fResize = flags & 1 === 1;
    this.#fMove = flags & 2 === 2;
    this.#fHide = flags & 4 === 4;

    this.#bHide = this.#fHide;
  }

  static #eye = new Vec3f(0,0,-1);
  static #dir = new Vec3f(0,0,1);
  static #up = new Vec3f(0,1,0);

  #fResize;
  #fMove;
  #fHide;

  #bHide;

  hide() { if(this.#fHide) this.#bHide = !this.#bHide; }
  move(x, y) { if(this.#fMove) this.rect.srcPos.x = x, this.rect.srcPos.y = y; }
  resize(w, h) { if(this.#fResize) this.rect.w = w, this.rect.h = h; }

  get pos() { return new Vec3f(this.rect.srcPos.x, this.rect.srcPos.y); }
  get size() { return new Vec3f(this.rect.w, this.rect.h); }

  update(dt = 1) {
    if(this.#bHide) return;
    const f = jUI.#dir.unit.m(dt * 4);
    const r = jUI.#dir.unit.m(dt * 4).cross(jUI.#up);

    let i = keys.length;
    while(i--) {
      switch(keys[i]) {
        case "KeyW":
          jUI.#eye.a(f);
          break;
        case "KeyS":
          jUI.#eye.s(f);
          break;
        case "KeyA":
          jUI.#eye.a(r);
          break;
        case "KeyD":
          jUI.#eye.s(r);
          break;
        case "KeyQ":
          jUI.#up = jUI.#up.unit.s(r);
          break;
        case "KeyE":
          jUI.#up = jUI.#up.unit.a(r);
          break;
      }
    }
  }

  draw(gl) {
    if(this.#bHide) return;

    this.sMat.modelViewMatrix.t(this.rect.srcPos);

    this.sMat.lookAtMatrix.lookTo(jUI.#eye, jUI.#dir, jUI.#up).i();

    this.sMat.projectionMatrix.perspective(1, 1000, 90, innerWidth / innerHeight);

    this.sMat.use(gl);
  }
};
