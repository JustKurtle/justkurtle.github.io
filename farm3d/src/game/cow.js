import "../jiph/core.js"
import "../jiph/math.js"

self.Cow = class Cow {
    constructor(pos, shader) {
        this.box = new jRect(pos,
            2, 2, 2,
           -1,-1,-1);
        this.pos = pos;
        this.vel = new Vec3();

        this.hunger = 10;
        
        this.shader = shader;
        this.indexLength = 6;
        this.rMat = {};
    }

    load(gl) {
        let texture = jTexture(gl, 'assets/cow'+Math.floor(Math.random()*2)+'.png');
        this.indexLength = 6;
        this.rMat = {
            ...jBuffers(gl, {
                aVertexPosition: { 
                    array: [
                        -1, 1, 0, 
                         1, 1, 0, 
                         1,-1, 0, 
                        -1,-1, 0,
                    ], 
                    size: 3
                },
                aTextureCoord: { 
                    array: [
                        1,0,
                        0,0,
                        0,1,
                        1,1,
                    ],
                    size: 2
                },
                index: { 
                    array: [0,1,2, 0,2,3], 
                    size: 3
                },
            }),
            uModelViewMatrix: new Mat4().t(this.pos),
            uSampler: texture,
        };
    }

    update(dt = 1, target) {
        this.rMat.uModelViewMatrix.lookAt(this.pos, target.pos);

        target.pos.s(this.pos, this.vel).norm().m(this.hunger);
        
        this.vel.m(0.9);
        this.pos.a(this.vel.m(dt, []));
    }
    draw(gl) {
        this.shader.set(this.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
    }
};
