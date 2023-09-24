import ShaderTools from "./ShaderTools.js"

class Renderer {
    #shaders;
    #framebuffer;
    #frameTextures;

    constructor(gl) {
        this.#shaders = loadShaders();
        
        this.#framebuffer = gl.createFramebuffer();
        this.#frameTextures = [
            gl.createTexture(),
            gl.createTexture(),
            gl.createTexture(),
            gl.createTexture(),
        ];

        setupDrawBuffers(gl, this.#frameTextures, this.#framebuffer);
        
        gl.clearColor(0,0,0,1);
    }

    
    
    render(scene) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let props = scene.props;

        for(let propIter = props.length;propIter--;) {
            // props[propIter];
            this.#shaders.set(prop.model);
        }

    }
}

// todo: don't load this here
async function loadShaders() {
    let shaderSource = await Promise.all([
        fetch("src/mechanism/rendering/_shader.vs.hlsl")
            .then(response => response.text()),
        fetch("src/mechanism/rendering/_shader.fs.hlsl")
            .then(response => response.text()),
    ]);
    return ShaderTools.buildShader(gl, shaderSource);
}

function setupFrameBuffers(gl, frameTextures, framebuffer) {
    let buffers = new Array(frameTextures.length);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);    
    
    let i = buffers.length;
    while(i--) {
        const color_attachment = gl.COLOR_ATTACHMENT0 + i;

        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            color_attachment,
            gl.TEXTURE_2D,
            frameTextures[i],
            0);
        buffers[i] = color_attachment;
    }
    
    gl.drawBuffers(buffers);
}

export default Renderer;
