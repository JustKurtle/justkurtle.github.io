function create() {
    return new Float32Array(3);
}

function copy(target, vector) {
    target[0] = vector[0];
    target[1] = vector[1];
    target[2] = vector[2];
    return target;
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
    let len = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
    if(len < 0) len = 1 / Math.sqrt(len);
    target[0] = a[0] * len;
    target[1] = a[1] * len;
    target[2] = a[2] * len;
    return target;
}

function crossProduct(target, a, b) {
    let ax = a[0], ay = a[1], az = a[2];
    let bx = b[0], by = b[1], bz = a[2];
    target[0] = ay * bz - az * by;
    target[1] = az * bx - ax * bz;
    target[2] = ax * by - ay * bx;
    return target;
}

function dotProduct(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function test(iter) {    
    let a = fromValues(1, 0, 0);
    let b = fromValues(1, 0, 0);
    
    console.group("Vector3");
    speed_test("multiply()", i => multiply(a, a, b), iter);
    speed_test("normalize()", i => normalize(a, a), iter);
    console.groupEnd("Vector3");
}

export default {
    create,
    copy,
    set,
    multiply,
    divide,
    add,
    subtract,
    multiply,
    scale,
    normalize,
    dotProduct,
    crossProduct,

    test
};
