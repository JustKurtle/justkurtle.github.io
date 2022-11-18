function check(sMin, sMax, oMin, oMax) {
    const O1 = sMin <= oMax && sMin >= oMin,
          O2 = oMin <= sMax && oMin >= sMin;
    if(O1 || O2) {
        const min1 = oMax - sMin,
                min2 = oMin - sMax;
        if(min1 * min1 <= min2 * min2)
            return min1;
        return min2;
    }
    return 0;
}

// returns minimum distance to correct the overlap
self.rect = {
    Overlap(aPos, aSize, bPos, bSize) {
        const x = check(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
        const y = check(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);

        if(x * x < y * y) 
            return [x, 0];
        return [0, y];
    },
    Contain(aPos, aSize, bPos, bSize) {
        const x = check(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
        const y = check(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);
    
        if(x * x < y * y) 
            return [x, 0];
        return [0, y];
    },
    // returns true if the rectangles have any common ground
    Overlaps(aPos, aSize, bPos, bSize) {
        return !(
            aPos[0] >= bPos[0] + bSize[0] ||
            aPos[0] + aSize[0] <= bPos[0] ||
            aPos[1] >= bPos[1] + bSize[1] ||
            aPos[1] + aSize[1] <= bPos[1]
        );
    },
    // returns true if rectangle b is entirely contained within rectangle a 
    Contains(aPos, aSize, bPos, bSize) {
        return !(
            aPos[0] >= bPos[0] ||
            aPos[0] + aSize[0] <= bPos[0] + bSize[0] ||
            aPos[1] >= bPos[1] ||
            aPos[1] + aSize[1] <= bPos[1] + bSize[1]
        );
    },

    lineIntersect(linePos, lineVector, rectPos, rectSize) {
        rectPos = [rectPos[0] - linePos[0], rectPos[1] - linePos[1]]; // Make rectPos relative to linePos
        lineVector = [lineVector[0] || 1e-20, lineVector[1] || 1e-20]; // Make sure no exact 0s
        const slope = lineVector[1] / lineVector[0];
        let out = 1;
    
        let y1 = rectPos[0] * slope, 
            y2 = (rectPos[0] + rectSize[0]) * slope, 
            x1 = rectPos[1] / slope, 
            x2 = (rectPos[1] + rectSize[1]) / slope;
    
        if(rectPos[1] <= y1 && rectPos[1] + rectSize[1] >= y1)
            out = Math.min(out, y1 / lineVector[1]);
        if(rectPos[1] <= y2 && rectPos[1] + rectSize[1] >= y2)
            out = Math.min(out, y2 / lineVector[1]);
        if(rectPos[0] <= x1 && rectPos[0] + rectSize[0] >= x1)
            out = Math.min(out, x1 / lineVector[0]);
        if(rectPos[0] <= x2 && rectPos[0] + rectSize[0] >= x2)
            out = Math.min(out, x2 / lineVector[0]);
    
        if (out >= 0) 
            return out;
        return 1;
    },
    lineIntersects(linePos, lineVector, rectPos, rectSize) {
        rectPos = [rectPos[0] - linePos[0], rectPos[1] - linePos[1]]; // Make rectPos relative to linePos
        lineVector = [lineVector[0] || 1e-20, lineVector[1] || 1e-20]; // Make sure no exact 0s
        const slope = lineVector[1] / lineVector[0];
        let out = 1;
    
        let y1 = rectPos[0] * slope, 
            y2 = (rectPos[0] + rectSize[0]) * slope, 
            x1 = rectPos[1] / slope, 
            x2 = (rectPos[1] + rectSize[1]) / slope;
    
        if(rectPos[1] <= y1 && rectPos[1] + rectSize[1] >= y1)
            out = Math.min(out, y1 / lineVector[1]);
        if(rectPos[1] <= y2 && rectPos[1] + rectSize[1] >= y2)
            out = Math.min(out, y2 / lineVector[1]);
        if(rectPos[0] <= x1 && rectPos[0] + rectSize[0] >= x1)
            out = Math.min(out, x1 / lineVector[0]);
        if(rectPos[0] <= x2 && rectPos[0] + rectSize[0] >= x2)
            out = Math.min(out, x2 / lineVector[0]);
    
        return out >= 0 && out <= 1;
    }
};
// returns minimum distance to correct the overlap
self.boxOverlap = (aPos, aSize, bPos, bSize) => {
  const x = check(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
  const y = check(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);
  const z = check(aPos[2], aPos[2] + aSize[2], bPos[2], bPos[2] + bSize[2]);

  if(Math.min(x * x, y * y, z * z) === x * x)
      return [x, 0, 0];
  if(Math.min(x * x, y * y, z * z) === y * y)
      return [0, y, 0];
  return [0, 0, z];
};
// returns true if the boxes have any common ground
self.boxOverlaps = (aPos, aSize, bPos, bSize) => {
  return !(
      aPos[0] >= bPos[0] + bSize[0] ||
      aPos[0] + aSize[0] <= bPos[0] ||
      aPos[1] >= bPos[1] + bSize[1] ||
      aPos[1] + aSize[1] <= bPos[1] ||
      aPos[2] >= bPos[2] + bSize[2] ||
      aPos[2] + aSize[2] <= bPos[2]
  );
};
// returns true if box b is entirely contained within box a 
self.boxContains = (aPos, aSize, bPos, bSize) => {
  return !(
      aPos[0] >= bPos[0] ||
      aPos[0] + aSize[0] <= bPos[0] + bSize[0] ||
      aPos[1] >= bPos[1] ||
      aPos[1] + aSize[1] <= bPos[1] + bSize[1] ||
      aPos[2] >= bPos[2] ||
      aPos[2] + aSize[2] <= bPos[2] + bSize[2]
  );
}
self.rayBoxOverlap = (rayPos, rayVector, boxPos, boxSize) => {
    boxPos = [boxPos[0] - rayPos[0], boxPos[1] - rayPos[1], boxPos[2] - rayPos[2]]; // Make boxPos relative to rayPos
    rayVector = [rayVector[0] || 1e-50, rayVector[1] || 1e-50, rayVector[2] || 1e-50]; // Make sure no exact 0s
    const slopeYX = rayVector[1] / rayVector[0];
    const slopeZX = rayVector[2] / rayVector[0];
    let out = 1;

    let z1 = boxPos[0] * slopeZX, 
        z2 = (boxPos[0] + boxSize[0]) * slopeZX, 
        y1 = boxPos[0] * slopeYX, 
        y2 = (boxPos[0] + boxSize[0]) * slopeYX, 
        x1 = boxPos[1] / slopeYX,  
        x2 = (boxPos[1] + boxSize[1]) / slopeYX;

        
    if(boxPos[0] <= z1 && boxPos[0] + boxSize[0] >= z1)
        out = Math.min(out, z1 / rayVector[0]);
    if(boxPos[0] <= z2 && boxPos[0] + boxSize[0] >= z2)
        out = Math.min(out, z2 / rayVector[0]);
    if(boxPos[1] <= y1 && boxPos[1] + boxSize[1] >= y1)
        out = Math.min(out, y1 / rayVector[1]);
    if(boxPos[1] <= y2 && boxPos[1] + boxSize[1] >= y2)
        out = Math.min(out, y2 / rayVector[1]);
    if(boxPos[0] <= x1 && boxPos[0] + boxSize[0] >= x1)
        out = Math.min(out, x1 / rayVector[0]);
    if(boxPos[0] <= x2 && boxPos[0] + boxSize[0] >= x2)
        out = Math.min(out, x2 / rayVector[0]);

    if (out >= 0) 
        return out;
    return 1;
};
self.rayBoxOverlaps = (rayPos, rayVector, boxPos, boxSize) => {
    boxPos = [boxPos[0] - rayPos[0], boxPos[1] - rayPos[1], boxPos[2] - rayPos[2]]; // Make boxPos relative to rayPos
    rayVector = [rayVector[0] || 1e-50, rayVector[1] || 1e-50, rayVector[2] || 1e-50]; // Make sure no exact 0s
    const slopeYX = rayVector[1] / rayVector[0];
    const slopeZX = rayVector[2] / rayVector[0];
    let out = 1;

    let z1 = boxPos[0] * slopeZX, 
        z2 = (boxPos[0] + boxSize[0]) * slopeZX, 
        y1 = boxPos[0] * slopeYX, 
        y2 = (boxPos[0] + boxSize[0]) * slopeYX, 
        x1 = boxPos[1] / slopeYX,  
        x2 = (boxPos[1] + boxSize[1]) / slopeYX;

        
    if(boxPos[0] <= z1 && boxPos[0] + boxSize[0] >= z1)
        out = Math.min(out, z1 / rayVector[0]);
    if(boxPos[0] <= z2 && boxPos[0] + boxSize[0] >= z2)
        out = Math.min(out, z2 / rayVector[0]);
    if(boxPos[1] <= y1 && boxPos[1] + boxSize[1] >= y1)
        out = Math.min(out, y1 / rayVector[1]);
    if(boxPos[1] <= y2 && boxPos[1] + boxSize[1] >= y2)
        out = Math.min(out, y2 / rayVector[1]);
    if(boxPos[0] <= x1 && boxPos[0] + boxSize[0] >= x1)
        out = Math.min(out, x1 / rayVector[0]);
    if(boxPos[0] <= x2 && boxPos[0] + boxSize[0] >= x2)
        out = Math.min(out, x2 / rayVector[0]);

    return !(out < 0 || out > 1);
};


self.continuousRect = (rbPos, rbSize, rbMove, staticPos, staticSize) => {
    let corners = [
        [rbPos[0], rbPos[1]],
        [rbPos[0], (rbPos[1] + rbSize[1])],
        [(rbPos[0] + rbSize[0]), rbPos[1]],
        [(rbPos[0] + rbSize[0]), (rbPos[1] + rbSize[1])],
    ];

    let result1 = Math.min(
        rect.lineIntersect(corners[0], rbMove, staticPos, staticSize),
        rect.lineIntersect(corners[1], rbMove, staticPos, staticSize),
        rect.lineIntersect(corners[2], rbMove, staticPos, staticSize),
        rect.lineIntersect(corners[3], rbMove, staticPos, staticSize));

    
    if(Math.abs(rbMove[0] * result1 - rbMove[0]) > Math.abs(rbMove[1] * result1 - rbMove[1])) {
        rbMove[0] *= result1;
    } else {
        rbMove[1] *= result1;
    }
        
    ctx.strokeStyle = `#fff`;
    ctx2d_strokeLine(...corners[0], corners[0][0] + rbMove[0], corners[0][1] + rbMove[1]);
    ctx2d_strokeLine(...corners[1], corners[1][0] + rbMove[0], corners[1][1] + rbMove[1]);
    ctx2d_strokeLine(...corners[2], corners[2][0] + rbMove[0], corners[2][1] + rbMove[1]);
    ctx2d_strokeLine(...corners[3], corners[3][0] + rbMove[0], corners[3][1] + rbMove[1]);
};



self.ctx2d_strokeLine = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}
self.speed_test = (name, callback, iters = 2000000) => {
    console.time(name);
    while(iters--) callback(iters);
    console.timeEnd(name);
}