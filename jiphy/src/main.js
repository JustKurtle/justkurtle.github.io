import "./jiph/core.js"
import "./jiph/math.js"
import "./jiph/tree.js"

import "./game/block.js"
import "./game/player.js"

(function() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) return;
  (window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, innerWidth, innerHeight);
  })();
  
  canvas.onclick = canvas.requestPointerLock;

  const shader = jShader(gl, [`
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uLookAtMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = aVertexPosition * (uModelViewMatrix * uLookAtMatrix * uProjectionMatrix);
      vTextureCoord = aTextureCoord;
    }`,`
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `]);
  let texture = jLoadTexture(gl, './assets/UI.png');
  let entities = [];
  let player = new Player(new Vec3f(8,64,8));

  let camera = new jCamera();
  camera.lookAt = new Mat4f();
  camera.projection = new Mat4f().perspective(0.1, 1000, 90, innerWidth / innerHeight);

  self.boxTree = new Octree([32,16,32], [32,16,32], 16);
  {
    let i = 6096;
    while(i--) {
      let [x,y,z] = [i % 64, (i / 4196 | 0) * 3, (i / 64 | 0) % 64];
      let b = new Block(gl, x, y, z, shader);
      entities.push(b);
      boxTree.set([x, y, z], [0,0,0], b.box);
    }
  }

  let scene = new jScene(gl);

  self.then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;

    scene.clear(gl);
    
    shader.set({
      uSampler: texture,
      uLookAtMatrix: camera.lookAt,
      uProjectionMatrix: camera.projection
    });

    player.update(dt, { boxTree });
    for(let e of entities) e.update(dt);

    player.draw(gl, { camera });
    for(let e of entities) e.draw(gl);
  }
  requestAnimationFrame(main);
})();
