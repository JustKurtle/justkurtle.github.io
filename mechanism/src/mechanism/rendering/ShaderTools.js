const TRANSPOSE = true;

let textureSlot = 0;
function buildShader(gl, source) {
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, source[0]);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        let err = "vertex shader compile error: " + gl.getShaderInfoLog(vShader);
        gl.deleteShader(vShader);
        throw new Error(err);
    }
    
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, source[1]);
    gl.compileShader(fShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        let err = "fragment shader compile error: " + gl.getShaderInfoLog(fShader);
        gl.deleteShader(fShader);
        throw new Error(err);
    }
    
    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let err = "shader program link error: " + gl.getShaderInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(err);
    }
    
    let setters = {};
    createAttribSetters(gl, program, setters);
    createUniformSetters(gl, program, setters);

    return {
        program,
        set(values) {
            gl.useProgram(program);
            for(let i in values) if(setters[i]) setters[i](values[i]);
            if(values["index"]) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, values.index.buffer);
                gl.drawElements(gl.TRIANGLES, values.index.length, gl.UNSIGNED_SHORT, 0);
            }
            textureSlot = 0;
        }
    };
}

function createAttribSetters(gl, program, setters) {
    let i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    while(i--) {
        const info = gl.getActiveAttrib(program, i);
        const location = gl.getAttribLocation(program, info.name);
        
        let divisor;
        
        divisor = div => divisor = div ? (div, offset) => gl.vertexAttribDivisor(location + offset, div) : () => {};
        switch(info.type) {
            case gl.FLOAT:
                setters[info.name] = b => {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, 1, gl.FLOAT, false, b.stride, b.offset);
                    divisor(b.divisor, 0);
                };
                break;
            case gl.FLOAT_VEC2:
                setters[info.name] = b => {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, b.stride, b.offset);
                    divisor(b.divisor, 0);
                };
                break;
            case gl.FLOAT_VEC3:
            case gl.FLOAT_VEC4:
                setters[info.name] = b => {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, b.stride, b.offset);
                    divisor(b.divisor, 0);
                };
                break;
            case gl.FLOAT_MAT4:
                setters[info.name] = b => {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, 4, gl.FLOAT, false, b.stride, b.offset);
                    gl.vertexAttribPointer(location + 1, 4, gl.FLOAT, false, b.stride, b.offset + 16);
                    gl.vertexAttribPointer(location + 2, 4, gl.FLOAT, false, b.stride, b.offset + 32);
                    gl.vertexAttribPointer(location + 3, 4, gl.FLOAT, false, b.stride, b.offset + 48);
                    divisor(b.divisor, 0);
                    divisor(b.divisor, 1);
                    divisor(b.divisor, 2);
                    divisor(b.divisor, 3);
                };
                break;
        }
    }
    setters["index"] = b => {
        gl.bindBuffer(b.target, b.buffer);
    };
}

function createUniformSetters(gl, program, setters) {
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
                setters[info.name] = v => gl.uniformMatrix2fv(location, TRANSPOSE, v);
                break;
            case gl.FLOAT_MAT3:
                setters[info.name] = v => gl.uniformMatrix3fv(location, TRANSPOSE, v);
                break;
            case gl.FLOAT_MAT4:
                setters[info.name] = v => gl.uniformMatrix4fv(location, TRANSPOSE, v);
                break;
            case gl.SAMPLER_2D:
            case gl.SAMPLER_CUBE:
                setters[info.name] = v => {
                    gl.uniform1i(location, textureSlot);
                    gl.activeTexture(gl.TEXTURE0 + textureSlot++);
                    gl.bindTexture(gl.TEXTURE_2D, v);
                };
                break;
        }
    }
}

/**
 * 
 * @param {*} gl 
 * @param {*} image 
 * @param {*} param2 
 * @returns 
 */
function buildTexture(gl, image, {
    target = WebGL2RenderingContext.TEXTURE_2D, 
    level = 0, 
    internalFormat = WebGL2RenderingContext.RGBA, 
    srcFormat = WebGL2RenderingContext.RGBA, 
    srcType = WebGL2RenderingContext.UNSIGNED_BYTE,
}) {
    const texture = gl.createTexture();
    gl.bindTexture(target, texture);
    
    gl.texImage2D(target, level, internalFormat, srcFormat, srcType, image);

    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(target);

    return texture;
}

export {
    buildShader,
    buildTexture,
};