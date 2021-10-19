import "../jiph/core.js"

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
            "pos": vec3.clone(pos),
            "vel": vec3.create(),

            "dashCD": 0,

            "bAttacking": false,
            
            "shader": shader,
            "rMat": {},
            "lMat": {},
        }
    },

    load(out, gl) {
        let texture = jTexture(gl, 'assets/arm.png');
        let modelView = mat4.create();
        let projection = mat4.create();
        mat4.ortho(projection, -1, 1, -innerWidth/innerHeight, innerWidth/innerHeight, 0.1, 1000);

        if(!shader) { shader = jShader(gl, shaderSrc); out.shader = shader; }

        out.rMat = {
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
            uModelViewMatrix: modelView,
            uProjectionMatrix: projection,
            uSampler: texture,
        };
        out.lMat = {
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
            uModelViewMatrix: modelView,
            uProjectionMatrix: projection,
            uSampler: texture,
        };
    },

    control(out, queue, controls, cFwd, cRgt) {
        let speed = 2;
        let move = vec3.create();
        
        if(queue[controls.dash ] && out.dashCD <= 0) {
            speed = 300;
            out.dashCD = 256;
        }

        if(queue[controls.front]) vec3.add(move, move, cFwd);
        if(queue[controls.back ]) vec3.sub(move, move, cFwd);
        if(queue[controls.left ]) vec3.add(move, move, cRgt);
        if(queue[controls.right]) vec3.sub(move, move, cRgt);

        // out.bAttacking = false;
        // if(queue[controls.fire]) out.bAttacking = true;

        vec3.normalize(move, move);
        vec3.multiply(move, move, [speed, speed, speed]);
        vec3.add(out.vel, out.vel, move);
        out.dashCD--;
    },

    update(out, dt = 1) {


        vec3.multiply(out.vel, out.vel, [0.9, 0.9, 0.9]);

        let tempVel = vec3.create();
        vec3.multiply(tempVel, out.vel, [dt, dt, dt]);
        vec3.add(out.pos, out.pos, tempVel);
    },

    draw(out, gl, marchProg) {
        let offset = Math.cos(marchProg * 0.01) * 0.4; // the value to oscillate
        
        mat4.ortho(out.rMat.uProjectionMatrix, -1, 1, -innerWidth/innerHeight, innerWidth/innerHeight, 0.1, 1000); // reset the orthographic projection in case the screen is resized

        // out.rMat.uModelViewMatrix.t([offset + 1,-0.5 * offset - 0.7]), // set position of right arm
        mat4.translate(out.rMat.uModelViewMatrix, out.rMat.uModelViewMatrix, [offset + 1,-0.5 * offset - 0.7, 1]);
        out.shader.set(out.rMat); // set the shader values with the material
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out.rMat.index.buffer); // index buffer things
        gl.drawElements(gl.TRIANGLES, out.rMat.index.length, gl.UNSIGNED_SHORT, 0);
        
        // out.lMat.uModelViewMatrix.t([offset - 1, 0.5 * offset - 0.7]), // set position of left arm
        mat4.translate(out.lMat.uModelViewMatrix, out.lMat.uModelViewMatrix, [offset - 1, 0.5 * offset - 0.7, 1]);
        out.shader.set(out.lMat); // set the shader values with the material
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out.lMat.index.buffer); // index buffer things
        gl.drawElements(gl.TRIANGLES, out.lMat.index.length, gl.UNSIGNED_SHORT, 0);
    }
};
