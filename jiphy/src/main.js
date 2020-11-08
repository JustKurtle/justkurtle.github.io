import "./jiph/core.js"
import "./jiph/math.js"
import "./jiph/octree.js"

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
  let player = new Player(new Vec3f(8,64,8), new jBox(null,0.5,1.8,0.5,-0.5,-1.6,-0.5));

  self.boxTree = new Octree([8,16,8], [16,32,16], 16);

  let worker = new Worker("./workers/terrainloader.js")
  worker.addEventListener("message", message => {
    for(let i in message.data) {
      if(message.data[i] === 1) entities.push(new Block(i % 16, i / 256 | 0, (i / 16 | 0) % 16, mat));
    }
    for(let ent of entities) {
      let b = ent.box;
      boxTree.set(b.srcPos, [b.w/2,b.h/2,b.d/2], ent.box);
    }
  });
  worker.postMessage([16,16]);  

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

    player.update(dt, { boxTree });
    for(let e of entities) e.update(dt);

    player.draw(gl, { camera });
    for(let e of entities) e.draw(gl);
  }
  requestAnimationFrame(main);
})();
