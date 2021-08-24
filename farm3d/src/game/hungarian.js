import "../jiph/core.js"
import "../jiph/math.js"

self.Hungarian = class Hungarian {
    constructor(gl, pos) {
        this.box = new jRect(pos,
            0.50, 2.0, 0.50,
           -0.25,-1.8,-0.25);
        this.pos = pos;
        this.vel = new Vec3();
        
        this.shader = shader;
        this.indexLength = 6;
        this.rMat = {
            ...jBuffers(gl, {
                aVertexPosition: { 
                    array: [
                         2,-2, 0, 
                        -2,-2, 0,
                        -2, 2, 0, 
                         2, 2, 0, 
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
            uModelViewMatrix: new Mat4().t(this.pos),
            uSampler: jTexture(gl,'assets/cow.png'),
        };
    }

    update(dt = 1, target) {
        // this.rMat.uModelViewMatrix.lookAt(this.pos, target.pos, new Vec3(0,1,0));
        this.rMat.uModelViewMatrix.rx(dt);
    }
    draw(gl) {
        this.shader.set(this.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
    }
};
