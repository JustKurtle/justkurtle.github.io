import "../material.js"
import "./core.js"
import "./math.js"

// flags
self.jUI_RESIZEABLE = 1;
self.jUI_MOVEABLE = 2;
self.jUI_HIDEABLE = 4;

// the class, I made it to be overridden but I also want it
// to be able to function on its own to a minimal extent
self.jUI = class jUI {
  constructor(srcRect, material, flags = 0) {
    this.rect = srcRect;
    this.sMat = material;
    this.children = [];

    this.#fResize = flags & 1 === 1;
    this.#fMove = flags & 2 === 2;
    this.#fHide = flags & 4 === 4;

    this.#bHide = this.#fHide;
  }

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
    
  }

  draw(gl) {
    if(this.#bHide) return;
    this.sMat.modelViewMatrix.t(this.rect.srcPos);
    this.sMat.use(gl);
  }
};
