import ShaderTools from "./ShaderTools.js"

async function create(gl) {
    let shaderSource = await Promise.all([
        fetch("src/mechanism/rendering/_shader.vs.hlsl")
            .then(response => response.text()),
        fetch("src/mechanism/rendering/_shader.fs.hlsl")
            .then(response => response.text()),
    ]);

    let shaders = {
        world: ShaderTools.buildShader(gl, shaderSource),
        post: ShaderTools.buildShader(gl, shaderSource),
    };

    for(let i in shaders)
        if(shaders[i].error)
            console.error(`shaders["${i}"]: ${shaders[i].error}`);

    const framebuffer = gl.createFramebuffer();
    const framebufferTextures = [
        gl.createTexture(),
        gl.createTexture(),
        gl.createTexture(),
        gl.createTexture(),
    ];

    return {
        shaders,
        framebuffer,
        framebufferTextures
    };
}

function setupDrawBuffers(target) {
    let buffers = new Array(target.frameTextures.length);

    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);    
    
    let i = buffers.length;
    while(i--) {
        const color_attachment = gl.COLOR_ATTACHMENT0 + i;
        const frame_texture = target.frameTextures[i];

        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            color_attachment,
            gl.TEXTURE_2D,
            frame_texture,
            0);
        buffers[i] = color_attachment;
    }
    
    gl.drawBuffers(buffers);
}

function render(target, scene) {
    target.scene;

    

    return target;
}

export default {
    create,
};
