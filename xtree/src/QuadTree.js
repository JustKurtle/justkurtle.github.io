class QuadTree {
    /**
     * creates a QuadTree
     * 
     * @param {number[2]} center the center of the tree
     * @param {number[2]} size the size of the tree
     * @param {number} depth how many times to branch
     */
    constructor(center, size, depth = 16) {
        this.#center = center;
        this.#size = size;
        this.#depth = depth;
    }

    #center;
    #size;
    #depth; 
    #nodes = [];
    #values = [];

    /**
     * gets all values with keys inside the range
     * 
     * @param {number[2]} center the center point of the search
     * @param {number[2]} size the size of the search
     * @returns {any[]} all values that fit the search 
     */
    get(center, size) {
        let out = [];
        if(this.#intersects(center, size)) {
            out.push(...this.#values);
            if(this.#nodes.length) {
                out.push(...this.#nodes[0].get(center, size));
                out.push(...this.#nodes[1].get(center, size));
                out.push(...this.#nodes[2].get(center, size));
                out.push(...this.#nodes[3].get(center, size));
            }
        }
        return out;
    }
    /**
     * sets a value to a key as a position and size
     * 
     * @param {number[2]} center the center point of the key
     * @param {number[2]} size the size of the key
     * @param {any} value the value to be assigned
     * @returns {boolean} success or failure 
     */
    set(center, size, value) {
        if(this.#contains(center, size)) {
            if(this.#depth && !this.#nodes.length) this.#split();
            if(this.#depth && (
                this.#nodes[0].set(center, size, value) || 
                this.#nodes[1].set(center, size, value) || 
                this.#nodes[2].set(center, size, value) || 
                this.#nodes[3].set(center, size, value)
            )) return true;
            this.#values.push(value);
            return true;
        }
        return false;
    }

    // Private Utils
    #split() {
        let size = [this.#size[0] / 2, this.#size[1] / 2];
        let [x,_x] = [this.#center[0] + size[0], this.#center[0] - size[0]];
        let [y,_y] = [this.#center[1] + size[1], this.#center[1] - size[1]];
        this.#nodes[3] = new QuadTree([ x, y], size, this.#depth - 1);
        this.#nodes[2] = new QuadTree([_x, y], size, this.#depth - 1);
        this.#nodes[1] = new QuadTree([ x,_y], size, this.#depth - 1);
        this.#nodes[0] = new QuadTree([_x,_y], size, this.#depth - 1);
    }
    #intersects(center, size) {
        return !(
            this.#center[0] - this.#size[0] >= center[0] + size[0] ||
            this.#center[0] + this.#size[0] <= center[0] - size[0] ||
            this.#center[1] - this.#size[1] >= center[1] + size[1] ||
            this.#center[1] + this.#size[1] <= center[1] - size[1]
        );
    }
    #contains(center, size) {
        return (
            this.#center[0] - this.#size[0] <= center[0] - size[0] &&
            this.#center[0] + this.#size[0] >= center[0] + size[0] &&
            this.#center[1] - this.#size[1] <= center[1] - size[1] &&
            this.#center[1] + this.#size[1] >= center[1] + size[1]
        );
    }
};

export default QuadTree;