function create(step_size, sub_size) {
    let _data = new Float32Array(0);
    let _keys = {};
    let _keyorder = [];
    let _additions = 0;
    let _step_size = step_size;
    let _sub_size = sub_size; 
    let length = 0;

    return {
        _data,
        _keys,
        _keyorder,
        _additions,
        _step_size,
        _sub_size,
        length,
    };
}

function fromInitialSize(size, step_size, sub_size) {
    let _data = new Float32Array(size * sub_size);
    let _keys = {};
    let _keyorder = [];
    let _additions = 0;
    let _step_size = step_size;
    let _sub_size = sub_size; 
    let length = 0;

    return {
        _data,
        _keys,
        _keyorder,
        _additions,
        _step_size,
        _sub_size,
        length,
    };
}

function add(target, data) {
    let index = target.length++;
    
    if(target._additions * target._sub_size > target._data.length) {
        let a = new Float32Array(target._data.length + target._step_size * target._sub_size);
        let i = target._data.length;
        while(i--) a[i] = target._data[i];
        target._data = a;
    }

    let i = target._sub_size;
    while(i--) target._data[index * target._sub_size + i] = data[i];
    
    target._keys[target._additions] = index;
    target._keyorder[index] = target._additions;

    return target._additions++;
}

function remove(target, key) {
    let index = target._keys[key];

    target._keys[target._keyorder[target.length--]] = index;
    target._keys[key] = undefined;
    
    target._keyorder[index] = target._keyorder.pop();
    
    let i = target._sub_size;
    while(i--) target._data[index * target._sub_size + i] = target._data[target.length * target._sub_size + i];
}

function reset(target) {
    target._data = new Float32Array(0);
    target._keys = {};
    target._keyorder = [];
    target._additions = 0;
    target.length = 0;
}

function get(target, key) {
    let index = target._keys[key] * target._sub_size;
    return target._data.slice(index, index + target._sub_size);
}

function set(target, key, data) {
    let index = target._keys[key] * target._sub_size;
    let i = target._sub_size;
    while(i--) target._data[index + i] = data[i];
}

function test(iter) {
    let a = fromInitialSize(iter, 1000, 16);

    let b = new Float32Array(16, 0);
    let c = new Float32Array(16, 0);

    console.log("SubarrayMap");
    speed_test("    add()", i => add(a, b), iter);
    speed_test("    get()", i => get(a, i), iter);
    speed_test("    set()", i => set(a, i, c), iter);
    speed_test("    pop()", i => remove(a, i), iter);
}

export default {
    create,
    fromInitialSize,
    add,
    remove,
    reset,
    get,
    set,

    test
};