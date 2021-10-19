import "../jiph/core.js"

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
            "pos": vec3.clone(pos),
            "vel": vec3.create(),

            "hunger": 10,
        
            "shader": shader,
            "rMat": {}
        }
    },

    load(out, gl, { camera }) {
        let texture = jTexture(gl, 'assets/cow'+Math.floor(Math.random()*2)+'.png');
        let modelView = mat4.create();
        if(!shader) { shader = jShader(gl, shaderSrc); out.shader = shader; }

        out.rMat = {
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
            uModelViewMatrix: modelView,
            uSampler: texture,

            uLookAtMatrix: camera.lookAt,
            uProjectionMatrix: camera.projection,
        };
    },

    update(out, dt = 1, target) {
        mat4.lookAt(out.rMat.uModelViewMatrix, out.pos, target.pos, [0,1,0]); // look at the player

        vec3.subtract(out.vel, out.pos, target.pos); // distance from player
        vec3.normalize(out.vel, out.vel); // normalize distance to make it direction
        vec3.multiply(out.vel, out.vel, [out.hunger, out.hunger, out.hunger]); 
        // if(target.bAttacking && out.box.overlaps(target.box))
        //     out.hunger *= 0.85;
        
        out.hunger += 0.001;

        vec3.multiply(out.vel, out.vel, [0.9, 0.9, 0.9]);

        let tempVel = vec3.create();
        vec3.multiply(tempVel, out.vel, [dt, dt, dt])
        vec3.add(out.pos, out.pos, tempVel);
    },

    draw(out, gl) {
        out.shader.set(out.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, out.rMat.index.length, gl.UNSIGNED_SHORT, 0);
    },
};
