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

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        };
        image.src = path;
        return {
            texture,
            slot: 0
        };
    };
    self.jShader = function(gl, source) {
        const vShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, source[0]);
        gl.compileShader(vShader);
        if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vShader));
            gl.deleteShader(vShader);
            return -1;
        }

        const fShader = gl.createShader(gl.FRAGMENT_SHADER);
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
                setters[info.name] = b => {
                    if (b.value) {
                        gl.disableVertexAttribArray(location);
                        gl['vertexAttrib'+b.value.length+'fv'](location, b.value);
                    } else {
                        gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                        gl.enableVertexAttribArray(location);
                        gl.vertexAttribPointer(location, b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
                    }
                }
            }
        }

        {
            let i = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            while(i--) {
                const info = gl.getActiveUniform(program, i);
                const location = gl.getUniformLocation(program, info.name);
                switch(info.type) {
                    case gl.FLOAT:
                        setters[info.name] = v => gl.uniform1fv(location, v.length >= 0 ? v : [v]);
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
                        setters[info.name] = v => gl.uniform1iv(location, v.length >= 0 ? v : [v]);
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
                    case gl.SAMPLER_CUBE:
                        setters[info.name] = (v) => {
                            gl.uniform1i(location, 0);
                            gl.activeTexture(gl.TEXTURE0);
                            gl.bindTexture(gl.TEXTURE_2D, v);
                        };
                        break;
                }
            }
        }
        return {
            program: program,
            set(values) {
                gl.useProgram(program);
                for(let i in values) if(setters[i]) setters[i](values[i]);
            }
        }
    };
    self.jBuffers = function(gl, arrays) {
        for(let i in arrays) {
            arrays[i].buffer = arrays[i].buffer ? arrays[i].buffer : gl.createBuffer();
            if(i === 'index') {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, arrays[i].buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrays[i].array), gl.STATIC_DRAW);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, arrays[i].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays[i].array), gl.STATIC_DRAW);
            }
        }
        return arrays;
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