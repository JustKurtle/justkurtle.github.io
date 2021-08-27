import "../jiph/core.js"
import "../jiph/math.js"

const shaderSrc = [`
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
`];
let shader;

self.Lenny = {
    create(pos) {
        return {
            "box": new jRect(pos,
                 2, 2, 2,
                -1,-1,-1),
            "pos": pos,
            "vel": new Vec3(),

            "dashCD": 0,

            "bAttacking": false,
            
            "shader": shader,
            "rMat": {},
            "lMat": {},
        }
    },

    load(lenny, gl) {
        let texture = jTexture(gl, 'assets/arm.png');
        let projection = new Mat4().orthographic(0, 1000, 1, innerHeight / innerWidth);
        if(!shader) { shader = jShader(gl, shaderSrc); lenny.shader = shader; }

        lenny.rMat = {
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
                    size: 3,
                    length: 6
                },
            }),
            uModelViewMatrix: new Mat4(),
            uProjectionMatrix: projection,
            uSampler: texture,
        };
        lenny.lMat = {
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
                    size: 3,
                    length: 6
                },
            }),
            uModelViewMatrix: new Mat4(),
            uProjectionMatrix: projection,
            uSampler: texture,
        };
    },

    control(lenny, queue, controls, cFwd, cRgt) {
        let speed = 2;
        let move = new Vec3();
        
        if(queue[controls.dash ] && lenny.dashCD <= 0) {
            speed = 300;
            lenny.dashCD = 256;
        }

        if(queue[controls.front]) move.a(cFwd);
        if(queue[controls.back ]) move.s(cFwd);
        if(queue[controls.left ]) move.a(cRgt);
        if(queue[controls.right]) move.s(cRgt);

        lenny.bAttacking = false;
        if(queue[controls.fire]) lenny.bAttacking = true;

        lenny.vel.a(move.unit.m(speed));
        lenny.dashCD--;
    },

    update(lenny, dt = 1) {
        lenny.vel.m(0.9); // friction
        lenny.pos.a(lenny.vel.m(dt, [])); // update position
    },

    draw(lenny, gl, marchProg) {
        let offset = Math.cos(marchProg * 0.01) * 0.4; // the value to oscillate
        
        lenny.rMat.uProjectionMatrix.orthographic(0, 1000, 1, innerHeight / innerWidth); // reset the orthographic projection in case the screen is resized

        lenny.rMat.uModelViewMatrix.t([offset + 1,-0.5 * offset - 0.7]), // set position of right arm
        lenny.shader.set(lenny.rMat); // set the shader values with the material
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lenny.rMat.index.buffer); // index buffer things
        gl.drawElements(gl.TRIANGLES, lenny.rMat.index.length, gl.UNSIGNED_SHORT, 0);
        
        lenny.lMat.uModelViewMatrix.t([offset - 1, 0.5 * offset - 0.7]), // set position of left arm
        lenny.shader.set(lenny.lMat); // set the shader values with the material
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lenny.lMat.index.buffer); // index buffer things
        gl.drawElements(gl.TRIANGLES, lenny.lMat.index.length, gl.UNSIGNED_SHORT, 0);
    }
};
