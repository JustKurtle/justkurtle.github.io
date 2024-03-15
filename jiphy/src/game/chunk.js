// import "../jiph/core.js"
// import "../jiph/math.js"

// self.cCode = n => (n[0] & 0x3f) + ((n[2] & 0x3f) << 6) + ((n[1] & 0x3f) << 12);
// self.cDecode = n => [n & 0x3f, n >> 12 & 0x3f, n >> 6 & 0x3f];
// self.Chunk = class Chunk {
//     constructor(shader) {
//         this.data = new BigUint64Array(64 ** 2); // terrain data
//         this.uTime; // the time unloaded

//         this.shader = shader;
//         this.indexLength = 0;
//         this.rMat = {};
//     }

//     set(pos, blockIndex) { return this.data[cCode(pos)] = blockIndex; }
//     get(pos) { return this.data[cCode(pos)]; }
//     has(pos) { return !!this.data[cCode(pos)]; }
    
//     draw(gl) {
//         this.shader.set(this.rMat);
//         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rMat.index.buffer);
//         gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
//     }
// };

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
                tCoord = tCoord.concat([0,0, 0.5,0, 0.5,1/8, 0,1/8]);
                let l = Math.floor(index.length / 6 * 4);
                index = index.concat([0 + l, 1 + l, 2 + l,    0 + l, 2 + l, 3 + l]);
            }
            if(!this.data[+i - 256]) {
                vPos = vPos.concat([
                    -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
                     0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
                     0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
                    -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2]]); // -y
                tCoord = tCoord.concat([0,1/8, 0.5,1/8, 0.5,2/8, 0,2/8]);
                let l = Math.floor(index.length / 6 * 4);
                index = index.concat([0 + l, 1 + l, 2 + l,    0 + l, 2 + l, 3 + l]);
            }
            if(!this.data[+i + 1]) {
                vPos = vPos.concat([
                     0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
                     0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
                     0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
                     0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2]]); // +z
                tCoord = tCoord.concat([0,3/8, 0,2/8, 0.5,2/8, 0.5,3/8]);
                let l = Math.floor(index.length / 6 * 4);
                index = index.concat([0 + l, 1 + l, 2 + l,    0 + l, 2 + l, 3 + l]);
            }
            if(!this.data[+i - 1]) {
                vPos = vPos.concat([
                    -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
                    -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
                    -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
                    -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2]]); // -z
                tCoord = tCoord.concat([0,4/8, 0,3/8, 0.5,3/8, 0.5,4/8]);
                let l = Math.floor(index.length / 6 * 4);
                index = index.concat([0 + l, 1 + l, 2 + l,    0 + l, 2 + l, 3 + l]);
            }
            if(!this.data[+i + 16]) {
                vPos = vPos.concat([
                    -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
                     0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
                     0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
                    -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2]]); // +x
                tCoord = tCoord.concat([0.5,5/8, 0,5/8, 0,4/8, 0.5,4/8]);
                let l = Math.floor(index.length / 6 * 4);
                index = index.concat([0 + l, 1 + l, 2 + l,    0 + l, 2 + l, 3 + l]);
            }
            if(!this.data[+i - 16]) {
                vPos = vPos.concat([
                    -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
                     0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
                     0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
                    -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2]]); // -x
                tCoord = tCoord.concat([0,5/8, 0.5,5/8, 0.5,6/8, 0,6/8]);
                let l = Math.floor(index.length / 6 * 4);
                index = index.concat([0 + l, 1 + l, 2 + l,    0 + l, 2 + l, 3 + l]);
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