function create(gl) {
    let shader = {};
    let properties = {
        "aVertexPosition": {
            "buffer": gl.createBuffer(),
            "size": 3,
        },
        "aTextureCoord": {
            "buffer": gl.createBuffer(),
            "size": 2,
        },
    
        "index": {
            "buffer": gl.createBuffer(),
            "length": 0
        },
        "instanceData": { 
            "buffer": gl.createBuffer() 
        }
    };

    let instance_data = MappedChunkedArray.create(21);
    let instance_updated = true;

    return {
        properties,
        
        instance_data,
        instance_updated,

        setModel(gl, model) {
            gl.bindBuffer(gl.ARRAY_BUFFER, properties.aVertexPosition.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, model.vertexPositionArray, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, properties.aTextureCoord.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, model.textureCoordArray, gl.STATIC_DRAW);
    
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, properties.index.buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indexArray, gl.STATIC_READ);
            properties.index.length = model.indexArray.length;
            return this;
        },
        setShader(in_shader) {
            shader = in_shader;
            return this;
        },
        setProperties(in_properties) {
            Object.assign(properties, in_properties);
            return this;
        },

        draw(gl, scene_properties) {
            if(this.instance_updated) {
                gl.bindBuffer(gl.ARRAY_BUFFER, properties.instanceData.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, instance_data.get_values(), gl.DYNAMIC_DRAW);
                
                this.instance_updated = false;
            };

            shader.set(scene_properties);
            shader.set(properties);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, properties.aVertexPosition.buffer);
            gl.vertexAttribPointer(6, properties.aVertexPosition.size, gl.FLOAT, false, properties.aVertexPosition.size * 4, 0);
            gl.enableVertexAttribArray(6);
            gl.bindBuffer(gl.ARRAY_BUFFER, properties.aTextureCoord.buffer);
            gl.vertexAttribPointer(7, properties.aTextureCoord.size, gl.FLOAT, false, properties.aTextureCoord.size * 4, 0);
            gl.enableVertexAttribArray(7);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, properties.instanceData.buffer);
            gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 84, 0);
            gl.vertexAttribDivisor(0, 1);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 84, 16);
            gl.vertexAttribDivisor(1, 1);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 84, 32);
            gl.vertexAttribDivisor(2, 1);
            gl.enableVertexAttribArray(2);
            gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 84, 48);
            gl.vertexAttribDivisor(3, 1);
            gl.enableVertexAttribArray(3);
            
            gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 84, 64);
            gl.vertexAttribDivisor(4, 1);
            gl.enableVertexAttribArray(4);
            
            gl.vertexAttribPointer(5, 1, gl.FLOAT, false, 84, 80);
            gl.vertexAttribDivisor(5, 1);
            gl.enableVertexAttribArray(5);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, properties.index.buffer);
            gl.drawElementsInstanced(gl.TRIANGLES, properties.index.length, gl.UNSIGNED_SHORT, 0, instance_data.length);
        }
    };
};

const RenderObject = {
    create,
};
Object.freeze(RenderObject);
export default RenderObject; 