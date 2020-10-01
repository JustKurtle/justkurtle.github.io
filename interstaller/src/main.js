import "./math/vector.js"
import "./math/matrix.js"
import "./math/aabb.js"

import "./screen.js"


;(function() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, innerWidth, innerHeight)
  }

  addEventListener("resize", resize);
  resize();

  const events = [];
  addEventListener("keydown", e => { events.push(e); });
  addEventListener("keyup", e => { events.push(e); });
  addEventListener("mousemove", e => { events.push(e); });
  addEventListener("mouseclick", e => { events.push(e); });
  addEventListener("mouserelease", e => { events.push(e); });

  let screen = new Menu(gl);

  let then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;

    screen.handle(events);
    screen.update(dt);
    screen.draw(dt);
  }
  requestAnimationFrame(main);
})();
