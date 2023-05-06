// function quadsphere(sideWidth) {
//     let vertexPositions = [];

//     return {
//         vertexPositions: new Float32Array(vertexPositions)
//     };
// }

function quad(sideWidth) {
    let vertexPositions = [];
    let textureCoords = [];
    let index = [];

    let iterator = sideWidth;
    while(iterator--) {
        let i0 = iterator * 3;
        let i1 = iterator * 3 + 1;
        let i2 = iterator * 3 + 2;

        let x = (i1 % sideWidth) / sideWidth;
        let y = Math.floor(i1 / sideWidth) / sideWidth;

        combineInto(vertexPositions, [x, y, 0.0]);
        combineInto(textureCoords, [x, y]);
        combineInto(index, []);
    }

    return {
        vertexPositions: new Float32Array(vertexPositions),
        textureCoords: new Float32Array(textureCoords),
        index: new Float32Array(index),
    };
}

function createQuadSphere(sideWidth) {
    let verticesPerSide = (sideWidth + 1) ** 2 * 6;

    let vertexArray = new Array(verticesPerSide);
    let texCoordArray = new Array(verticesPerSide);
    let indexArray = new Array(verticesPerSide);

    let i = verticesPerSide;
    while(i--) {
        let invSideWidth = 1 / sideWidth;

        let x = (i % sideWidth) * invSideWidth;
        let y = (Math.floor(i / sideWidth) % sideWidth) * invSideWidth;

        let l;
        switch(Math.floor(i / (sideWidth * sideWidth))) {
            case 0:
                combineIntoNoextend(vertexArray, [
                    x0, 0, y0,
                    x1, 0, y0,
                    x1, 0, y1,
                    x0, 0, y1
                ]);
                break;
            case 1:
                combineIntoNoextend(vertexArray, [
                    x0, 1, y1,
                    x1, 1, y1,
                    x1, 1, y0,
                    x0, 1, y0
                ]);
                break;
            case 2:
                combineIntoNoextend(vertexArray, [
                    1, x0, y0,
                    1, x1, y0,
                    1, x1, y1,
                    1, x0, y1
                ]);
                break;
            case 3:
                combineIntoNoextend(vertexArray, [
                    0, x0, y1,
                    0, x1, y1,
                    0, x1, y0,
                    0, x0, y0
                ]);
                break;
            case 4:
                combineIntoNoextend(vertexArray, [
                    x0, y0,1,
                    x1, y0,1,
                    x1, y1,1,
                    x0, y1,1
                ]);
                break;
            case 5:
                combineIntoNoextend(vertexArray, [
                    x0, y1,0,
                    x1, y1,0,
                    x1, y0,0,
                    x0, y0,0
                ]);
                break;
        }
        combineIntoNoextend(vertexArray, [
            x0, y1,
            x1, y1,
            x1, y0,
            x0, y0
        ]);
        l = Math.floor(indexArray.length / 6 * 4);
        if(x == 1 && y == 1)
            combineIntoNoextend(indexArray, [0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
    }

    i = vertexArray.length / 3;
    while(i--) {
        let offset = i * 3;
        let vertex = [
            vertexArray[offset+0] - 0.5,
            vertexArray[offset+1] - 0.5,
            vertexArray[offset+2] - 0.5,
        ];

        let len = Math.hypot(...vertex);
        vertex[0] /= 2 * len;
        vertex[1] /= 2 * len;
        vertex[2] /= 2 * len;

        vertexArray[offset+0] = vertex[0];
        vertexArray[offset+1] = vertex[1];
        vertexArray[offset+2] = vertex[2];
    }

    return {
        vertexArray,
        texCoordArray,
        indexArray,
    }
}

function combineIntoNoextend(array1, array2) {
    let len1 = array1.length;
    let iter = array2.length;
    while(iter--) array1[iter + len1] = array2[iter];
}

export default {
    createQuadSphere,
    Quad
};
