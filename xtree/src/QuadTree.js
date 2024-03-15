//@ts-check
import { rectOverlaps, rectContains } from "./BoundsTools.js";
import { extend } from "./ArrayTools.js";

class QuadTree {
    #position;
    #size;
    #depth;
    #min_items;
    
    #nodes = [];
    #values = [];
    
    /**
     * creates a QuadTree
     * @param {Float32Array} position the position of the tree
     * @param {Float32Array} size the size of the tree
     * @param {number} depth how many times to branch
     */
    constructor(position, size, depth = 16, min_items = 12) {
        this.#position = position;
        this.#size = size;

        this.#depth = depth;
        this.#min_items = min_items;
    }

    /**
     * gets all values with keys inside the range
     * @param {Float32Array} position the position point of the search
     * @param {Float32Array} size the size of the search
     * @returns {any[]} all values that fit the search 
     */
    collect(position, size) {
        let out = [];
        if(rectOverlaps(this.#position, this.#size, position, size)) {
            extend(out, this.#values);
            if(this.#nodes[0]) extend(out, this.#nodes[0].collect(position, size));
            if(this.#nodes[1]) extend(out, this.#nodes[1].collect(position, size));
            if(this.#nodes[2]) extend(out, this.#nodes[2].collect(position, size));
            if(this.#nodes[3]) extend(out, this.#nodes[3].collect(position, size));
        }
        return out;
    }
    /**
     * inserts a value to a key as a position and size
     * @param {Float32Array} position the position point of the key
     * @param {Float32Array} size the size of the key
     * @param {any} value the value to be assigned
     * @returns {boolean} success or failure 
     */
    insert(position, size, value) {
        if(!rectContains(this.#position, this.#size, position, size)) return false;
        
        let x = (position[0] - this.#position[0] - this.#size[0] / 2) > 0 ? 1 : 0;
        let y = (position[1] - this.#position[1] - this.#size[1] / 2) > 0 ? 2 : 0;

        if(this.#split(x + y) && this.#nodes[x + y].insert(position, size, value))
            return true;

        this.#values.push({ value });
        return true;
    }
    /**
     * inserts a value to a key as a position and size
     * @param {Float32Array} position the position point of the key
     * @param {Float32Array} size the size of the key
     * @param {any} value the value to be assigned
     * @returns {boolean} success or failure 
     */
    remove(position, size, value) {
        if(!rectContains(this.#position, this.#size, position, size)) return false;
        
        let x = (position[0] - this.#position[0] - this.#size[0] / 2) > 0 ? 1 : 0;
        let y = (position[1] - this.#position[1] - this.#size[1] / 2) > 0 ? 2 : 0;

        if(this.#split(x + y) && this.#nodes[x + y].insert(position, size, value))
            return true;

        this.#values.push(value);
        return true;
    }

    /**
     * wipes all values from the tree
     */
    erase() {
        this.#values.length = 0;
        if(this.#nodes[0]) this.#nodes[0].erase();
        if(this.#nodes[1]) this.#nodes[1].erase();
        if(this.#nodes[2]) this.#nodes[2].erase();
        if(this.#nodes[3]) this.#nodes[3].erase();
    }

    // Private Utils
    /**
     * 
     * @param {number} i the index of the node to attempt to create
     * @returns 
     */
    #split(i) {
        if(!this.#depth || this.#values.length < this.#min_items) return false;
        if(this.#nodes[i]) return true;
        
        let size = new Float32Array([this.#size[0] / 2, this.#size[1] / 2]);
        let pos = new Float32Array([this.#position[0] + size[0] * (i & 1), this.#position[1] + size[1] * (i >> 1)]);
        
        this.#nodes[i] = new QuadTree(pos, size, this.#depth - 1);
        return true;
    }
};
export default QuadTree;