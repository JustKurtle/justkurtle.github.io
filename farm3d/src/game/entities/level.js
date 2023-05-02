import "../../jiph/core.js"

const Level = {
    create() {
        return {
            "levelData" : {
                "spawnableAreas": [],
                "cows": [],
            },
            
            "shaderMaterial": {},
        }
    },

    init(out) {
        let texture = APP.assets.textures.ground;
        let modelView = mat4.create();
        mat4.translate(modelView, modelView, vec3.fromValues(-1024, 0, -1024));
        
        out.shaderMaterial = {
            $shader: APP.assets.shaders.level,
            ...jBuffers(APP.gl, {
                aVertexPosition: { 
                    array: APP.assets.models.level1.vertexArray, 
                    size: 3
                },
                aTextureCoord: { 
                    array: APP.assets.models.level1.texCoordArray,
                    size: 2
                },
                index: { 
                    array: APP.assets.models.level1.indexArray, 
                    size: 3, 
                    length: APP.assets.models.level1.indexArray.length
                },
            }),
            
            uModelViewMatrix: modelView,
            uSampler: texture,
            uColor: vec4.fromValues(0.5, 1.0, 0.5, 1.0),

            uLookAtMatrix: APP.camera.lookAtMatrix,
            uProjectionMatrix: APP.camera.projectionMatrix
        };
        out.spawnableAreas = APP.assets.models.level1.spawnableAreas;
    },
    
    draw({ shaderMaterial }) {
        shaderMaterial.$shader.set(shaderMaterial);
        APP.gl.bindBuffer(APP.gl.ELEMENT_ARRAY_BUFFER, shaderMaterial.index.buffer);
        APP.gl.drawElements(APP.gl.TRIANGLES, shaderMaterial.index.length, APP.gl.UNSIGNED_SHORT, 0);
    }
};

Object.freeze(Level);
export default Level;