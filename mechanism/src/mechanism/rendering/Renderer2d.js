class Renderer2d {
    #objects = [];
    ctx;

    constructor(app) {
        this.ctx = app.canvas.getContext("2d");
        if(!this.ctx) throw new Error('Failed to load "2d" canvas rendering context');
    }

    addRenderObject(renderObject) {
        this.#objects.push(renderObject);
    }

    draw(dt) {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0,0, innerWidth, innerHeight);

        let i = this.#objects.length;
        while(i--) {
            this.ctx.fillStyle = this.#objects[i].color;
        
            let shape = [...this.#objects[i].shape];
            this.ctx.fillRect(...shape);
        }
    }
}
export default Renderer2d;