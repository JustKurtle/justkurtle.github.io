function logGeometryData(primitive, vertexArrayLength, indexArrayLength) {
    const ENDL ="\n  ";
    console.log(`${primitive + ENDL + vertexArrayLength / 3} Verticies${ENDL + indexArrayLength} Indicies`);
}

const Geometry = {
    Quad(width) {
        let vertexPositionArray = [];
        let textureCoordArray = [];
        let indexArray = [];

        let s = 1 / width;
        let a = width + 1;

        let i = a ** 2;
        while(i--) {
            let x = (i % a) * s;
            let y = (Math.floor(i / a) % a) * s;

            combine_arrays(vertexPositionArray, [x, y, 0]);
            combine_arrays(textureCoordArray, [x, y]);
            
            if(x != 1 && y != 1)
                combine_arrays(indexArray, [
                    i, 1+a+i, 1+0+i,
                    i, 0+a+i, 1+a+i,
                ]);
        }

        i = vertexPositionArray.length / 3;
        while(i--) {
            const offset = i * 3;

            vertexPositionArray[offset+0] -= 0.5;
            vertexPositionArray[offset+1] -= 0.5;
        }

        logGeometryData(
            "Quad",
            vertexPositionArray.length,
            indexArray.length
        );

        return {
            vertexPositionArray,
            textureCoordArray,
            indexArray,
        }
    },
    QuadSphere(quadsWide) {
        let vertexPositionArray = [];
        let textureCoordArray = [];
        let indexArray = [];

        let s = 1 / quadsWide;
        let a = quadsWide + 1;

        let i = a ** 2 * 6;
        while(i--) {
            let x = (i % a) * s;
            let y = (Math.floor(i / a) % a) * s;

            switch(Math.floor(i / (a ** 2))) {
                case 0:
                    combine_arrays(vertexPositionArray, [x, 0, 1 - y]);
                    break;
                case 1:   
                    combine_arrays(vertexPositionArray, [x, 1, y]);
                    break;
                case 2:
                    combine_arrays(vertexPositionArray, [1, x, 1 - y]);
                    break;
                case 3:
                    combine_arrays(vertexPositionArray, [0, x, y]);
                    break;
                case 4:
                    combine_arrays(vertexPositionArray, [x, 1 - y, 1]);
                    break;
                case 5:
                    combine_arrays(vertexPositionArray, [x, y, 0]);
                    break;
            }
            combine_arrays(textureCoordArray, [x, y]);
            
            if(x != 1 && y != 1)
                combine_arrays(indexArray, [
                    i, 1+a+i, 1+0+i,
                    i, 0+a+i, 1+a+i,
                ]);
        }
        
        i = vertexPositionArray.length / 3;
        while(i--) {
            const offset = i * 3;
            let vertex = [
                vertexPositionArray[offset+0] - 0.5,
                vertexPositionArray[offset+1] - 0.5,
                vertexPositionArray[offset+2] - 0.5,
            ];
            
            let len = Math.hypot(...vertex);
            vertex[0] /= 2 * len;
            vertex[1] /= 2 * len;
            vertex[2] /= 2 * len;
            
            vertexPositionArray[offset+0] = vertex[0];
            vertexPositionArray[offset+1] = vertex[1];
            vertexPositionArray[offset+2] = vertex[2];
        }
        
        logGeometryData(
            "QuadSphere",
            vertexPositionArray.length,
            indexArray.length
        );

        return {
            vertexPositionArray: new Float32Array(vertexPositionArray),
            textureCoordArray: new Float32Array(textureCoordArray),
            indexArray: new Uint16Array(indexArray),
        }
    },
}

export default Geometry;