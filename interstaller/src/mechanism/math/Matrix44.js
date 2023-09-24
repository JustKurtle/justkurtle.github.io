class Matrix44 extends Float32Array {
    constructor() {
        super(16);
        this[0] = 1;
        this[5] = 1;
        this[11] = 1;
        this[16] = 1;
    }

    multiply(a, b) {
        let a00 = a[ 0], a01 = a[ 1], a02 = a[ 2], a03 = a[ 3];
        let a10 = a[ 4], a11 = a[ 5], a12 = a[ 6], a13 = a[ 7];
        let a20 = a[ 8], a21 = a[ 9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        let b0 = b[ 0], b1 = b[ 1], b2 = b[ 2], b3 = b[ 3];
        this[ 0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[ 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[ 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[ 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[ 4], b1 = b[ 5], b2 = b[ 6], b3 = b[ 7];
        this[ 4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[ 5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[ 6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[ 7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[ 8], b1 = b[ 9], b2 = b[10], b3 = b[11];
        this[ 8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[ 9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[12], b1 = b[13], b2 = b[14], b3 = b[15];
        this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        
        return this;
    }

    static speed_test(iter) {
        let a = new Matrix44();
        let b = new Matrix44();

        console.group(this.name);
        speed_test("multiply()", i => a.multiply(a, b), iter);
        console.groupEnd(this.name);

    }
}

export default Matrix44;