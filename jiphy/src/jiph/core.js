// math things
{
    function check(sMin, sMax, oMin, oMax) {
        const O1 = sMin <= oMax && sMin >= oMin,
              O2 = oMin <= sMax && oMin >= sMin;
        if(O1 || O2) {
            const min1 = oMax - sMin,
                  min2 = oMin - sMax;
            return (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
        }
        return null;
    }

    // returns minimum distance to correct the overlap
    self.rectOverlap = (aPos, aSize, bPos, bSize) => {
        const x = check(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
        const y = check(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);

        switch(Math.min(x * x, y * y)) {
            case x * x: 
                return [x, 0];
            case y * y:
                return [0, y];
            default:
                return [0, 0];
        }
    };
    // returns true if the rectangles have any common ground
    self.rectOverlaps = (aPos, aSize, bPos, bSize) => {
        return !(
            aPos[0] >= bPos[0] + bSize[0] ||
            aPos[0] + aSize[0] <= bPos[0] ||
            aPos[1] >= bPos[1] + bSize[1] ||
            aPos[1] + aSize[1] <= bPos[1]
        );
    }
    // returns true if rectangle b is entirely contained within rectangle a 
    self.rectContains = (aPos, aSize, bPos, bSize) => {
        return !(
            aPos[0] >= bPos[0] ||
            aPos[0] + aSize[0] <= bPos[0] + bSize[0] ||
            aPos[1] >= bPos[1] ||
            aPos[1] + aSize[1] <= bPos[1] + bSize[1]
        );
    }

    self.lineRectOverlap = (linePos, lineVector, rectPos, rectSize) => {
        const normals = [
            [lineVector[1] / Math.hypot(...lineVector), -lineVector[0] / Math.hypot(...lineVector)],
            [1, 0],
            [0, 1]
        ];
        const c = [ // the rectangle's corners
            [rectPos[0], rectPos[1]],
            [rectPos[0], rectPos[1] + rectSize[1]],
            [rectPos[0] + rectSize[0], rectPos[1] + rectSize[1]],
            [rectPos[0] + rectSize[0], rectPos[1]]
        ];
        let solution = [Infinity, Infinity];
        
        for(let i = normals.length;i--;) {
            let n = normals[i];
            let lineProjections = [
                linePos[0] * n[0] + linePos[1] * n[1],
                (linePos[0] + lineVector[0]) * n[0] + (linePos[1] + lineVector[1]) * n[1]
            ].sort((a, b) => a - b);
            let rectProjections = [
                c[0][0] * n[0] + c[0][1] * n[1],
                c[1][0] * n[0] + c[1][1] * n[1],
                c[2][0] * n[0] + c[2][1] * n[1],
                c[3][0] * n[0] + c[3][1] * n[1]
            ].sort((a, b) => a - b);

            let O1 = rectProjections[0] <= lineProjections[1] && rectProjections[0] >= lineProjections[0],
                O2 = lineProjections[0] <= rectProjections[3] && lineProjections[0] >= rectProjections[0];
            if(O1 || O2) {
                const min1 = lineProjections[1] - rectProjections[0],
                    min2 = lineProjections[0] - rectProjections[3];
                const a = (Math.abs(min1) <= Math.abs(min2)) ? rectProjections[0] : rectProjections[3];
                solution[0] = a - linePos[0];
                solution[1] = a - linePos[1];
            } else {
                return lineVector;
            }
        }

        return solution;
    }
    self.lineRectOverlaps = (linePos, lineVector, rectPos, rectSize) => {
        const normals = [
            [lineVector[1] / Math.hypot(...lineVector), -lineVector[0] / Math.hypot(...lineVector)],
            [1, 0],
            [0, 1]
        ];
        const c = [ // the rectangle's corners
            [rectPos[0], rectPos[1]],
            [rectPos[0], rectPos[1] + rectSize[1]],
            [rectPos[0] + rectSize[0], rectPos[1] + rectSize[1]],
            [rectPos[0] + rectSize[0], rectPos[1]]
        ];

        for(let n of normals) {
            let lineProjections = [
                linePos[0] * n[0] + linePos[1] * n[1],
                (linePos[0] + lineVector[0]) * n[0] + (linePos[1] + lineVector[1]) * n[1]
            ].sort((a, b) => a - b);
            let rectProjections = [
                c[0][0] * n[0] + c[0][1] * n[1],
                c[1][0] * n[0] + c[1][1] * n[1],
                c[2][0] * n[0] + c[2][1] * n[1],
                c[3][0] * n[0] + c[3][1] * n[1]
            ].sort((a, b) => a - b);

            if(!(rectProjections[0] <= lineProjections[1] && rectProjections[0] >= lineProjections[0] ||
                lineProjections[0] <= rectProjections[3] && lineProjections[0] >= rectProjections[0])) {
                return false;
            }
        }
        return true;
    }
    // returns minimum distance to correct the overlap
    self.boxOverlap = (aPos, aSize, bPos, bSize) => {
        const x = check(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
        const y = check(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);
        const z = check(aPos[2], aPos[2] + aSize[2], bPos[2], bPos[2] + bSize[2]);

        switch(Math.min(x * x, y * y, z * z)) {
            case x * x:
                return [x, 0, 0];
            case y * y:
                return [0, y, 0];
            case z * z:
                return [0, 0, z];
            default:
                return [0, 0, 0];
        }
    };
    self.boxOverlaps = (aPos, aSize, bPos, bSize) => {
        return !(
            aPos[0] >= bPos[0] + bSize[0] ||
            aPos[0] + aSize[0] <= bPos[0] ||
            aPos[1] >= bPos[1] + bSize[1] ||
            aPos[1] + aSize[1] <= bPos[1] ||
            aPos[2] >= bPos[2] + bSize[2] ||
            aPos[2] + aSize[2] <= bPos[2]
        );
    }
    self.boxContains = (aPos, aSize, bPos, bSize) => {
        return !(
            aPos[0] >= bPos[0] ||
            aPos[0] + aSize[0] <= bPos[0] + bSize[0] ||
            aPos[1] >= bPos[1] ||
            aPos[1] + aSize[1] <= bPos[1] + bSize[1] ||
            aPos[2] >= bPos[2] ||
            aPos[2] + aSize[2] <= bPos[2] + bSize[2]
        );
    }
}

// gl things
{
    self.jTexture = function(gl, path) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([255, 0, 255, 255]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, 1, 1, 0, srcFormat, srcType, pixel);

        const image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src = path;
        
        return texture;
    };
    self.jShader = function(gl, source) {
        const vShader = gl.createShader(gl.VERTEX_SHADER);
        const fShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vShader, source[0]);
        gl.compileShader(vShader);
        if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vShader));
            gl.deleteShader(vShader);
            return -1;
        }
        
        gl.shaderSource(fShader, source[1]);
        gl.compileShader(fShader);
        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fShader));
            gl.deleteShader(fShader);
            return -2;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);

        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getShaderInfoLog(program));
            return -3;
        }

        let setters = {};
        {
            let i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            while(i--) {
                const info = gl.getActiveAttrib(program, i);
                const location = gl.getAttribLocation(program, info.name);
                switch(info.type) {
                    case gl.FLOAT:
                    case gl.FLOAT_VEC2:
                    case gl.FLOAT_VEC3:
                    case gl.FLOAT_VEC4:
                        setters[info.name] = b => {
                            gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                            gl.enableVertexAttribArray(location);
                            gl.vertexAttribPointer(location, b.size, gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
                        }
                        break;
                }
            }
        }
        let openTextureSlot = 0;
        {
            let i = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            while(i--) {
                const info = gl.getActiveUniform(program, i);
                const location = gl.getUniformLocation(program, info.name);
                switch(info.type) {
                    case gl.FLOAT:
                        setters[info.name] = v => gl.uniform1fv(location, v.length ? v : [v]);
                        break;
                    case gl.FLOAT_VEC2:
                        setters[info.name] = v => gl.uniform2fv(location, v);
                        break;
                    case gl.FLOAT_VEC3:
                        setters[info.name] = v => gl.uniform3fv(location, v);
                        break;
                    case gl.FLOAT_VEC4:
                        setters[info.name] = v => gl.uniform4fv(location, v);
                        break;
                    case gl.INT:
                    case gl.BOOL:
                        setters[info.name] = v => gl.uniform1iv(location, v.length ? v : [v]);
                        break;
                    case gl.INT_VEC2:
                    case gl.BOOL_VEC2:
                        setters[info.name] = v => gl.uniform2iv(location, v);
                        break;
                    case gl.INT_VEC3:
                    case gl.BOOL_VEC3:
                        setters[info.name] = v => gl.uniform3iv(location, v);
                        break;
                    case gl.INT_VEC4:
                    case gl.BOOL_VEC4:
                        setters[info.name] = v => gl.uniform4iv(location, v);
                        break;
                    case gl.FLOAT_MAT2:
                        setters[info.name] = v => gl.uniformMatrix2fv(location, true, v);
                        break;
                    case gl.FLOAT_MAT3:
                        setters[info.name] = v => gl.uniformMatrix3fv(location, true, v);
                        break;
                    case gl.FLOAT_MAT4:
                        setters[info.name] = v => gl.uniformMatrix4fv(location, true, v);
                        break;
                    case gl.SAMPLER_2D:
                        setters[info.name] = v => {
                            gl.uniform1i(location, openTextureSlot);
                            gl.activeTexture(gl.TEXTURE0 + openTextureSlot++);
                            gl.bindTexture(gl.TEXTURE_2D, v);
                        };
                        break;
                    case gl.SAMPLER_CUBE:
                        setters[info.name] = v => {
                            gl.uniform1i(location, 0);
                            gl.bindTexture(gl.TEXTURE_2D, v);
                            gl.activeTexture(gl.TEXTURE0);
                        };
                        break;
                }
            }
        }
        return {
            program: program,
            set(values) {
                gl.useProgram(program);
                for(let key in values) 
                    if(setters[key]) setters[key](values[key]);
                openTextureSlot = 0;
            }
        }
    };
    self.jBuffers = function(gl, arrays) {
        let out = {};
        for(let i in arrays) { 
            out[i] = {...arrays[i]};
            delete(out[i].array);
            out[i].buffer = gl.createBuffer();
            if(i === 'index') {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out[i].buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrays[i].array), gl.DYNAMIC_DRAW);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, out[i].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays[i].array), gl.DYNAMIC_DRAW);
            }
        }
        return out;
    };
}

