function create() {
    let _data = [];
    let _keys = {};
    let _keyorder = [];
    let _additions = 0;
    let length; 0;

    return {
        _data,
        _keys,
        _keyorder,
        _additions,
        length,
    };
}

function add(data) {
    let index = target.length++;
    
    target._keys[target._additions] = index;
    target._keyorder[index] = target._additions;

    target._data[index] = data;

    return target._additions++;
}

function remove(key) {
    let index = target._keys[key];
    let data = target._data[index];

    target._keys[target._keyorder[target.length--]] = index;
    target._keys[key] = undefined;
    
    target._data[index] = target._data.pop();
    target._keyorder[index] = target._keyorder.pop();

    return data;
}

function erase(target) {
    target._data = [];
    target._keys = {};
    target._keyorder = [];
    target._additions = 0;
    target.length = 0;
}

function get(target, key) {
    return target._data[target._keys[key]];
}

function set(target, key, data) {
    target._data[target._keys[key]] = data;
}

export default {
    create,
    add,
    remove,
    erase,
    get,
    set,
};