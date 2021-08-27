import "../jiph/core.js"
import "../jiph/math.js"

const shaderSrc = [`
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
uniform highp vec3 uLight;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    if(gl_FragColor.a < 0.5) discard;
}
`];
let shader;

self.Cow = {
    create(pos) {
        return {
            "box": new jRect(pos,
                 2, 2, 2,
                -1,-1,-1),
            "pos": pos,
            "vel": new Vec3(),

            "hunger": 10,
        
            "shader": shader,
            "rMat": {}
        }
    },

    load(cow, gl, { camera }) {
        let texture = jTexture(gl, 'assets/cow'+Math.floor(Math.random()*2)+'.png');
        if(!shader) { shader = jShader(gl, shaderSrc); cow.shader = shader; }

        cow.rMat = {
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
                    size: 3,
                    length: 6
                },
            }),
            uModelViewMatrix: new Mat4(),
            uSampler: texture,

            uLookAtMatrix: camera.lookAt,
            uProjectionMatrix: camera.projection,
        };
    },

    update(cow, dt = 1, target) {
        cow.rMat.uModelViewMatrix.lookAt(cow.pos, target.pos);

        target.pos.s(cow.pos, cow.vel).norm().m(cow.hunger);
        if(target.bAttacking && cow.box.overlaps(target.box))
            cow.hunger *= 0.85;
        
        cow.hunger += 0.001;

        cow.vel.m(0.9);
        cow.pos.a(cow.vel.m(dt, []));
    },

    draw(cow, gl) {
        cow.shader.set(cow.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cow.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, cow.rMat.index.length, gl.UNSIGNED_SHORT, 0);
    },
};
