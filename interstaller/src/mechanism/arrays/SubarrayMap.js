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
        this.#data = new Float32Array(0);
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
    
    static create(step_size, sub_size) {
        return new SubArrayMap(0, 20, 16);
    }

    static speed_test(iter) {
        let a = new SubArrayMap(iter, 20, 16);
    
        let b = new Float32Array(16);
        let c = new Float32Array(16);
    
        console.group("SubarrayMap");
        speed_test("add()", i => a.add(b), iter);
        speed_test("get()", i => a.get(i), iter);
        speed_test("set()", i => a.set(i, c), iter);
        speed_test("pop()", i => a.remove(i), iter);
        console.groupEnd("SubarrayMap");
    }
}
export default SubArrayMap;