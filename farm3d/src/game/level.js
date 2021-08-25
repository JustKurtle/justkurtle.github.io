import "../jiph/core.js"
import "../jiph/math.js"

self.Level = class Level {
    constructor(shader) {
        this.shader = shader;

        this.indexLength = 0;
        this.rMat = {};
    }

    load(gl) {        
        let texture = jTexture(gl,'assets/ground.png');
        let worker = new Worker('workers/terrainloader.js');
        worker.addEventListener('message', message => {
            console.log(message.data)
            this.indexLength = message.data[2].length;
            this.rMat = {
                ...jBuffers(gl, {
                    aVertexPosition: { 
                        array: message.data[0], 
                        size: 3
                    },
                    aTextureCoord: { 
                        array: message.data[1],
                        size: 2
                    },
                    index: { 
                        array: message.data[2], 
                        size: 3
                    },
                }),
                uModelViewMatrix: new Mat4().t([0,0,0]),
                uSampler: texture,
            };
        });
        worker.postMessage([32, 32]);
    }
    
    draw(gl) {
        if(!this.rMat.index) return;
        this.shader.set(this.rMat);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rMat.index.buffer);
        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
    }
};