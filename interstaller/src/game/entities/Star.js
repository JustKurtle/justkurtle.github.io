import Components from "../components.js";

function create() {
    let transform = Components.transform();
    let rigidBody = Components.rigidBody();

    let shaderMaterial = {
        $shader: APP.assets.shaders.star,
        ...jBuffers(APP.gl, {
            aVertexPosition: { 
                array: APP.assets.models.star.vertexArray, 
                size: 3
            },
            aTextureCoord: { 
                array: APP.assets.models.star.texCoordArray,
                size: 2
            },
            index: { 
                array: APP.assets.models.star.indexArray, 
                size: 3, 
                length: APP.assets.models.star.indexArray.length
            },
        }),

        uModelViewMatrix: mat4.create(),
        uSampler: APP.assets.textures.star,

        uLookAtMatrix: APP.camera.lookAtMatrix,
        uProjectionMatrix: APP.camera.projectionMatrix,

        uGlow: 2.3,
        uColor: vec4.fromValues(
            Math.random() / 4 + 0.7,
            Math.random() / 4 + 0.7,
            Math.random() / 4 + 0.7,
            1.0),
    };
    
    transform.position[0] = Math.random() * 400 - 200;
    transform.position[1] = Math.random() * 400 - 200;
    transform.position[2] = Math.random() * 400 - 200;
    
    transform.position[0] = 0;
    transform.position[1] = 0;
    transform.position[2] = 0;

    let scale = Math.random() * 5 + 0.7;
    transform.scale[0] = scale;
    transform.scale[1] = scale;
    transform.scale[2] = scale;

    rigidBody.angularVelocity[0] = Math.random() * 4 - 2;
    rigidBody.angularVelocity[1] = Math.random() * 4 - 2;
    rigidBody.angularVelocity[2] = Math.random() * 4 - 2;

    return {
        transform,
        rigidBody,
        shaderMaterial,
    };
}

export default {
    create,
};