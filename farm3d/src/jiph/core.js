// math things
{
    function axisCheck(sMin, sMax, oMin, oMax) {
        const O1 = sMin <= oMax && sMin >= oMin,
              O2 = oMin <= sMax && oMin >= sMin;
        if(O1 || O2) {
            const min1 = oMax - sMin,
                    min2 = oMin - sMax;
            if(min1 * min1 <= min2 * min2)
                return min1;
            return min2;
        }
        return 0;
    }
    function lineCheck(lineMin, lineMax, ) {
        let start = 0 * slope, 
            stop = (0 + 5) * slope;
    
        if(1 <= start && 1 + 5 >= start) return;
    }
    // returns minimum distance to correct the overlap
    self.rectOverlap = (aPos, aSize, bPos, bSize) => {
        const x = axisCheck(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
        const y = axisCheck(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);
    
        if(x * x < y * y) 
            return [x, 0];
        return [0, y];
    };
    // returns true if the rectangles have any common ground
    self.rectOverlaps = (aPos, aSize, bPos, bSize) => {
        return !(
            aPos[0] >= bPos[0] + bSize[0] ||
            aPos[0] + aSize[0] <= bPos[0] ||
            aPos[1] >= bPos[1] + bSize[1] ||
            aPos[1] + aSize[1] <= bPos[1]
        );
    };
    // returns minimum distance to contain rectangle b inside rectangle a
    self.rectContain = (aPos, aSize, bPos, bSize) => {
        const x = axisCheck(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
        const y = axisCheck(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);
    
        if(x * x < y * y) 
            return [x, 0];
        return [0, y];
    };
    // returns true if rectangle b is entirely contained within rectangle a 
    self.rectContains = (aPos, aSize, bPos, bSize) => {
        return !(
            aPos[0] >= bPos[0] ||
            aPos[0] + aSize[0] <= bPos[0] + bSize[0] ||
            aPos[1] >= bPos[1] ||
            aPos[1] + aSize[1] <= bPos[1] + bSize[1]
        );
    };
    
    self.lineRectOverlap = (linePos, lineVector, rectPos, rectSize) => {
        rectPos = [rectPos[0] - linePos[0], rectPos[1] - linePos[1]]; // Make rectPos relative to linePos
        lineVector = [lineVector[0] || 1e-50, lineVector[1] || 1e-50]; // Make sure no exact 0s --- probably needs to be changed
        const slope = lineVector[1] / lineVector[0];
        let out = 1;
    
        let yStart = rectPos[0] * slope, 
            yStop = (rectPos[0] + rectSize[0]) * slope, 
            xStart = rectPos[1] / slope, 
            xStop = (rectPos[1] + rectSize[1]) / slope;
    
        if(rectPos[1] <= yStart && rectPos[1] + rectSize[1] >= yStart)
            out = Math.min(out, yStart / lineVector[1]);
        if(rectPos[1] <= yStop && rectPos[1] + rectSize[1] >= yStop)
            out = Math.min(out, yStop / lineVector[1]);
        if(rectPos[0] <= xStart && rectPos[0] + rectSize[0] >= xStart)
            out = Math.min(out, xStart / lineVector[0]);
        if(rectPos[0] <= xStop && rectPos[0] + rectSize[0] >= xStop)
            out = Math.min(out, xStop / lineVector[0]);
    
        if (out >= 0) 
            return out;
        return 1;
    };

    self.lineRectOverlaps = (linePos, lineVector, rectPos, rectSize) => {
        rectPos = [rectPos[0] - linePos[0], rectPos[1] - linePos[1]]; // Make rectPos relative to linePos
        lineVector = [lineVector[0] || 1e-50, lineVector[1] || 1e-50]; // Make sure no exact 0s --- probably needs to be changed
        const slope = lineVector[1] / lineVector[0];
        let out = 1;
    
        let yStart = rectPos[0] * slope, 
            yStop = (rectPos[0] + rectSize[0]) * slope, 
            xStart = rectPos[1] / slope, 
            xStop = (rectPos[1] + rectSize[1]) / slope;
    
        if(rectPos[1] <= yStart && rectPos[1] + rectSize[1] >= yStart)
            out = Math.min(out, yStart / lineVector[1]);
        if(rectPos[1] <= yStop && rectPos[1] + rectSize[1] >= yStop)
            out = Math.min(out, yStop / lineVector[1]);
        if(rectPos[0] <= xStart && rectPos[0] + rectSize[0] >= xStart)
            out = Math.min(out, xStart / lineVector[0]);
        if(rectPos[0] <= xStop && rectPos[0] + rectSize[0] >= xStop)
            out = Math.min(out, xStop / lineVector[0]);
    
        return !(out < 0 || out > 1);
    };
    // returns minimum distance to correct the overlap
    self.boxOverlap = (aPos, aSize, bPos, bSize) => {
      const x = axisCheck(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
      const y = axisCheck(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);
      const z = axisCheck(aPos[2], aPos[2] + aSize[2], bPos[2], bPos[2] + bSize[2]);
    
      if(Math.min(x * x, y * y, z * z) === x * x)
          return [x, 0, 0];
      if(Math.min(x * x, y * y, z * z) === y * y)
          return [0, y, 0];
      return [0, 0, z];
    };
    // returns true if the boxes have any common ground
    self.boxOverlaps = (aPos, aSize, bPos, bSize) => {
      return !(
          aPos[0] >= bPos[0] + bSize[0] ||
          aPos[0] + aSize[0] <= bPos[0] ||
          aPos[1] >= bPos[1] + bSize[1] ||
          aPos[1] + aSize[1] <= bPos[1] ||
          aPos[2] >= bPos[2] + bSize[2] ||
          aPos[2] + aSize[2] <= bPos[2]
      );
    };
    // returns true if box b is entirely contained within box a 
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
    
    self.rayBoxOverlap = (rayPos, rayVector, boxPos, boxSize) => {
        boxPos = [boxPos[0] - rayPos[0], boxPos[1] - rayPos[1], boxPos[2] - rayPos[2]]; // Make boxPos relative to rayPos
        rayVector = [rayVector[0] || 1e-50, rayVector[1] || 1e-50, rayVector[2] || 1e-50]; // Make sure no exact 0s
        const slopeYX = rayVector[1] / rayVector[0];
        const slopeZX = rayVector[2] / rayVector[0];
        let out = 1;
    
        let z1 = boxPos[0] * slopeZX, 
            z2 = (boxPos[0] + boxSize[0]) * slopeZX, 
            y1 = boxPos[0] * slopeYX, 
            y2 = (boxPos[0] + boxSize[0]) * slopeYX, 
            x1 = boxPos[1] / slopeYX,  
            x2 = (boxPos[1] + boxSize[1]) / slopeYX;


        if(boxPos[0] <= z1 && boxPos[0] + boxSize[0] >= z1)
            out = Math.min(out, z1 / rayVector[0]);
        if(boxPos[0] <= z2 && boxPos[0] + boxSize[0] >= z2)
            out = Math.min(out, z2 / rayVector[0]);
        if(boxPos[1] <= y1 && boxPos[1] + boxSize[1] >= y1)
            out = Math.min(out, y1 / rayVector[1]);
        if(boxPos[1] <= y2 && boxPos[1] + boxSize[1] >= y2)
            out = Math.min(out, y2 / rayVector[1]);
        if(boxPos[0] <= x1 && boxPos[0] + boxSize[0] >= x1)
            out = Math.min(out, x1 / rayVector[0]);
        if(boxPos[0] <= x2 && boxPos[0] + boxSize[0] >= x2)
            out = Math.min(out, x2 / rayVector[0]);
    
        if (out >= 0) 
            return out;
        return 1;
    };

    self.rayBoxOverlaps = (rayPos, rayVector, boxPos, boxSize) => {
        boxPos = [boxPos[0] - rayPos[0], boxPos[1] - rayPos[1], boxPos[2] - rayPos[2]]; // Make boxPos relative to rayPos
        rayVector = [rayVector[0] || 1e-50, rayVector[1] || 1e-50, rayVector[2] || 1e-50]; // Make sure no exact 0s
        const slopeYX = rayVector[1] / rayVector[0];
        const slopeZX = rayVector[2] / rayVector[0];
        let out = 1;
    
        let z1 = boxPos[0] * slopeZX, 
            z2 = (boxPos[0] + boxSize[0]) * slopeZX, 
            y1 = boxPos[0] * slopeYX, 
            y2 = (boxPos[0] + boxSize[0]) * slopeYX, 
            x1 = boxPos[1] / slopeYX,  
            x2 = (boxPos[1] + boxSize[1]) / slopeYX;
    
            
        if(boxPos[0] <= z1 && boxPos[0] + boxSize[0] >= z1)
            out = Math.min(out, z1 / rayVector[0]);
        if(boxPos[0] <= z2 && boxPos[0] + boxSize[0] >= z2)
            out = Math.min(out, z2 / rayVector[0]);
        if(boxPos[1] <= y1 && boxPos[1] + boxSize[1] >= y1)
            out = Math.min(out, y1 / rayVector[1]);
        if(boxPos[1] <= y2 && boxPos[1] + boxSize[1] >= y2)
            out = Math.min(out, y2 / rayVector[1]);
        if(boxPos[0] <= x1 && boxPos[0] + boxSize[0] >= x1)
            out = Math.min(out, x1 / rayVector[0]);
        if(boxPos[0] <= x2 && boxPos[0] + boxSize[0] >= x2)
            out = Math.min(out, x2 / rayVector[0]);
    
        return !(out < 0 || out > 1);
    };
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
        return texture;
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
        let out = {};
        for(let i in arrays) { 
            out[i] = {...arrays[i]};
            delete(out[i].array);
            out[i].buffer = gl.createBuffer();
            if(i === 'index') {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out[i].buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrays[i].array), gl.STATIC_DRAW);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, out[i].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays[i].array), gl.STATIC_DRAW);
            }
        }
        return out;
    };

    // todo
    self.jBatchRenderer = {        
        init() {
            
        },

        beginBatch() {

        },

        endBatch() {

        },

        flush() {

        },

        draw() {
            
        }
    };
    Object.freeze(self.jBatchRenderer);
}
