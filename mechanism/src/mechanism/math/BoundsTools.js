function check(sMin, sMax, oMin, oMax) {
    const O1 = sMin <= oMax && sMin >= oMin;
    const O2 = oMin <= sMax && oMin >= sMin;
    if(O1 || O2) {
        const min1 = oMax - sMin;
        const min2 = oMin - sMax;
        return (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
    }
    return null;
}
function minmax_array(array) {
    let i = array.length - 1;
    let min = array[i];
    let max = array[i];
    while(i--) {
        min = Math.min(min, array[i]);
        max = Math.max(max, array[i]);
    }
    return {min, max};
}
function axis_overlap(aPos, aSize, bPos, bSize) {
    let aMin = aPos + aSize, aMax = aMin;
    if(aPos > aMin) aMax = aPos; else aMin = aPos;
    let bMin = bPos + bSize, bMax = bMin;
    if(bPos > bMin) bMax = bPos; else bMin = bPos;
    return (aMin >= bMax || aMax <= bMin);
}

// returns minimum distance to correct the overlap
function rectOverlap(aPos, aSize, bPos, bSize) {
    const x = check(aPos[0], aPos[0] + aSize[0], bPos[0], bPos[0] + bSize[0]);
    const y = check(aPos[1], aPos[1] + aSize[1], bPos[1], bPos[1] + bSize[1]);

    switch(Math.min(x * x, y * y)) {
        case x * x: 
            return [x, 0];
        case y * y:
            return [0, y];
        default:
            return [0, 0];
    }
}

/**
 * Checks if two rects overlap
 * @param {Float32Array} aPos The Position of a
 * @param {Float32Array} aSize The Size of a
 * @param {Float32Array} bPos The Position of b
 * @param {Float32Array} bSize The Size of b
 * @returns {boolean} True if they overlap, false if not
 */
function rectOverlaps(aPos, aSize, bPos, bSize) {
    let aMin0 = aPos[0] + aSize[0], aMax0 = aMin0;
    if(aPos[0] > aMin0) aMax0 = aPos[0]; else aMin0 = aPos[0];
    let bMin0 = bPos[0] + bSize[0], bMax0 = bMin0;
    if(bPos[0] > bMin0) bMax0 = bPos[0]; else bMin0 = bPos[0];
    if(aMin0 >= bMax0 || aMax0 <= bMin0) return false;

    let aMin1 = aPos[1] + aSize[1], aMax1 = aMin1;
    if(aPos[1] > aMin1) aMax1 = aPos[1]; else aMin1 = aPos[1];
    let bMin1 = bPos[1] + bSize[1], bMax1 = bMin1;
    if(bPos[1] > bMin1) bMax1 = bPos[1]; else bMin1 = bPos[1];
    if(aMin1 >= bMax1 || aMax1 <= bMin1) return false;

    return true;
}
/**
 * Checks if rect a contains rect b
 * @param {Float32Array} aPos The Position of a
 * @param {Float32Array} aSize The Size of a
 * @param {Float32Array} bPos The Position of b
 * @param {Float32Array} bSize The Size of b
 * @returns {boolean} True if a contains b, false if not
 */
function rectContains(aPos, aSize, bPos, bSize) {
    let aMin0 = aPos[0] + aSize[0], aMax0 = aMin0;
    if(aPos[0] > aMin0) aMax0 = aPos[0]; else aMin0 = aPos[0];
    let bMin0 = bPos[0] + bSize[0], bMax0 = bMin0;
    if(bPos[0] > bMin0) bMax0 = bPos[0]; else bMin0 = bPos[0];
    if(aMin0 >= bMin0 || aMax0 <= bMax0) return false;

    let aMin1 = aPos[1] + aSize[1], aMax1 = aMin1;
    if(aPos[1] > aMin1) aMax1 = aPos[1]; else aMin1 = aPos[1];
    let bMin1 = bPos[1] + bSize[1], bMax1 = bMin1;
    if(bPos[1] > bMin1) bMax1 = bPos[1]; else bMin1 = bPos[1];
    if(aMin1 >= bMin1 || aMax1 <= bMax1) return false;

    return true;
}
function lineRectOverlap(linePos, lineVector, rectPos, rectSize) {
    rectPos = [rectPos[0] - linePos[0], rectPos[1] - linePos[1]]; // Make rectPos relative to linePos
    lineVector = [lineVector[0] || 1e-50, lineVector[1] || 1e-50]; // Make sure no exact 0s
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
}
function lineRectOverlaps(linePos, lineVector, rectPos, rectSize) {
    return !Math.floor(lineRectOverlap(linePos, lineVector, rectPos, rectSize));
}

/**
 * Finds the normal of 
 * @param {Float32Array} target The vector to put the output into
 * @param {Float32Array} aPos The Position of a
 * @param {Float32Array} aSize The Size of a
 * @param {Float32Array} bPos The Position of b
 * @param {Float32Array} bSize The Size of b
 * @returns {Float32Array} True if they overlap, false if not
 */
function boxOverlapNormal(target, aPos, aSize, bPos, bSize) {
    target[0] = 0;
    target[1] = 0;
    target[2] = 0;
    
    let distance_x = aPos[0] - bPos[0];
    let distance_y = aPos[1] - bPos[1];
    let distance_z = aPos[2] - bPos[2];

    let x = Math.abs(distance_x) * 2 - aSize[0] - bSize[0];
    let y = Math.abs(distance_y) * 2 - aSize[1] - bSize[1];
    let z = Math.abs(distance_z) * 2 - aSize[2] - bSize[2];

    switch(Math.max(x, y, z)) {
        case x:
            target[0] = Math.sign(distance_x);
            return target;
        case y:
            target[1] = Math.sign(distance_y);
            return target;
        case z:
            target[2] = Math.sign(distance_z);
            return target;
    }
}

/**
 * @param {Float32Array} aVel The velocity of a
 * @param {Float32Array} aPos The position of a
 * @param {Float32Array} aSize The size of a
 * @param {Float32Array} bVel The velocity of b
 * @param {Float32Array} bPos The position of b
 * @param {Float32Array} bSize The size of b
 * @returns {number} returns how long ago the balls weren't colliding 
 */
function boxOverlapCorrection(aVel, aPos, aSize, bVel, bPos, bSize) {
    let speed_x = Math.abs(bVel[0]) + Math.abs(aVel[0]);
    let speed_y = Math.abs(bVel[1]) + Math.abs(aVel[1]);
    let speed_z = Math.abs(bVel[2]) + Math.abs(aVel[2]);

    let target_x = (aSize[0] + bSize[0]) / 2;
    let target_y = (aSize[1] + bSize[1]) / 2;
    let target_z = (aSize[2] + bSize[2]) / 2;

    let distance_x = Math.abs(bPos[0] - aPos[0]);
    let distance_y = Math.abs(bPos[1] - aPos[1]);
    let distance_z = Math.abs(bPos[2] - aPos[2]);

    let time_x = (distance_x - target_x) / speed_x;
    let time_y = (distance_y - target_y) / speed_y;
    let time_z = (distance_z - target_z) / speed_z;

    let output = Math.max(time_x, time_y, time_z);
    if(!output || -1 > output || output > 1) output = 0;
    return output;
}

/**
 * Checks if two boxes overlap
 * @param {Float32Array} aPos The Position of a
 * @param {Float32Array} aSize The Size of a
 * @param {Float32Array} bPos The Position of b
 * @param {Float32Array} bSize The Size of b
 * @returns {boolean} True if they overlap, false if not
 */
function boxOverlaps(aPos, aSize, bPos, bSize) {
    let aMin0 = aPos[0] + aSize[0], aMax0 = aMin0;
    if(aPos[0] > aMin0) aMax0 = aPos[0]; else aMin0 = aPos[0];
    let bMin0 = bPos[0] + bSize[0], bMax0 = bMin0;
    if(bPos[0] > bMin0) bMax0 = bPos[0]; else bMin0 = bPos[0];
    if(aMin0 >= bMax0 || aMax0 <= bMin0) return false;

    let aMin1 = aPos[1] + aSize[1], aMax1 = aMin1;
    if(aPos[1] > aMin1) aMax1 = aPos[1]; else aMin1 = aPos[1];
    let bMin1 = bPos[1] + bSize[1], bMax1 = bMin1;
    if(bPos[1] > bMin1) bMax1 = bPos[1]; else bMin1 = bPos[1];
    if(aMin1 >= bMax1 || aMax1 <= bMin1) return false;

    let aMin2 = aPos[2] + aSize[2], aMax2 = aMin2;
    if(aPos[2] > aMin2) aMax2 = aPos[2]; else aMin2 = aPos[2];
    let bMin2 = bPos[2] + bSize[2], bMax2 = bMin2;
    if(bPos[2] > bMin2) bMax2 = bPos[2]; else bMin2 = bPos[2];
    if(aMin2 >= bMax2 || aMax2 <= bMin2) return false;

    return true;
}

/**
 * @param {Float32Array} aVel The velocity of a
 * @param {Float32Array} aPos The position of a
 * @param {number} aRadius The radius of a
 * @param {Float32Array} bVel The velocity of b
 * @param {Float32Array} bPos The position of b
 * @param {number} bRadius The radius of b
 * @returns {number} returns how long ago the balls weren't colliding 
 */
function ballOverlapCorrection(aVel, aPos, aRadius, bVel, bPos, bRadius) {
    let aSpeed = aVel[0] * aVel[0] + aVel[1] * aVel[1] + aVel[2] * aVel[2];
    let bSpeed = bVel[0] * bVel[0] + bVel[1] * bVel[1] + bVel[2] * bVel[2];
    if(!(aSpeed + bSpeed)) return 0;

    let x = bPos[0] - aPos[0];
    let y = bPos[1] - aPos[1];
    let z = bPos[2] - aPos[2];

    let combined_radii = bRadius + aRadius;
    let distance = (x*x + y*y + z*z) ** 0.5;

    aSpeed **= 0.5;
    bSpeed **= 0.5;

    return (distance - combined_radii) / (aSpeed + bSpeed);
}
/**
 * 
 * @param {Float32Array} target The vector to put the output into
 * @param {Float32Array} aPos The position of a
 * @param {number} aRadius The radius of a
 * @param {Float32Array} bPos The position of b
 * @param {number} bRadius The radius of b
 * @returns {Float32Array} returns the normal vector of the collision
 */
function ballOverlapNormal(target, aPos, bPos) {
    let x = aPos[0] - bPos[0];
    let y = aPos[1] - bPos[1];
    let z = aPos[2] - bPos[2];

    let distance = x*x + y*y + z*z;
    let inv_distance = distance ** -0.5;

    target[0] = x * inv_distance;
    target[1] = y * inv_distance;
    target[2] = z * inv_distance;

    return target;
}
/**
 * Checks for overlap
 * @param {Float32Array} aPos The position of a
 * @param {number} aRadius The radius of a
 * @param {Float32Array} bPos The position of b
 * @param {number} bRadius The radius of b
 * @returns {boolean} True if a overlaps b, false if not
 */
function ballOverlaps(aPos, aRadius, bPos, bRadius) {
    let x = aPos[0] - bPos[0];
    let y = aPos[1] - bPos[1];
    let z = aPos[2] - bPos[2];

    let combined_radii = (bRadius + aRadius) ** 2;
    let distance = x*x + y*y + z*z;

    return (distance < combined_radii);
}

export {
    rectOverlap,
    rectOverlaps,
    rectContains,
    
    lineRectOverlap,
    lineRectOverlaps,
    
    boxOverlapCorrection,
    boxOverlapNormal,
    boxOverlaps,
    
    ballOverlapCorrection,
    ballOverlapNormal,
    ballOverlaps,
};