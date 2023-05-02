const MAX_TEXTURES = 31;
let lastIndex = 0;

const BatchRendererData = {
    "modelCount": 0,
    "batchCount": 0,

    "arrays": {
        "updated": false,
        "vertex": [],
        "modelId": [],
        "index": []
    },
    "perModel": {
        "width": 6,
        "data": []
    },
    "batches": [],
    "shaderInfo": {
        "$shader": 0
    }
};


self.batch_log = () => {
    console.log(BatchRendererData);
}

const BatchRenderer = {
    init() {
        BatchRendererData.shaderInfo.$shader = APP.assets.batch.shader;
        BatchRendererData.shaderInfo.uDataSampler = APP.gl.createTexture();
        create_batch();
    },
    
    addModel(model) {
        if(lastIndex + model.indexArray[1] > 65535) {
            console.count("rebatch");
            rebuild_buffers();
            create_batch();
            lastIndex = 0;
        }
        
        let len = BatchRendererData.arrays.modelId.length;
        let iterator = model.vertexArray.length / 5;
        BatchRendererData.arrays.modelId.length += iterator;
        while(iterator--) BatchRendererData.arrays.modelId[len + iterator] = BatchRendererData.modelCount;

        combine_arrays(BatchRendererData.arrays.vertex, model.vertexArray);
        combine_arrays_mod(BatchRendererData.arrays.index, model.indexArray, lastIndex);

        combine_arrays(BatchRendererData.perModel.data, [
            // modelView
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1,
            1,1,1,1,
            1,0,0,0
        ]);

        lastIndex += model.indexArray[1] + 1;
        BatchRendererData.arrays.updated = true;
        return BatchRendererData.modelCount++;
    },

    updateModelData(modelId, data) {
        const offset = modelId * BatchRendererData.perModel.width * 4;
        let iterator = data.length;
        while(iterator--) BatchRendererData.perModel.data[offset + iterator] = data[iterator];
    },

    setUniforms({
        uLookAtMatrix,
        uProjectionMatrix,
        uSampler
    }) {
        Object.assign(BatchRendererData.shaderInfo, {
            uLookAtMatrix,
            uProjectionMatrix,
            uSampler
        });
    },

    render() {
        if(BatchRendererData.arrays.updated) rebuild_buffers();
        
        {
            const texture = BatchRendererData.shaderInfo.uDataSampler;
            const target = APP.gl.TEXTURE_2D;
            const level = 0;
            const xoffset = 0;
            const yoffset = 0;
            const width = BatchRendererData.perModel.width;
            const height = BatchRendererData.modelCount;
            const format = APP.gl.RGBA;
            const type = APP.gl.FLOAT;
            const data = new Float32Array(BatchRendererData.perModel.data);
            APP.gl.bindTexture(target, texture);
            APP.gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, data);
        }
        
        BatchRendererData.shaderInfo.$shader.set(BatchRendererData.shaderInfo);

        let batchIterator = BatchRendererData.batchCount;
        while(batchIterator--) {
            BatchRendererData.shaderInfo.$shader.set(BatchRendererData.batches[batchIterator]);
        
            APP.gl.bindBuffer(APP.gl.ELEMENT_ARRAY_BUFFER, BatchRendererData.batches[batchIterator].index.buffer);
            APP.gl.drawElements(APP.gl.TRIANGLES, BatchRendererData.batches[batchIterator].index.length, APP.gl.UNSIGNED_SHORT, 0);
        }
    }
};

function combine_arrays_mod(op0, op1, mod) {
    const len0 = op0.length;
    const len1 = op1.length;
    op0.length = len0 + len1;
    let iterator = len1;
    while(iterator--) op0[len0 + iterator] = op1[iterator] + mod;
}

function create_batch() {
    const batch_id = BatchRendererData.batchCount++;

    BatchRendererData.arrays.vertex = [];
    BatchRendererData.arrays.modelId = [];
    BatchRendererData.arrays.index = [];

    let vertexBuffer = APP.gl.createBuffer();

    BatchRendererData.batches[batch_id] = {
        "aVertexPosition": {
            "buffer": vertexBuffer,
            "size": 3,
            "stride": 20,
            "offset": 0
        },
        "aTextureCoord": {
            "buffer": vertexBuffer,
            "size": 2,
            "stride": 20,
            "offset": 12
        },
        "aModelId": {
            "buffer": APP.gl.createBuffer(),
            "size": 1,
        },
        "index": {
            "buffer": APP.gl.createBuffer(),
            "length": 0
        }
    };        
}
function rebuild_buffers() {
    APP.gl.bindBuffer(APP.gl.ARRAY_BUFFER, BatchRendererData.batches[BatchRendererData.batchCount - 1].aVertexPosition.buffer);
    APP.gl.bufferData(APP.gl.ARRAY_BUFFER, new Float32Array(BatchRendererData.arrays.vertex), APP.gl.DYNAMIC_DRAW);
    
    APP.gl.bindBuffer(APP.gl.ARRAY_BUFFER, BatchRendererData.batches[BatchRendererData.batchCount - 1].aModelId.buffer);
    APP.gl.bufferData(APP.gl.ARRAY_BUFFER, new Float32Array(BatchRendererData.arrays.modelId), APP.gl.DYNAMIC_DRAW);

    APP.gl.bindBuffer(APP.gl.ELEMENT_ARRAY_BUFFER, BatchRendererData.batches[BatchRendererData.batchCount - 1].index.buffer);
    APP.gl.bufferData(APP.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(BatchRendererData.arrays.index), APP.gl.STATIC_READ);
    BatchRendererData.batches[BatchRendererData.batchCount - 1].index.length = BatchRendererData.arrays.index.length;

    {
        const texture = BatchRendererData.shaderInfo.uDataSampler;
        const target = APP.gl.TEXTURE_2D;
        const level = 0;
        const internalFormat = APP.gl.RGBA32F;
        const width = BatchRendererData.perModel.width;
        const height = BatchRendererData.modelCount;
        const border = 0;
        const format = APP.gl.RGBA;
        const type = APP.gl.FLOAT;
        const data = new Float32Array(BatchRendererData.perModel.data);
        APP.gl.bindTexture(target, texture);
        APP.gl.texImage2D(target, level, internalFormat, width, height, border, format, type, data);

        APP.gl.texParameteri(target, APP.gl.TEXTURE_MIN_FILTER, APP.gl.NEAREST);
        APP.gl.texParameteri(target, APP.gl.TEXTURE_MAG_FILTER, APP.gl.NEAREST);
        APP.gl.texParameteri(target, APP.gl.TEXTURE_WRAP_S, APP.gl.CLAMP_TO_EDGE);
        APP.gl.texParameteri(target, APP.gl.TEXTURE_WRAP_T, APP.gl.CLAMP_TO_EDGE);
    }

    BatchRendererData.arrays.updated = false;
}

Object.freeze(BatchRenderer);
export default BatchRenderer;