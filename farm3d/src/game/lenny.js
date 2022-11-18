import "../jiph/core.js"

const Lenny = {
    create(pos) {
        return {
            "pos": vec3.clone(pos),
            "size": vec3.fromValues(1, 2, 1),
            "vel": vec3.create(),

            "dashCD": 0,
            "stepProgress": 1,

            "bAttacking": false,
            
            "shaderMaterial": {},
        }
    },

    load(out, gl) {
        let texture = jTexture(gl, 'assets/textures/arm.png');
        let modelView = mat4.create();
        let projection = mat4.create();

        let vertexArray = [
           -0.4,-0.4, 0, 
            0.4,-0.4, 0,
            0.4, 0.4, 0, 
           -0.4, 0.4, 0
        ];
        let texCoordArray = [
            1,0,
            0,0,
            0,1,
            1,1
        ];

        out.shaderMaterial = {
            ...jBuffers(gl, {
                aVertexPosition: { 
                    array: vertexArray, 
                    size: 3
                },
                aTextureCoord: { 
                    array: texCoordArray,
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
        
        if(queue[controls.dash] && out.dashCD <= 0) {
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
        let tempVel = vec3.create();

        vec3.multiply(out.vel, out.vel, [0.9, 0.9, 0.9]); // drag
        vec3.multiply(tempVel, out.vel, [dt, dt, dt]); // framelag correction
        vec3.add(out.pos, out.pos, tempVel); // primitive adding of velocity to position
    },

    draw(out, gl, dt) {
        let offset = Math.cos(out.stepProgress) * 0.4; // the value to oscillate

        mat4.ortho(out.shaderMaterial.uProjectionMatrix, -1, 1, -innerHeight / innerWidth, innerHeight / innerWidth, 0.1, Number.MAX_SAFE_INTEGER); // reset the orthographic projection in case the screen is resized
        
        mat4.translate(out.shaderMaterial.uModelViewMatrix, mat4.create(), vec3.fromValues( 1 - offset, 0.5 * offset - 0.7, 1)); // set position of right arm
        mat4.rotateY(out.shaderMaterial.uModelViewMatrix, out.shaderMaterial.uModelViewMatrix, Math.PI); // flip

        APP.assets.shaders.lenny.set(out.shaderMaterial); // set the shader values with the material
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out.shaderMaterial.index.buffer); // index buffer things
        gl.drawElements(gl.TRIANGLES, out.shaderMaterial.index.length, gl.UNSIGNED_SHORT, 0);
        
        mat4.translate(out.shaderMaterial.uModelViewMatrix, mat4.create(), vec3.fromValues(-1 - offset,-0.5 * offset - 0.7, 1)); // set position of left arm
        APP.assets.shaders.lenny.set(out.shaderMaterial); // set the shader values with the material

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out.shaderMaterial.index.buffer); // index buffer things
        gl.drawElements(gl.TRIANGLES, out.shaderMaterial.index.length, gl.UNSIGNED_SHORT, 0);

        out.stepProgress += vec3.length(APP.lenny.vel) * dt;
    }
};

Object.freeze(Lenny);
export default Lenny;