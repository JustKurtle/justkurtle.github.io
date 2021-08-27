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

self.Level = {
    create() {
        return {
            "shader": shader,
            "rMat": {},

            "spawnableAreas": []
        }
    },

    load(level, gl, { path, camera }) {
        if(!shader) { shader = jShader(gl, shaderSrc); level.shader = shader; }
        fetch(path)
            .then(response => response.json())
            .then(data => {
                let texture = jTexture(gl,'assets/ground.png');
                level.rMat = {
                    ...jBuffers(gl, {
                        aVertexPosition: { 
                            array: data.vertexArray, 
                            size: 3
                        },
                        aTextureCoord: { 
                            array: data.texCoordArray,
                            size: 2
                        },
                        index: { 
                            array: data.indexArray, 
                            size: 3, 
                            length: data.indexArray.length
                        },
                    }),
                    uModelViewMatrix: new Mat4(),
                    uSampler: texture,
    
                    uLookAtMatrix: camera.lookAt,
                    uProjectionMatrix: camera.projection
                };
            });
    },
    
    draw(level, gl) {
        if(!level.rMat.index) return; // if there is no index buffer, exit
        level.shader.set(level.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, level.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, level.rMat.index.length, gl.UNSIGNED_SHORT, 0);
    }
};