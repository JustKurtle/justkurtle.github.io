import "./jiph/core.js"
import "./jiph/math.js"
import "./jiph/tree.js"

import "./game/block.js"
import "./game/player.js"

(function() {
  const canvas = document.querySelector("#canvas");
  self.gl = canvas.getContext("webgl2");
  if (!gl) return;
  (window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, innerWidth, innerHeight);
  })();
  
  canvas.onclick = canvas.requestPointerLock;

  self.shader = jShader(gl, [`
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
    uniform highp float uGlow;
    uniform highp vec3 uLight;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord) * uGlow;
    }
  `]);
  let texture = jLoadTexture(gl, './assets/UI.png');
  let entities = [];
  let player = new Player(new Vec3(8,64,8));
  let chunk = new Chunk();

  let camera = new jCamera();
  camera.lookAt = new Mat4();
  {
    let i = 256 * 64;
    while(i--) {
      let [x,y,z] = [i % 16, i / 256 | 0, (i / 16 | 0) % 16];
      let b = new Block(gl, x, y, z, shader);
      chunk.set([x,y,z], b);
    }
  }

  let scene = new jScene(gl);

  self.then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;
    let fov = 90;
    
    for(let [k, v] of keys) {
      switch(k) {
        case "KeyC":
          fov = 20;
          break;
      }
    }
    camera.projection = new Mat4().perspective(0.1, 1000, fov, innerWidth / innerHeight);

    scene.clear(gl);
    
    shader.set({
      uSampler: texture,
      uLookAtMatrix: camera.lookAt,
      uProjectionMatrix: camera.projection
    });

    player.update(dt, { chunk });
    for(let e of entities) e.update(dt);

    player.draw(gl, { camera });
    for(let e of entities) e.draw(gl);
    for(let [k, v] of chunk.data) v.draw(gl);
  }
  requestAnimationFrame(main);
})();
