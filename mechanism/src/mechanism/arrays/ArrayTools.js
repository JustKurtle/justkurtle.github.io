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

export default {
    extend,
    replaceFrom,
};

