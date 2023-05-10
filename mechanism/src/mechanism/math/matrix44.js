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

function multiply(target, a, b) {
    let a00 = a[ 0], a01 = a[ 1], a02 = a[ 2], a03 = a[ 3];
    let a10 = a[ 4], a11 = a[ 5], a12 = a[ 6], a13 = a[ 7];
    let a20 = a[ 8], a21 = a[ 9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b0 = b[ 0], b1 = b[ 1], b2 = b[ 2], b3 = b[ 3];
    target[ 0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    target[ 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    target[ 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    target[ 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[ 4], b1 = b[ 5], b2 = b[ 6], b3 = b[ 7];
    target[ 4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    target[ 5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    target[ 6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    target[ 7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[ 8], b1 = b[ 9], b2 = b[10], b3 = b[11];
    target[ 8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    target[ 9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    target[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    target[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[12], b1 = b[13], b2 = b[14], b3 = b[15];
    target[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    target[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    target[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    target[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return target;
}

function test(iter) {
    let a = create();
    let b = create();

    console.log("Matrix44");
    speed_test("    multiply()", i => multiply(a, a, b), iter);
}

export default {
    create,
    copy,
    set,
    multiply,

    test
};