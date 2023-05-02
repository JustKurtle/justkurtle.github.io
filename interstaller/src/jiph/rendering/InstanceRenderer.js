const InstanceRendererData = {
    "instanceCount": 0,

    "arrays": {
        "updated": false,
        "instanceDataArray": MappedChunkedArray.create(21),
    },
    "shaderInfo": {
        "$shader": 0
    }
};

const InstanceRenderer = {
    init() {
        Object.assign(InstanceRendererData.shaderInfo, {
            "$shader": APP.assets.instance.shader,
            "aVertex": {
                "buffer": APP.gl.createBuffer(),
                "size": 3,
            },
            "index": {
                "buffer": APP.gl.createBuffer(),
                "length": 0
            },
    
            "instanceData": { "buffer": APP.gl.createBuffer() }
        });
    },
    
    setModel(model) {
        APP.gl.bindBuffer(APP.gl.ARRAY_BUFFER, InstanceRendererData.shaderInfo.aVertex.buffer);
        APP.gl.bufferData(APP.gl.ARRAY_BUFFER, new Float32Array(model.vertexArray), APP.gl.STATIC_DRAW);

        APP.gl.bindBuffer(APP.gl.ELEMENT_ARRAY_BUFFER, InstanceRendererData.shaderInfo.index.buffer);
        APP.gl.bufferData(APP.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indexArray), APP.gl.STATIC_READ);
        InstanceRendererData.shaderInfo.index.length = model.indexArray.length;
    },
    
    addInstance(data) {
        InstanceRendererData.arrays.updated = true;
        return InstanceRendererData.arrays.instanceDataArray.add(data);
    },
    removeInstance(instanceId) {
        InstanceRendererData.arrays.updated = true;
        return InstanceRendererData.arrays.instanceDataArray.remove(instanceId);
    },

    updateInstance(instanceId, data) {
        InstanceRendererData.arrays.updated = true;
        InstanceRendererData.arrays.instanceDataArray.set(instanceId, data);
    },

    setUniforms({ uLookAtMatrix, uProjectionMatrix, uSampler }) {
        Object.assign(InstanceRendererData.shaderInfo, {
            uLookAtMatrix,
            uProjectionMatrix,
            uSampler
        });
    },

    render() {
        if(InstanceRendererData.arrays.updated) rebuild_buffers(InstanceRendererData);
        InstanceRendererData.shaderInfo.$shader.set(InstanceRendererData.shaderInfo);

        APP.gl.bindBuffer(APP.gl.ARRAY_BUFFER, InstanceRendererData.shaderInfo.aVertex.buffer);
        {
            APP.gl.vertexAttribPointer(6, 3, APP.gl.FLOAT, false, 20, 0);
            APP.gl.enableVertexAttribArray(6);

            APP.gl.vertexAttribPointer(7, 2, APP.gl.FLOAT, false, 20, 12);
            APP.gl.enableVertexAttribArray(7);
        }

        APP.gl.bindBuffer(APP.gl.ARRAY_BUFFER, InstanceRendererData.shaderInfo.instanceData.buffer);
        {
            APP.gl.vertexAttribPointer(0, 4, APP.gl.FLOAT, false, 84, 0);
            APP.gl.vertexAttribDivisor(0, 1);
            APP.gl.enableVertexAttribArray(0);
            APP.gl.vertexAttribPointer(1, 4, APP.gl.FLOAT, false, 84, 16);
            APP.gl.vertexAttribDivisor(1, 1);
            APP.gl.enableVertexAttribArray(1);
            APP.gl.vertexAttribPointer(2, 4, APP.gl.FLOAT, false, 84, 32);
            APP.gl.vertexAttribDivisor(2, 1);
            APP.gl.enableVertexAttribArray(2);
            APP.gl.vertexAttribPointer(3, 4, APP.gl.FLOAT, false, 84, 48);
            APP.gl.vertexAttribDivisor(3, 1);
            APP.gl.enableVertexAttribArray(3);

            APP.gl.vertexAttribPointer(4, 4, APP.gl.FLOAT, false, 84, 64);
            APP.gl.vertexAttribDivisor(4, 1);
            APP.gl.enableVertexAttribArray(4);

            APP.gl.vertexAttribPointer(5, 1, APP.gl.FLOAT, false, 84, 80);
            APP.gl.vertexAttribDivisor(5, 1);
            APP.gl.enableVertexAttribArray(5);
        }
    
        APP.gl.bindBuffer(APP.gl.ELEMENT_ARRAY_BUFFER, InstanceRendererData.shaderInfo.index.buffer);
        APP.gl.drawElementsInstanced(APP.gl.TRIANGLES, InstanceRendererData.shaderInfo.index.length, APP.gl.UNSIGNED_SHORT, 0, InstanceRendererData.arrays.instanceDataArray.length);
    }
};

function rebuild_buffers() {
    APP.gl.bindBuffer(APP.gl.ARRAY_BUFFER, InstanceRendererData.shaderInfo.instanceData.buffer);
    APP.gl.bufferData(APP.gl.ARRAY_BUFFER, InstanceRendererData.arrays.instanceDataArray.get_values(), APP.gl.DYNAMIC_DRAW);

    InstanceRendererData.arrays.updated = false;
}

Object.freeze(InstanceRenderer);
export default InstanceRenderer;