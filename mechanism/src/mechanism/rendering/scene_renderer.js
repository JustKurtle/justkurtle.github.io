async function create(gl) {
    let vShader = await fetch("src/mechanism/rendering/_shader.vs.hlsl")
        .then(response => response.text());
    let fShader = await fetch("src/mechanism/rendering/_shader.fs.hlsl")
        .then(response => response.text());

    let shader = loadShader(gl, [vShader, fShader]);
    if(shader.error) console.error(shader.error);

    // const fb = gl.createFramebuffer();

    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // gl.framebufferTexture2D(
    //     gl.FRAMEBUFFER,
    //     ext.COLOR_ATTACHMENT0_WEBGL,
    //     gl.TEXTURE_2D,
    //     tx[0],
    //     0
    // );
    // gl.framebufferTexture2D(
    //     gl.FRAMEBUFFER,
    //     ext.COLOR_ATTACHMENT1_WEBGL,
    //     gl.TEXTURE_2D,
    //     tx[1],
    //     0
    // );
    // gl.framebufferTexture2D(
    //     gl.FRAMEBUFFER,
    //     ext.COLOR_ATTACHMENT2_WEBGL,
    //     gl.TEXTURE_2D,
    //     tx[2],
    //     0
    // );
    // gl.framebufferTexture2D(
    //     gl.FRAMEBUFFER,
    //     ext.COLOR_ATTACHMENT3_WEBGL,
    //     gl.TEXTURE_2D,
    //     tx[3],
    //     0
    // );

    return {
        
    };
}

function loadShader(gl, source) {
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, source[0]);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        let err = gl.getShaderInfoLog(vShader);
        gl.deleteShader(vShader);
        return { error: "vertex shader compile error: " + err };
    }

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, source[1]);
    gl.compileShader(fShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        let err = gl.getShaderInfoLog(fShader);
        gl.deleteShader(fShader);
        return { error: "fragment shader compile error: " + err };
    }

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let err = gl.getShaderInfoLog(program);
        gl.deleteProgram(program);
        return { error: "shader program link error: " + err };
    }

    let vars = {
        attributes: {},
        uniforms: {}
    };
    
    let i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    while(i--) {
        const info = gl.getActiveAttrib(program, i);
        const location = gl.getAttribLocation(program, info.name);

        vars.attributes[location] = info;
        // setters[info.name] = b => {
        //     gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
        //     gl.enableVertexAttribArray(location);
        //     gl.vertexAttribPointer(location, b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
        // }
    }

    i = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    while(i--) {
        const info = gl.getActiveUniform(program, i);
        const location = gl.getUniformLocation(program, info.name);
        
        vars.uniforms[location] = info;
    //     let textureSlot = 0;
    //     switch(info.type) {
    //         case gl.FLOAT:
    //             setters[info.name] = v => gl.uniform1fv(location, v);
    //             break;
    //         case gl.FLOAT_VEC2:
    //             setters[info.name] = v => gl.uniform2fv(location, v);
    //             break;
    //         case gl.FLOAT_VEC3:
    //             setters[info.name] = v => gl.uniform3fv(location, v);
    //             break;
    //         case gl.FLOAT_VEC4:
    //             setters[info.name] = v => gl.uniform4fv(location, v);
    //             break;
    //         case gl.INT:
    //         case gl.BOOL:
    //             setters[info.name] = v => gl.uniform1iv(location, v);
    //             break;
    //         case gl.INT_VEC2:
    //         case gl.BOOL_VEC2:
    //             setters[info.name] = v => gl.uniform2iv(location, v);
    //             break;
    //         case gl.INT_VEC3:
    //         case gl.BOOL_VEC3:
    //             setters[info.name] = v => gl.uniform3iv(location, v);
    //             break;
    //         case gl.INT_VEC4:
    //         case gl.BOOL_VEC4:
    //             setters[info.name] = v => gl.uniform4iv(location, v);
    //             break;
    //         case gl.FLOAT_MAT2:
    //             setters[info.name] = v => gl.uniformMatrix2fv(location, true, v);
    //             break;
    //         case gl.FLOAT_MAT3:
    //             setters[info.name] = v => gl.uniformMatrix3fv(location, true, v);
    //             break;
    //         case gl.FLOAT_MAT4:
    //             setters[info.name] = v => gl.uniformMatrix4fv(location, true, v);
    //             break;
    //         case gl.SAMPLER_2D:
    //         case gl.SAMPLER_CUBE:
    //             setters[info.name] = (v) => {
    //                 gl.uniform1i(location, textureSlot);
    //                 gl.activeTexture(gl.TEXTURE0 + textureSlot);
    //                 gl.bindTexture(gl.TEXTURE_2D, v);
    //             };
    //             break;
    //     }
    }

    console.log(vars);

    return program;
}

function loadTexture(gl, path) {
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
}

function loadBuffer(gl, target) {
    gl.bindBuffer(target.bufferType, target.buffer);
    gl.bufferData(target.bufferType, target.array, target.drawType);
}

function render(target) {
    
    return target
}

export default {
    create,
};
