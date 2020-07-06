import "./math/vector.js"
import "./math/matrix.js"
import "./aabb.js"


;(function() {
  let viewport = document.getElementById("viewport");
  let gl = viewport.getContext("webgl2");

  function resize() {
    viewport.width = self.innerWidth;
    viewport.height = self.innerHeight;
  }

  addEventListener("resize", resize);
  resize();

  let keys = {};
  addEventListener("keydown", e => { keys[e.code] = true; });
  addEventListener("keyup", e => { keys[e.code] = false; });

  let mouse = new Vec2();
  addEventListener("mousemove", e => { mouse = new Vec2(e.x / innerWidth, e.y / innerHeight); });

  function main() {
    requestAnimationFrame(main);
    gl.clearColor(mouse.x, 0.5, mouse.y, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);


  }
  requestAnimationFrame(main);
})();
