//@ts-check
import { extend, binaryInsert, binarySearchRange } from "../arrays/ArrayTools.js";

// const X_PRIME = 38231071657;
const X_PRIME = 1 << 1;
// const Y_PRIME = 252442528717;
const Y_PRIME = 1 << 24;
// const Z_PRIME = 741432918379;
const Z_PRIME = 1 << 12;

function hash(pos, w, h, d = 1) {
    let x = Math.floor(pos[0] / w) * X_PRIME;
    let y = Math.floor(pos[1] / h) * Y_PRIME;
    let z = Math.floor(pos[2] / d) * Z_PRIME;

    return (x + y + z);
}

class LayeredGrid3D {
    #cell_size = new Float32Array(3);
    #layers = [];
    #divisor;

    /**
     * creates a LayeredGrid
     * @param {Float32Array} cell_size the size of the tree
     * @param {number} layers how many layers to generate
     */
    constructor(cell_size, layers = 8, cell_divisor = 2) {
        this.#cell_size[0] = cell_size[0];
        this.#cell_size[1] = cell_size[1];
        this.#cell_size[2] = cell_size[2];
        
        this.#layers.length = layers;
        
        this.#divisor = cell_divisor;

        let i = layers;
        while(i--)
            this.#layers[i] = [];
        this.#layers[-1] = [];
    }

    /**
     * gets all values with keys inside the range
     * @param {Float32Array} position the position of the search
     * @param {Float32Array} size the size of the search
     * @returns {any[]} all values that fit the search
     */
    collect(position, size) {
        let out = [];
        let opposite = [
            position[0] + size[0],
            position[1] + size[1],
            position[2] + size[2],
        ];

        let i = this.#layers.length;
        while(i--) {
            let w = this.#cell_size[0] / (this.#divisor ** i);
            let h = this.#cell_size[1] / (this.#divisor ** i);
            let d = this.#cell_size[2] / (this.#divisor ** i);

            let hash_x = Math.floor(position[0] / w);
            let hash_cx = Math.floor(opposite[0] / w);

            let hash_y = Math.floor(position[1] / h) - 1;
            let hash_cy = Math.floor(opposite[1] / h);

            let hash_z = Math.floor(position[1] / d) - 1;
            let hash_cz = Math.floor(opposite[1] / d);
            
            while(++hash_y <= hash_cy) {
                let hash_left = hash_x * X_PRIME + hash_y * Y_PRIME + hash_z * Z_PRIME;
                let hash_right = hash_cx * X_PRIME + hash_y * Y_PRIME + hash_z * Z_PRIME;
                let hash_far = hash_cx * X_PRIME + hash_y * Y_PRIME + hash_z * Z_PRIME;

                let slice_coords = binarySearchRange(
                    this.#layers[i],
                    hash_left - 1,
                    hash_right + 1,
                    (a, b) => a.hash_index - b);
                    
                extend(out, this.#layers[i].slice(slice_coords[0], slice_coords[1]));
            }

        }
        extend(out, this.#layers[i]);
        return out;
    }

    /**
     * inserts a value to a key as a position and size
     * @param {Float32Array} position the position of the key
     * @param {Float32Array} size the size of the key
     * @param {any} value the value to be assigned
     * @returns {boolean} success or failure 
     */
    insert(position, size, value) {
        let hash_index = 0;
        let hash_check = 0;

        let opposite_corner = [
            position[0] + size[0],
            position[1] + size[1],
        ];

        let i = this.#layers.length - 1;
        do {
            let w = this.#cell_size[0] / (this.#divisor ** i);
            let h = this.#cell_size[1] / (this.#divisor ** i);
            let d = this.#cell_size[2] / (this.#divisor ** i);

            hash_index = hash(position, w, h, d);
            hash_check = hash(opposite_corner, w, h, d);
        } while(hash_check != hash_index && i--);

        binaryInsert(
            this.#layers[i],
            {hash_index, value, layer: i},
            (a, b) => a.hash_index - b.hash_index);

        return true;
    }

    erase() {
        let i = this.#layers.length;
        while(i--) {
            this.#layers[i].length = 0;
        }
    }
};
export default LayeredGrid3D;