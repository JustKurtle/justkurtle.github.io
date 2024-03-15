//@ts-check
import { rectOverlaps, rectContains } from "../math/BoundsTools.js";
import { extend } from "../arrays/ArrayTools.js";

class OctTree {
    #position = new Float32Array(3);
    #size = new Float32Array(3);
    #depth;
    #min_items;
    
    #nodes = [];
    #values = [];
    
    /**
     * creates a OctTree
     * @param {Float32Array} position the position of the tree
     * @param {Float32Array} size the size of the tree
     * @param {number} depth how many times to branch
     */
    constructor(position, size, depth = 16, min_items = 12) {
        this.#position[0] = position[0];
        this.#position[1] = position[1];
        this.#position[2] = position[2];
        
        this.#size[0] = size[0];
        this.#size[1] = size[1];
        this.#size[2] = size[2];

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
            if(this.#nodes[4]) extend(out, this.#nodes[4].collect(position, size));
            if(this.#nodes[5]) extend(out, this.#nodes[5].collect(position, size));
            if(this.#nodes[6]) extend(out, this.#nodes[6].collect(position, size));
            if(this.#nodes[7]) extend(out, this.#nodes[7].collect(position, size));
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
        let z = (position[2] - this.#position[2] - this.#size[2] / 2) > 0 ? 4 : 0;

        if(this.#split(x + y + z) && this.#nodes[x + y + z].insert(position, size, value))
            return true;

        this.#values.push(value);
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
        let z = (position[2] - this.#position[2] - this.#size[2] / 2) > 0 ? 4 : 0;

        if(this.#split(x + y + z) && this.#nodes[x + y + z].remove(position, size, value))
            return true;

        this.#values.push(value);
        return true;
    }

    erase() {
        this.#values.length = 0;
        if(this.#nodes[0]) this.#nodes[0].erase();
        if(this.#nodes[1]) this.#nodes[1].erase();
        if(this.#nodes[2]) this.#nodes[2].erase();
        if(this.#nodes[3]) this.#nodes[3].erase();
        if(this.#nodes[4]) this.#nodes[4].erase();
        if(this.#nodes[5]) this.#nodes[5].erase();
        if(this.#nodes[6]) this.#nodes[6].erase();
        if(this.#nodes[7]) this.#nodes[7].erase();
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
        
        let size = new Float32Array([this.#size[0] / 2, this.#size[1] / 2, this.#size[2] / 2]);
        let pos = new Float32Array([this.#position[0] + size[0] * (i & 1), this.#position[1] + size[1] * ((i & 2) >> 1), this.#position[2] + size[2] * (i >> 2)]);
        
        this.#nodes[i] = new OctTree(pos, size, this.#depth - 1);
        return true;
    }
};
export default OctTree;