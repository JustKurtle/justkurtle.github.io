//@ts-check

/**
 * Quickly concatonate arrays without creating a new array
 * @param {any[]} target The array to append
 * @param {any[]} source The array to copy from
 */
function extend(target, source) {
    let len1 = target.length;
    let iter = source.length;
    target.length += iter;
    while(iter--) target[iter + len1] = source[iter];
}

/**
 * Quickly replace sections of an array with another
 * @param {any[]} target The array to append
 * @param {number} startIndex The index to start replacing from
 * @param {any[]} source The array to copy from
 */
function replaceFrom(target, startIndex, source) {
    let iter = source.length;
    while(iter--) target[iter + startIndex] = source[iter];
}

/**
 * searches a sorted array for a value or where it would be using a compare function
 * @param {any[]} array The array to search through
 * @param {any} min The minimum value to search for
 * @param {any} max The meximum value to search for
 * @param {Function} compare A function to compare the array's values to the provided value
 * @returns {number[]} The index of the found value or the position it would occupy
 */
function binarySearchRange(array, min, max, compare = (a, b) => a - b) {
    let output = [0, 0];
    
    let lower = -1, upper = array.length;
    // same as floor division by 2
    let index = array.length >> 1;
    
    while(upper - lower > 1) {
        let bounds_check = compare(array[index], min);

        if(bounds_check > 0) upper = index; else
        if(bounds_check < 0) lower = index; else 
            break;

        // same as ceil division by 2
        index = (upper + lower + 1) >> 1;
    }
    output[0] = index;

    upper = array.length;
    while(upper - lower > 1) {
        let bounds_check = compare(array[index], max);

        if(bounds_check > 0) upper = index; else
        if(bounds_check < 0) lower = index; else 
            break;

        // same as ceil division by 2
        index = (upper + lower + 1) >> 1;
    }
    output[1] = index;

    return output;
}

/**
 * searches a sorted array for a value using a compare function
 * @param {any[]} array The array to search through
 * @param {any} value The value to search for
 * @param {Function} compare A function to compare the array's values to the provided value
 * @returns {number | object} The index of the found value
 */
function binarySearch(array, value, compare = (a, b) => a - b) {    
    let lower = -1, upper = array.length;
    // same as floor division by 2
    let index = array.length >> 1;
    
    while(upper - lower > 1) {
        let bounds_check = compare(array[index], value);

        if(bounds_check > 0) upper = index; else
        if(bounds_check < 0) lower = index; else 
            return index;

        // same as ceil division by 2
        index = (upper + lower + 1) >> 1;
    }
    return { error: "value was not found" };
}

/**
 * Inserts a value into an array using an compare without disordering it
 * @param {any[]} array The array to search through
 * @param {any} value The value to search for
 * @param {Function} compare A function to compare the array's values to the provided value
 * @returns {number} The index of the value after it's inserted
 */
function binaryInsert(array, value, compare = (a, b) => a - b) {
    let lower = -1, upper = array.length;
    // same as floor division by 2
    let index = array.length >> 1;

    while(upper - lower > 1) {
        let bounds_check = compare(array[index], value);

        if(bounds_check < 0) lower = index; else
        if(bounds_check > 0) upper = index; else
            break;

        // same as ceil division by 2
        index = (upper + lower + 1) >> 1;
    }
    array.splice(index, 0, value);
    return index;
}

export {
    extend,
    replaceFrom,
    binarySearchRange,
    binarySearch,
    binaryInsert,
};

