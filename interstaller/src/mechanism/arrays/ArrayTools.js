self.speed_test = (label, callback, iter = 10000000) => {
    console.time(label);
    while(iter--) callback(iter);
    console.timeEnd(label);
};

function extend(target, source) {
    let len1 = target.length;
    let iter = source.length;
    target.length += iter;
    while(iter--) target[iter + len1] = source[iter];
}

function replaceFrom(target, startIndex, source) {
    let iter = source.length;
    while(iter--) target[iter + startIndex] = source[iter];
}

function binarySearch(array, value, accessor = v => v) {    
    let lower = -1, upper = array.length;
    let index = array.length >> 1;

    while(lower < index && index < upper) {
        if(accessor(array[index]) > accessor(value)) {
            upper = index;
        } else
        if(accessor(array[index]) < accessor(value)) {
            lower = index;
        } else {
            return index;
        }

        index = (upper + lower + 1) >> 1;
    }

    return null;
}

function binaryInsert(array, value, accessor = v => v) {
    let lower = -1, upper = array.length;
    let index = array.length >> 1;

    while(lower < index && index < upper) {
        if(accessor(array[index]) > accessor(value)) {
            upper = index;
        } else
        if(accessor(array[index]) < accessor(value)) {
            lower = index;
        } else {
            break;
        }

        index = (upper + lower + 1) >> 1;
    }

    array.splice(index, 0, value);
    return index;
}

export {
    extend,
    replaceFrom,
    binarySearch,
    binaryInsert
};

