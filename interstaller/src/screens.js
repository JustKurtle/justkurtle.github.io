class Screen {
  constructor(gl) {
    this.gl = gl;
    this.paused = false;
  }

  update(dt) {}
  draw(dt) {}
};

self.Menu = class Menu extends Screen {
  constructor(gl) {
    super(gl);

    this.mouse = new Vec2();
  }

  update(dt) {
    if(this.paused) return;
      

  }

  draw(dt) {
    this.gl.clearColor(this.mouse.x, 0.5, this.mouse.y, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    
  }
};