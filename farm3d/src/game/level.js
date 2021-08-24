import "../jiph/core.js"
import "../jiph/math.js"

self.Level = class Level {
    constructor(shader) {
        this.shader = shader;

        this.indexLength = 0;
        this.rMat = {};
    }

    load(gl) {
        // let vPos = [], tCoord = [], index = [];
        // data.forEach((e, i) => {
        //     switch(e) {
        //         case 0:
        //             vPos = vPos.concat([
        //                 ]);
        //             break;
        //         case 1:
        //             break;
        //         default:
        //             break;
        //     }
        //     if(!data[+i]) {
        //         vPos = vPos.concat([
        //             -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
        //                0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
        //                0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2],   
        //             -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2]]); // +y
        //         tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        //         let l = Math.floor(index.length / 6 * 4);
        //         index = index.concat([0 + l, 1 + l, 2 + l,   0 + l, 2 + l, 3 + l]);
        //     }
        //     if(!data[+i - 256]) {
        //         vPos = vPos.concat([
        //             -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
        //                0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
        //                0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
        //             -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2]]); // -y
        //         tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        //         let l = Math.floor(index.length / 6 * 4);
        //         index = index.concat([0 + l, 1 + l, 2 + l,   0 + l, 2 + l, 3 + l]);
        //     }
        //     if(!data[+i + 1]) {
        //         vPos = vPos.concat([
        //                0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
        //                0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
        //                0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
        //                0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2]]); // +z
        //         tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        //         let l = Math.floor(index.length / 6 * 4);
        //         index = index.concat([0 + l, 1 + l, 2 + l,   0 + l, 2 + l, 3 + l]);
        //     }
        //     if(!data[+i - 1]) {
        //         vPos = vPos.concat([
        //             -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
        //             -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
        //             -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
        //             -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2]]); // -z
        //         tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        //         let l = Math.floor(index.length / 6 * 4);
        //         index = index.concat([0 + l, 1 + l, 2 + l,   0 + l, 2 + l, 3 + l]);
        //     }
        //     if(!data[+i + 16]) {
        //         vPos = vPos.concat([
        //             -0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
        //                0.5 + pos[0],-0.5 + pos[1], 0.5 + pos[2], 
        //                0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2], 
        //             -0.5 + pos[0], 0.5 + pos[1], 0.5 + pos[2]]); // +x
        //         tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        //         let l = Math.floor(index.length / 6 * 4);
        //         index = index.concat([0 + l, 1 + l, 2 + l,   0 + l, 2 + l, 3 + l]);
        //     }
        //     if(!data[+i - 16]) {
        //         vPos = vPos.concat([
        //             -0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
        //                0.5 + pos[0], 0.5 + pos[1],-0.5 + pos[2], 
        //                0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2], 
        //             -0.5 + pos[0],-0.5 + pos[1],-0.5 + pos[2]]); // -x
        //         tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
        //         let l = Math.floor(index.length / 6 * 4);
        //         index = index.concat([0 + l, 1 + l, 2 + l,   0 + l, 2 + l, 3 + l]);
        //     }
        // });
        // this.indexLength = index.length;
        // this.rMat = {
        //     ...jBuffers(gl, {
        //         aVertexPosition: { 
        //             array: vPos, 
        //             size: 3
        //         },
        //         aTextureCoord: { 
        //             array: tCoord,
        //             size: 2
        //         },
        //         index: { 
        //             array: index, 
        //             size: 3
        //         },
        //     }),
        //     uModelViewMatrix: new Mat4().t([0,0,0]),
        // };

        
        this.indexLength = 6;
        this.rMat = {
            ...jBuffers(gl, {
                aVertexPosition: { 
                    array: [
                        -100, 0, 100, 
                         100, 0, 100, 
                         100, 0,-100, 
                        -100, 0,-100
                    ], 
                    size: 3
                },
                aTextureCoord: { 
                    array: [
                        0,1,
                        1,1,
                        1,0,
                        0,0
                    ],
                    size: 2
                },
                index: { 
                    array: [0,1,2, 0,2,3], 
                    size: 3
                },
            }),
            uModelViewMatrix: new Mat4().t([0,-1.8,0]),
            uSampler: jTexture(gl,'assets/ground.png'),
        };
    }
    
    draw(gl) {
        this.shader.set(this.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
    }
};