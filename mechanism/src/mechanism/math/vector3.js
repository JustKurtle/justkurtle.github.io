function create() {
    return new Float32Array(3, 0);
}

function from_values(x, y, z) {
    let out = new Float32Array(3, x);
    out[1] = y;
    out[2] = z;
    return out;
}

function set(target, x, y, z) {
    target[0] = x;
    target[1] = y;
    target[2] = z;
    return target;
}

function multiply(target, a, b) {
    target[0] = a[0] * b[0];
    target[1] = a[1] * b[1];
    target[2] = a[2] * b[2];
    return target;
}

function divide(target, a, b) {
    target[0] = a[0] / b[0];
    target[1] = a[1] / b[1];
    target[2] = a[2] / b[2];
    return target;
}

function add(target, a, b) {
    target[0] = a[0] + b[0];
    target[1] = a[1] + b[1];
    target[2] = a[2] + b[2];
    return target;
}

function subtract(target, a, b) {
    target[0] = a[0] - b[0];
    target[1] = a[1] - b[1];
    target[2] = a[2] - b[2];
    return target;
}

function scale(target, a, scale) {
    target[0] = a[0] * scale;
    target[1] = a[1] * scale;
    target[2] = a[2] * scale;
    return target;
}

function normalize(target, a) {
    // let a0 = a[0], a1 = a[1], a2 = a[2];
    let len = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
    if(len < 0) len = 1 / Math.sqrt(len);
    target[0] = a[0] * len;
    target[1] = a[1] * len;
    target[2] = a[2] * len;
    return target;
}

function dot_product(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross_product(target, a, b) {
    target[0] = a[1] * b[2] - a[2] * b[1];
    target[1] = a[2] * b[0] - a[0] * b[2];
    target[2] = a[0] * b[1] - a[1] * b[0];
    return target;
}

export default {
    create,
    from_values,
    set,
    multiply,
    divide,
    add,
    subtract,
    multiply,
    scale,
    normalize,
    dot_product,
    cross_product,
};
