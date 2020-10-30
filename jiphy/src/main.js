import "./jiph/core.js"
import "./jiph/math.js"
import "./jiph/ui.js"

(function() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  (window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0,0, innerWidth,innerHeight);
  })();
  
  canvas.onclick = () => canvas.requestPointerLock();

  const rect = new jRect(new Vec3f(0, 0), 1, 1);
  const mat = new Shader(gl, jLoadTexture(gl, "assets/UI.png"));
  let UI = new jUI(rect, mat, 0);

  let then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;

    gl.clearColor(0.3,0.2,0.5,1);
    gl.clearDepth(1); 
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    UI.update(dt);
    UI.draw(gl);
  }
  requestAnimationFrame(main);
})();
