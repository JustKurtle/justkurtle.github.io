import "../jiph/core.js"
import "../jiph/math.js"

self.cCode = n => (n[0] & 0xf) + ((n[2] & 0xf) << 4) + ((n[1] & 0xff) << 8);
self.cDecode = n => [n & 0xf, n >> 8 & 0xff, n >> 4 & 0xf];
self.Chunk = class Chunk {
  constructor(shader) {
    this.data = new Uint16Array(new Array(65535)); // terrain data
    this.uTime; // the time unloaded

    this.shader = shader;
    this.indexLength = 0;
    this.rMat = {};
  }

  set(pos, blockIndex) { return this.data[cCode(pos)] = blockIndex; }
  get(pos) { return this.data[cCode(pos)]; }
  has(pos) { return !!this.data[cCode(pos)]; }

  update() {
    let vPos = [], tCoord = [], index = [];
    this.data.forEach((e, i) => {
      if(!e) return;
      let pos = cDecode(i);
      if(!this.data[+i + 256]) {
        vPos = vPos.concat([
          -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
           0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
           0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
          -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2]]); // +y
        tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        let l = Math.floor(index.length / 6 * 4);
        index = index.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
      }
      if(!this.data[+i - 256]) {
        vPos = vPos.concat([
          -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
           0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
           0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
          -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2]]); // -y
        tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        let l = Math.floor(index.length / 6 * 4);
        index = index.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
      }
      if(!this.data[+i + 1]) {
        vPos = vPos.concat([
           0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
           0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
           0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
           0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2]]); // +z
        tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        let l = Math.floor(index.length / 6 * 4);
        index = index.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
      }
      if(!this.data[+i - 1]) {
        vPos = vPos.concat([
          -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
          -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
          -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
          -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2]]); // -z
        tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        let l = Math.floor(index.length / 6 * 4);
        index = index.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
      }
      if(!this.data[+i + 16]) {
        vPos = vPos.concat([
          -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
           0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
           0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
          -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2]]); // +x
        tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        let l = Math.floor(index.length / 6 * 4);
        index = index.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
      }
      if(!this.data[+i - 16]) {
        vPos = vPos.concat([
          -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
           0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
           0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
          -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2]]); // -x
        tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        let l = Math.floor(index.length / 6 * 4);
        index = index.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
      }
    });
    this.indexLength = index.length;
    this.rMat = {
      ...jBuffers(gl, {
        aVertexPosition: { 
          array: vPos, 
          size: 3
        },
        aTextureCoord: { 
          array: tCoord,
          size: 2
        },
        index: { 
          array: index, 
          size: 3
        },
      }),
      uModelViewMatrix: new Mat4().t([0,0,0]),
      uGlow: 1,
    };
  }
  
  draw(gl) {
    this.shader.set(this.rMat);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rMat.index.buffer);
    gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
  }
};