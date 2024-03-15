/**
 * This one is weird...
 * It's a class that stores chunks of data inside of a Float32Array
 * 
 * The chunks have a size called sub_size. The size of the array is defined in multiples of this sub_size.
 * 
 * The chunks are mapped to indices that can be removed and inserted freely very densely or needing to shift all of the values of the array.
 * 
 * keys[key] = index;
 * keyorder[index] = key;
 * data[index * chunksize] = the beginning of the chunk;
 * 
 * The keys array stores the index of the data related to the key
 */
class SubArrayMap {
    #data;
    #keys;
    #keyorder;
    #additions;
    #step_size;
    #sub_size;
    length;

    constructor(size, step_size, sub_size) {
        this.#data = new Float32Array(size * sub_size);
        this.#keys = {};
        this.#keyorder = [];
        this.#additions = 0;
        this.#step_size = step_size;
        this.#sub_size = sub_size;
        this.length = 0;
    }

    add(data) {
        let index = this.length++;
        
        if(this.#additions * this.#sub_size > this.#data.length) {
            let a = new Float32Array(this.#data.length + this.#step_size * this.#sub_size);
            let i = this.#data.length;
            while(i--) a[i] = this.#data[i];
            this.#data = a;
        }

        let i = this.#sub_size;
        while(i--) this.#data[index * this.#sub_size + i] = data[i];
        
        this.#keys[this.#additions] = index;
        this.#keyorder[index] = this.#additions;

        return this.#additions++;
    }

    remove(key) {
        let index = this.#keys[key];

        this.#keys[this.#keyorder[this.length--]] = index;
        this.#keys[key] = undefined;
        
        this.#keyorder[index] = this.#keyorder.pop();
        
        let i = this.#sub_size;
        while(i--) this.#data[index * this.#sub_size + i] = this.#data[this.length * this.#sub_size + i];
    }

    reset() {
        this.#data = new Float32Array(this.#data.length);
        this.#keys = {};
        this.#keyorder = [];
        this.#additions = 0;
        this.length = 0;
    }

    get(key) {
        let index = this.#keys[key] * this.#sub_size;
        return this.#data.slice(index, index + this.#sub_size);
    }

    set(key, data) {
        let index = this.#keys[key] * this.#sub_size;
        let i = this.#sub_size;
        while(i--) this.#data[index + i] = data[i];
    }
    
    // for backwards compatibility with my old code
    static create(size, step_size, sub_size) {
        return new SubArrayMap(size, step_size, sub_size);
    }
}
export default SubArrayMap;