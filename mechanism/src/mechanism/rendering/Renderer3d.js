class Renderer3d {
    #objects = [];
    gl;

    constructor(app) {
        this.gl = app.canvas.getContext("webgl2");
        if(!this.gl) throw new Error('Failed to load "webgl2" canvas rendering context');

        this.gl.enable(this.gl.CULL_FACE);
        
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.clearColor(0.3, 0.3, 0.6, 1.0);
        this.gl.clearDepth(1.0);

        addEventListener("resize", _ => this.gl.viewport(0, 0, innerWidth, innerHeight), false);
    }

    addModel(model) {
        
    }

    draw(dt) {
        let i = this.#objects.length;
        while(i--) {
            this.#objects[i].set(this.#objects[i]);
        }
    }
}
export default Renderer3d;