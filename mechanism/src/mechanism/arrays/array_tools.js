async function combine_into(array1, array2) {
    let iter = array2.length;
    while(iter--) array1[iter + array1.length] = array2[iter];
}
async function combine_into_pre_extend(array1, array2) {
    array1.length += array2.length;
    let iter = array2.length;
    while(iter--) array1[iter + array1.length] = array2[iter];
}

self.speed_test = (label, fn, iter = 10000000) => {
    console.time(label);
    while(iter--) fn(iter);
    console.timeEnd(label);
};

export default {
    combine_into,
    combine_into_pre_extend,
};

