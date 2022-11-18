import "../jiph/core.js"

const Level = {
    create() {
        return {
            "spawnableAreas": [],
            
            "shaderMaterial": {},
        }
    },

    load(out, gl, { camera }) {
        let texture = jTexture(gl,'assets/textures/ground.png');
        let modelView = mat4.create();
        mat4.translate(modelView, modelView, vec3.fromValues(-1024, 0, -1024));
        
        out.shaderMaterial = {
            ...jBuffers(gl, {
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

            uLookAtMatrix: camera.lookAtMatrix,
            uProjectionMatrix: camera.projectionMatrix
        };
        out.spawnableAreas = APP.assets.models.level1.spawnableAreas;
    },

    update(out, dt = 1) {
        
    },
    
    draw(out, gl) {

        APP.assets.shaders.level.set(out.shaderMaterial);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out.shaderMaterial.index.buffer);
        gl.drawElements(gl.TRIANGLES, out.shaderMaterial.index.length, gl.UNSIGNED_SHORT, 0);
    }
};

Object.freeze(Level);
export default Level;