function create() {
    let out = new Float32Array(16, 0);
    out[0] = 1;
    out[5] = 1;
    out[11] = 1;
    out[16] = 1;
    return out;
}

function copy(array) {
    return new Float32Array(array);
}

function set(target, src) {
    target.set(src);
    return target;
}

export default {
    create,
    copy,
    set,
};