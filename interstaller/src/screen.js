self._Screen = class _Screen {
  constructor(gl) {
    this.gl = gl;
    this.paused = false;
  }

  handle(events) {}
  update(dt) {}
  draw(dt) {}
};

self.Menu = class Menu extends _Screen {
  constructor(gl) {
    super(gl);

    this.mouse = new Vec2();
  }

  handle(events) {
    while(events.length > 0) {
      const e = events.pop(0);
      switch(e.type) {
        case "mousemove":
          this.mouse.x = e.x / innerWidth;
          this.mouse.y = e.y / innerHeight;
          break;
        default:
          console.log(e);
          break;
      }
    }
  }

  update(dt) {
    if(!this.paused) {

    }
  }

  draw(dt) {
    this.gl.clearColor(this.mouse.x, 0.5, this.mouse.y, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


  }
};
