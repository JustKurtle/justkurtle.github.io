import "../jiph/core.js"
import "../jiph/math.js"

let lennyShader;
self.Lenny = class Lenny {
    constructor(pos) {
        this.box = new jRect(pos,
            2, 2, 2,
           -1,-1,-1);
        this.pos = pos;
        this.vel = new Vec3();

        this.foods = [Infinity];
        this.hands = [0, 0];

        this.shader = lennyShader;
        this.rMat = {};
        this.lMat = {};
    }

    load(gl) {
        let texture = jTexture(gl, 'assets/arm.png');
        if(!lennyShader) {
            lennyShader = jShader(gl, [`
                attribute vec4 aVertexPosition;
                attribute vec2 aTextureCoord;

                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;

                varying highp vec2 vTextureCoord;

                void main(void) {
                    gl_Position = aVertexPosition * (uModelViewMatrix * uProjectionMatrix);
                    vTextureCoord = aTextureCoord;
                }`,`
                varying highp vec2 vTextureCoord;

                uniform sampler2D uSampler;

                void main(void) {
                    gl_FragColor = texture2D(uSampler, vTextureCoord);
                    if(gl_FragColor.a < 0.5) discard;
                }
            `]);
            this.shader = lennyShader;
        }
        this.indexLength = 6;
        this.rMat = {
            ...jBuffers(gl, {
                aVertexPosition: { 
                    array: [
                         0.4, 0.4, 0, 
                        -0.4, 0.4, 0, 
                        -0.4,-0.4, 0, 
                         0.4,-0.4, 0,
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
            uModelViewMatrix: new Mat4().t([0.2,-0.65]),
            uProjectionMatrix: new Mat4().orthographic(0, 1000, 1, innerHeight/innerWidth),
            uSampler: texture,
        };
        this.lMat = {
            ...jBuffers(gl, {
                aVertexPosition: { 
                    array: [
                         0.4, 0.4, 0, 
                        -0.4, 0.4, 0, 
                        -0.4,-0.4, 0, 
                         0.4,-0.4, 0,
                    ], 
                    size: 3
                },
                aTextureCoord: { 
                    array: [
                        0,0,
                        1,0,
                        1,1,
                        0,1,
                    ],
                    size: 2
                },
                index: { 
                    array: [0,1,2, 0,2,3], 
                    size: 3
                },
            }),
            uModelViewMatrix: new Mat4().t([-0.2,-0.65]),
            uProjectionMatrix: new Mat4().orthographic(0, 1000, 1, innerHeight/innerWidth),
            uSampler: texture,
        };
    }

    update(dt = 1) {
        this.vel.m(0.9);
        this.pos.a(this.vel.m(dt, []));
    }

    draw(gl, marchProg) {
        let offset = new Vec3(Math.cos(marchProg * 0.01) * 0.4, Math.sin(marchProg * 0.01) * 0.5);
        this.rMat.uModelViewMatrix.t([offset.x + 1, offset.y - 0.7]),
        this.lMat.uModelViewMatrix.t([offset.x - 1,-offset.y - 0.7]),

        this.shader.set(this.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
        
        this.shader.set(this.lMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
    }
};
