// function quadsphere(sideWidth) {
//     let vertexPositions = [];

//     return {
//         vertexPositions: new Float32Array(vertexPositions)
//     };
// }

function createQuad(sideWidth) {
    let invSideWidth = 1 / sideWidth;
    let vertexCount = ++sideWidth ** 2;
    let indexCount = (sideWidth - 1) ** 2;
    
    let vertexArray = new Float32Array(3 * vertexCount);
    let texCoordArray = new Float32Array(2 * vertexCount);
    let indexArray = new Uint16Array(6 * indexCount);
    
    let j = 0, i = vertexCount;
    while(i--) {
        let x = (i % sideWidth) * invSideWidth;
        let y = (Math.floor(i / sideWidth) % sideWidth) * invSideWidth;

        replaceAt(vertexArray, i * 3, [y - 0.5, x - 0.5, 0]);

        replaceAt(texCoordArray, i * 2, [x, y]);

        if(x != 1 && y != 1) {
            let a = i,
                b = a + 1,
                c = b + sideWidth,
                d = c - 1;
            replaceAt(indexArray, j, [a,b,c,  a,c,d]);
            j += 6;
        }
    }

    return {
        vertexArray,
        texCoordArray,
        indexArray,
    }
}

function createQuadSphere(sideWidth) {
    let invSideWidth = 1 / sideWidth;
    let vertexCount = ++sideWidth ** 2 * 6;
    let indexCount = (sideWidth - 1) ** 2 * 6;
    
    let vertexArray = new Float32Array(3 * vertexCount);
    let texCoordArray = new Float32Array(2 * vertexCount);
    let indexArray = new Uint16Array(6 * indexCount);
    
    let j = 0, i = vertexCount;
    while(i--) {
        let x = (i % sideWidth) * invSideWidth - 0.5;
        let y = (Math.floor(i / sideWidth) % sideWidth) * invSideWidth - 0.5;

        switch(Math.floor(i / sideWidth ** 2)) {
            case 0:
                replaceAt(vertexArray, i * 3, [ y, x,-0.5]);
                break;
            case 1:
                replaceAt(vertexArray, i * 3, [ x, y, 0.5]);
                break;
            case 2:
                replaceAt(vertexArray, i * 3, [ x,-0.5, y]);
                break;
            case 3:
                replaceAt(vertexArray, i * 3, [ y, 0.5, x]);
                break;
            case 4:
                replaceAt(vertexArray, i * 3, [-0.5, y, x]);
                break;
            case 5:
                replaceAt(vertexArray, i * 3, [ 0.5, x, y]);
                break;
        }

        x += 0.5, y += 0.5;
        replaceAt(texCoordArray, i * 2, [x, y]);

        if(x != 1 && y != 1) {
            let a = i,
                b = a + 1,
                c = b + sideWidth,
                d = c - 1;
            replaceAt(indexArray, j, [a,b,c,  a,c,d]);
            j += 6;
        }
    }

    i = vertexCount;
    while(i--) {
        let offset = i * 3;
        let len = 2 * Math.hypot(...vertexArray.slice(offset, 3));

        vertexArray[offset+0] /= len;
        vertexArray[offset+1] /= len;
        vertexArray[offset+2] /= len;
    }

    return {
        vertexArray,
        texCoordArray,
        indexArray,
    }
}

function replaceAt(target, startIndex, source) {
    let iter = source.length;
    while(iter--) target[iter + startIndex] = source[iter];
}

export default {
    createQuadSphere,
    createQuad
};
