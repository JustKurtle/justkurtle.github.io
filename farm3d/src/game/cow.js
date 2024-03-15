import "../jiph/core.js"

const Cow = {
    create(pos) {
        let output = {
            "pos": vec3.clone(pos),
            "size": vec3.fromValues(2, 2, 2),
            "vel": vec3.create(),

            "hunger": 10,

            "shaderMaterial": {}
        };
        return output;
    },

    load(out, gl, { camera, variant = Math.floor(Math.random()*3) }) {
        let texture = jTexture(gl, 'assets/textures/cow'+variant+'.png');
        let modelView = mat4.create();

        let vertexArray = [
            -1, 1, 0, 
             1, 1, 0, 
             1,-1, 0, 
            -1,-1, 0,
        ];
        let texCoordArray = [
            1,0,
            0,0,
            0,1,
            1,1,
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
            uSampler: texture,

            uLookAtMatrix: camera.lookAtMatrix,
            uProjectionMatrix: camera.projectionMatrix,
        };
    },

    update(out, dt = 1, target) {
        let targetDistance = vec3.create();

        vec3.subtract(targetDistance, target.pos, out.pos);  // distance from target
        vec3.normalize(out.vel, targetDistance); // normalize distance to make it direction
        // vec3.multiply(out.vel, out.vel, [out.hunger, out.hunger, out.hunger]);

        mat4.targetTo(
            out.shaderMaterial.uModelViewMatrix, 
            out.pos, 
            target.pos, 
            vec3.fromValues(0, 1, 0)); // look at the player
        mat4.scale(
            out.shaderMaterial.uModelViewMatrix, 
            out.shaderMaterial.uModelViewMatrix, 
            vec3.fromValues(1, 1, 1));

        vec3.multiply(out.vel, out.vel, [0.9, 0.9, 0.9]);
        
        let tempVel = vec3.create();
        vec3.multiply(tempVel, out.vel, [dt, dt, dt]);
        vec3.add(out.pos, out.pos, tempVel);
    },

    draw(out, gl) {
        APP.assets.shaders.cow.set(out.shaderMaterial);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out.shaderMaterial.index.buffer);
        gl.drawElements(gl.TRIANGLES, out.shaderMaterial.index.length, gl.UNSIGNED_SHORT, 0);
    },
};

Object.freeze(Cow);
export default Cow;