function create() {
    let _values = [];
    let _keys = {};
    let _keyorder = [];
    let _additions = 0;
    let length = 0;

    return {
        _values,
        _keys,
        _keyorder,
        _additions,
        length,
    };
}

function add(target, value) {
    let index = target.length++;
    
    target._keys[target._additions] = index;
    target._keyorder[index] = target._additions;

    target._values[index] = value;

    return target._additions++;
}

function remove(target, key) {
    let index = target._keys[key];
    let value = target._values[index];

    target._keys[target._keyorder[target.length--]] = index;
    target._keys[key] = undefined;
    
    target._values[index] = target._values.pop();
    target._keyorder[index] = target._keyorder.pop();

    return value;
}

function reset(target) {
    target._values = [];
    target._keys = {};
    target._keyorder = [];
    target._additions = 0;
    target.length = 0;
}

function get(target, key) {
    return target._values[target._keys[key]];
}

function set(target, key, value) {
    target._values[target._keys[key]] = value;
}

export default {
    create,
    add,
    remove,
    reset,
    get,
    set,
};