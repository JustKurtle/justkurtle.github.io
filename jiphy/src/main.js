import "./jiph/core.js"
import "./jiph/math.js"
import "./game/block.js"

import "./game/player.js"

(function() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  let camera = new Camera();
  camera.lookAt = new Mat4f();
  camera.projection = new Mat4f();
  (window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, innerWidth, innerHeight);
    camera.projection.perspective(0.1, 1000, 90, innerWidth / innerHeight);
  })();
  
  canvas.onclick = canvas.requestPointerLock;

  let entities = [];
  const mat = new Shader(gl, jLoadTexture(gl, "./assets/UI.png"));
  let player = new Player(new Vec3f(8,8,8), new jBox(null, 0.5, 2, 0.5,-0.25,0.25,-0.25));

  // let terrainData = [];

  let boxes = [];
  let worker = new Worker("./workers/terrainloader.js")
  worker.addEventListener("message", message => {
    for(let d of message.data) {
      // if(d === 1)
        entities.push(new Block(...d, mat));
    }
    for(let i in entities) {
      boxes.push(entities[i].box);
    }
  });
  worker.postMessage([16,16,16]);

  mat.lookAtMatrix = camera.lookAt;
  mat.projectionMatrix = camera.projection;

  let then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;

    gl.clearColor(0.3,0.2,0.5,1);
    gl.clearDepth(1); 
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    player.update(dt, { boxes });
    for(let e of entities) e.update(dt);

    player.draw(gl, { camera: camera });
    for(let e of entities) e.draw(gl);
  }
  requestAnimationFrame(main);
})();
