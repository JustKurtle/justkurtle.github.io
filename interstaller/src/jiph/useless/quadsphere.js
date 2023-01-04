function createQuadSphere() {
    let vertexArray = [];
    let texCoordArray = [];
    let indexArray = [];

    let i = 64*6;
    while(i--) {
        let s = 1 / 8;
        let x0 = (i % 8) * s;
        let y0 = (Math.floor(i / 8) % 8) * s;
        let x1 = x0+s;
        let y1 = y0+s;
        let l
        switch(Math.floor(i / 64)) {
            case 0:   
                vertexArray = vertexArray.concat([
                    x0, 0, y0,
                    x1, 0, y0,
                    x1, 0, y1,
                    x0, 0, y1]);
                texCoordArray = texCoordArray.concat([
                    0.0,1.0,
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0]);
                l = Math.floor(indexArray.length / 6 * 4);
                indexArray = indexArray.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
                break;
            case 1:
                vertexArray = vertexArray.concat([
                    x0, 1, y1,
                    x1, 1, y1,
                    x1, 1, y0,
                    x0, 1, y0]);
                texCoordArray = texCoordArray.concat([
                    0.0,1.0,
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0]);
                l = Math.floor(indexArray.length / 6 * 4);
                indexArray = indexArray.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
                break;
            case 2:
                vertexArray = vertexArray.concat([
                    1, x0, y0,
                    1, x1, y0,
                    1, x1, y1,
                    1, x0, y1,]);
                texCoordArray = texCoordArray.concat([
                    0.0,1.0,
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0]);
                l = Math.floor(indexArray.length / 6 * 4);
                indexArray = indexArray.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
                break;
            case 3:
                vertexArray = vertexArray.concat([
                    0, x0, y1,
                    0, x1, y1,
                    0, x1, y0,
                    0, x0, y0,]);
                texCoordArray = texCoordArray.concat([
                    0.0,1.0,
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0]);
                l = Math.floor(indexArray.length / 6 * 4);
                indexArray = indexArray.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
                break;
            case 4:
                vertexArray = vertexArray.concat([
                    x0, y0,1,
                    x1, y0,1,
                    x1, y1,1,
                    x0, y1,1,]);
                texCoordArray = texCoordArray.concat([
                    0.0,1.0,
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0]);
                l = Math.floor(indexArray.length / 6 * 4);
                indexArray = indexArray.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
                break;
            case 5:
                vertexArray = vertexArray.concat([
                    x0, y1,0,
                    x1, y1,0,
                    x1, y0,0,
                    x0, y0,0,]);
                texCoordArray = texCoordArray.concat([
                    0.0,1.0,
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0]);
                l = Math.floor(indexArray.length / 6 * 4);
                indexArray = indexArray.concat([0 + l, 1 + l, 2 + l,  0 + l, 2 + l, 3 + l]);
                break;
        }
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
        vertexArray: vertexArray,
        texCoordArray: texCoordArray,
        indexArray: indexArray,
    }
}