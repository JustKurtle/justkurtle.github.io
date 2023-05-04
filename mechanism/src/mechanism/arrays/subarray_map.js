function create(step_size, sub_size) {
    let _data = new Float32Array(step_size * sub_size);
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

    if(target.length % target._step_size < 1) {
        let a = new Float32Array((target.length + target._step_size) * target._sub_size);
        let i = 0;
        while(i++ < target._data.length) a[i] = target._data[i];
        target.data = a;
    }

    target._data.set(index * target._sub_size, data);
    
    target._keys[target._additions] = index;
    target._keyorder[index] = target._additions;

    target._data[index] = data;

    return target._additions++;
}

function remove(target, key) {
    let index = target._keys[key];
    let data = target._data[index];

    target._keys[target._keyorder[target.length--]] = index;
    target._keys[key] = undefined;
    
    target._data[index] = target._data.pop();
    target._keyorder[index] = target._keyorder.pop();

    return data;
}

function reset(target) {
    target._data = [];
    target._keys = {};
    target._keyorder = [];
    target._additions = 0;
    target.length = 0;
}

function get(target, key) {
    return target._data.slice(target._keys[key], target._sub_size);
}

function set(target, key, data) {
    let index = target._keys[key];
    let i = target._sub_size;
    while(i--) target._data[index + i] = data[i];
}

export default {
    create,
    add,
    remove,
    reset,
    get,
    set,
};