class ArrayMap {
    #values;
    #keys;
    #keyorder;
    #additions;
    length;

    constructor() {
        this.#values = [];
        this.#keys = {};
        this.#keyorder = [];
        this.#additions = 0;
        this.length = 0;
    }

    add(value) {
        let index = this.length++;
        
        this.#keys[this.#additions] = index;
        this.#keyorder[index] = this.#additions;

        this.#values[index] = value;

        return this.#additions++;
    }

    remove(key) {
        let index = this.#keys[key];
        if(index == undefined) return null;
        let value = this.#values[index];

        this.#keys[this.#keyorder[this.length--]] = index;
        this.#keys[key] = undefined;
        
        this.#values[index] = this.#values.pop();
        this.#keyorder[index] = this.#keyorder.pop();

        return value;
    }

    reset() {
        this.#values = [];
        this.#keys = {};
        this.#keyorder = [];
        this.#additions = 0;
        this.length = 0;
    }

    get(key) {
        return this.#values[this.#keys[key]];
    }

    set(key, value) {
        this.#values[this.#keys[key]] = value;
    }

    getKeys() {
        return this.#keyorder;
    }

    getValues() {
        return this.#values;
    }

    static speed_test(iter) {
        let a = new ArrayMap();
    
        let b = new Array(16);
        let c = new Array(16);
    
        console.group("ArrayMap");
        speed_test("add()", i => a.add(b), iter);
        speed_test("get()", i => a.get(i), iter);
        speed_test("set()", i => a.set(i, c), iter);
        speed_test("pop()", i => a.remove(i), iter);
        console.groupEnd("ArrayMap");
    }
}
export default ArrayMap;