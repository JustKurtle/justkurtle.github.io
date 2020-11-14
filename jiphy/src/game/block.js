import "../jiph/core.js"
import "../jiph/math.js"

self.Block = class Block {
  constructor(gl, x, y, z, shader) {
    this.box = new jBox(new Vec3f(x, y, z), 1, 1, 1,-0.5,-0.5,-0.5);
    this.shader = shader;

    if(!Block.buffers) Block.buffers = jBuffers(gl, {
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
      }
    });

    this.gMaterial = {
      uModelViewMatrix: new Mat4f().t([x,y,z]),
    };
  }

  static buffers;

  update(dt) {

  }

  draw(gl) {
    this.shader.set(Block.buffers);
    this.shader.set(this.gMaterial);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Block.buffers.index.buffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  }
};
