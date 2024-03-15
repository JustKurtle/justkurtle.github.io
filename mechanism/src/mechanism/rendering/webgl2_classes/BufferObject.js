class BufferObject {
    array;
    
    stride;
    offset;

    buffer;
    target;
    usage;

    constructor(gl, {
        array,
        stride = 0,
        offset = 0,

        target = WebGL2RenderingContext.ARRAY_BUFFER,
        usage = WebGL2RenderingContext.STATIC_DRAW,
    }) {
        this.array = array;
        this.buffer = gl.createBuffer();
        this.target = target;
        this.usage = usage;

        this.stride = stride;
        this.offset = offset;
    }

    /**
     * updates the gl buffer with the array data
     */
    update() {
        gl.bindBuffer(this.target, this.buffer);
        gl.bufferData(this.target, this.array, this.usage);
    }
}
export default BufferObject;