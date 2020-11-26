import "../jiph/core.js"
import "../jiph/math.js"

self.Block = class Block {
  constructor(gl, x, y, z, shader) {
    this.box = new jBox(new Vec3(x, y, z), 1, 1, 1,-0.5,-0.5,-0.5);
    this.shader = shader;

    this.gMaterial = {
      ...jBuffers(gl, {
        aVertexPosition: { 
          array: [
            0.5,-0.5,-0.5,  0.5, 0.5,-0.5,  0.5, 0.5, 0.5,  0.5,-0.5, 0.5, // +x
           -0.5,-0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5,-0.5, -0.5,-0.5,-0.5, // -x
           -0.5,-0.5,-0.5,  0.5,-0.5,-0.5,  0.5,-0.5, 0.5, -0.5,-0.5, 0.5, // +y
           -0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5,-0.5, -0.5, 0.5,-0.5, // -y
           -0.5,-0.5, 0.5,  0.5,-0.5, 0.5,  0.5, 0.5, 0.5, -0.5, 0.5, 0.5, // +z
           -0.5, 0.5,-0.5,  0.5, 0.5,-0.5,  0.5,-0.5,-0.5, -0.5,-0.5,-0.5, // -z
          ], 
          size: 3
        },
        aTextureCoord: { 
          array: [
            0,0,  1,0,  1,1,  0,1, // +x
            0,0,  1,0,  1,1,  0,1, // -x
            0,0,  1,0,  1,1,  0,1, // +y
            0,0,  1,0,  1,1,  0,1, // -y
            0,0,  1,0,  1,1,  0,1, // +z
            0,0,  1,0,  1,1,  0,1, // -z
          ],
          size: 2
        },
        index: { 
          array: [
             0, 1, 2,  0, 2, 3,
             4, 5, 6,  4, 6, 7,
             8, 9,10,  8,10,11,
            12,13,14, 12,14,15,
            16,17,18, 16,18,19,
            20,21,22, 20,22,23,
          ], 
          size: 3
        },
      }),
      uModelViewMatrix: new Mat4().t([x,y,z]),
      uGlow: 0,
    };
  }

  update(dt) {

  }

  draw(gl) {
    this.shader.set(this.gMaterial);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gMaterial.index.buffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  }
};

self.Chunk = class Chunk {
  constructor() {
    this.data = new Map(); // terrain data
    this.uTime; // the time unloaded
  
    this.tree = new Octree([8,128,8], [8,128,8], 16);
  }

  set(pos, blockIndex) {
    let key = (pos[0] & 0xf) + ((pos[1] & 0xff) << 4) + ((pos[2] & 0xf) << 12);
    if(this.data.has(key)) return;
    this.tree.set(pos, [0,0,0], blockIndex.box);
    return this.data.set(key, blockIndex);
  }
  get(pos) { return this.data.get((pos[0] & 0xf) + ((pos[1] & 0xff) << 4) + ((pos[2] & 0xf) << 12)); }
  has(pos) { return this.data.has((pos[0] & 0xf) + ((pos[1] & 0xff) << 4) + ((pos[2] & 0xf) << 12)); }
  delete(pos) { return this.data.delete((pos[0] & 0xf) + ((pos[1] & 0xff) << 4) + ((pos[2] & 0xf) << 12)); }
  
  draw(gl) {
    
  }
};