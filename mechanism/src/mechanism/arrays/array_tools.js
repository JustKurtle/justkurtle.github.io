function combineInto(array1, array2) {
    let len1 = array1.length;
    let iter = array2.length;
    array1.length += iter;
    while(iter--) array1[iter + len1] = array2[iter];
}

function combineIntoNoextend(array1, array2) {
    let len1 = array1.length;
    let iter = array2.length;
    while(iter--) array1[iter + len1] = array2[iter];
}

self.speed_test = (label, fn, iter = 10000000) => {
    console.time(label);
    while(iter--) fn(iter);
    console.timeEnd(label);
};

export default {
    combineInto,
    combineIntoNoextend,
};

