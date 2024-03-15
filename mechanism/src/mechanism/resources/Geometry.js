import {concatFloat32Arrays, concatUint16Arrays, replaceFrom} from "../arrays/ArrayTools.js"

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
        let y = Math.floor(i / sideWidth) * invSideWidth;

        replaceFrom(vertexArray, i * 3, [y - 0.5, x - 0.5, 0]);

        replaceFrom(texCoordArray, i * 2, [y, 1-x]);

        if(x != 1 && y != 1) {
            let a = i,
                b = a + 1,
                c = b + sideWidth,
                d = c - 1;
            replaceFrom(indexArray, j, [a,b,c,  a,c,d]);
            j += 6;
        }
    }

    return {
        vertexArray,
        texCoordArray,
        indexArray,
    }
}

function createCube(sideWidth) {
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
                replaceFrom(vertexArray, i * 3, [ y, x,-0.5]);
                break;
            case 1:
                replaceFrom(vertexArray, i * 3, [ x, y, 0.5]);
                break;
            case 2:
                replaceFrom(vertexArray, i * 3, [ x,-0.5, y]);
                break;
            case 3:
                replaceFrom(vertexArray, i * 3, [ y, 0.5, x]);
                break;
            case 4:
                replaceFrom(vertexArray, i * 3, [-0.5, y, x]);
                break;
            case 5:
                replaceFrom(vertexArray, i * 3, [ 0.5, x, y]);
                break;
        }

        x += 0.5, y += 0.5;
        replaceFrom(texCoordArray, i * 2, [x, y]);

        if(x != 1 && y != 1) {
            let a = i,
                b = a + 1,
                c = b + sideWidth,
                d = c - 1;
            replaceFrom(indexArray, j, [a,b,c,  a,c,d]);
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
    let output = createCube(sideWidth);

    let vertexCount = ++sideWidth ** 2 * 3;

    let i = output.vertexArray.length / 18;
    while(i--) {
        let index = i * 3;
        let len = 0.5 / Math.hypot(output.vertexArray[index], output.vertexArray[index+1], output.vertexArray[index+2]);

        do {
            output.vertexArray[index+0] *= len;
            output.vertexArray[index+1] *= len;
            output.vertexArray[index+2] *= len;
            
            index += vertexCount;
        }
        while(index < output.vertexArray.length);
    }

    return output;
}

function extendGeometry(target, src) {
    let targetLength = target.vertexArray.length / 3;

    return {
        vertexArray: concatFloat32Arrays(target.vertexArray, src.vertexArray),
        texCoordArray: concatFloat32Arrays(target.texCoordArray, src.texCoordArray),
        indexArray: concatUint16Arrays(target.indexArray, src.indexArray, targetLength),
    };
}

export default {
    createQuad,
    createQuadSphere,
    createCube,
    extendGeometry
};