// fun utilities
{
    self.speed_test = (name, callback, scale = 2000000) => {
        console.time(name);
        while(scale--) callback(scale);
        console.timeEnd(name);
    };
}

// speed utilities
{
    self.combine_arrays = (array0, array1) => {
        const length0 = array0.length;
        const length1 = array1.length;
        array0.length = length0 + length1;
        let iterator = length1;
        while(iterator--) array0[length0 + iterator] = array1[iterator];
        return array0;
    };

    self.MappedArray = {
        create() {
            let keys = {};
            let keyorder = [];
            let values = [];

            let nextkey = 0;

            return {
                length: 0,

                add(value) {
                    let index = this.length++;
                    
                    keys[nextkey] = index;
                    keyorder[index] = nextkey;

                    values[index] = value;

                    return nextkey++;
                },
                remove(key) {
                    let index = keys[key];
                    let value = values[index];

                    keys[keyorder[this.length--]] = index;
                    keys[key] = undefined;
                    
                    values[index] = values.pop();
                    keyorder[index] = keyorder.pop();

                    return value;
                },

                erase() {
                    values = [];
                    keys = {};
                    keyorder = [];
                    nextkey = 0;
                    this.length = 0;
                },
            
                get(key) { return values[keys[key]]; },
                set(key, value) { values[keys[key]] = value; },

                get_values() { return values; },
                get_keys() { return keyorder; }
            }
        },
    };
    
    self.MappedChunkedArray = {
        create(subdata_size = 1, expected_elements = 100) {
            let keys = {};
            let keyorder = [];
            let values = new Float32Array(subdata_size * expected_elements);
            
            let nextkey = 0;
            
            let size = expected_elements;
            let expand_step = 100;
            
            return {
                length: 0,
                
                add(data) {
                    let index = this.length++;
                    
                    if (this.length > size) {
                        values = ((array0, array1) => {
                            const length0 = array0.length;
                            const length1 = array1.length;
                            let iterator = length1;
                            while(iterator--) array0[length0 + iterator] = array1[iterator];
                            return array0;
                        })(new Float32Array(values.length + subdata_size * expand_step), values);

                        size += expand_step;
                    }
                    
                    keys[nextkey] = index;
                    keyorder[index] = nextkey;
                    
                    const offset = index * subdata_size;
                    let iterator = subdata_size;
                    while(iterator--) values[offset + iterator] = data[iterator];
                    
                    return nextkey++;
                },
                remove(key) {
                    let index = keys[key];
                    
                    keys[keyorder[this.length--]] = index;
                    keys[key] = undefined;
                    
                    const offset = index * subdata_size;
                    let iterator = subdata_size;
                    while(iterator--) values[offset + iterator] = values[values.length - subdata_size + iterator];
                    
                    keyorder[index] = keyorder.pop();
                },
                
                erase() {
                    values = [];
                    keys = {};
                    keyorder = [];
                    nextkey = 0;
                    this.length = 0;
                },
                
                get(key) { return values.slice(keys[key] * subdata_size, subdata_size); },
                set(key, data) {
                    const offset = keys[key] * subdata_size;
                    let iterator = subdata_size;
                    while(iterator--) values[offset + iterator] = data[iterator];
                },
                
                get_values() { return values; },
                get_keys() { return keyorder; }
            }
        },
    };
}