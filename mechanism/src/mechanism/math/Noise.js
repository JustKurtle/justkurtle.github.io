let _seed = new BigUint64Array(2);
self.xorseed = (x, y) => _seed[0] = BigInt(x) + (BigInt(y) << 32n);
function xorstar() {
    _seed[0] = _seed[0] ? _seed[0] : BigInt((new Date()).getTime());

    _seed[0] ^= _seed[0] >> 12n;
	_seed[0] ^= _seed[0] << 25n;
	_seed[0] ^= _seed[0] >> 27n;

    _seed[1] = _seed[0] * BigInt("0x2545F4914F6CDD1D");
    return (Number(_seed[1] >> 11n) + 1) / Number.MAX_SAFE_INTEGER;
}

function noise(scale, steps, width, xoff = 0, yoff = 0) {
    const stride = width / steps++;
    let output = new Array(width ** 2);
    let noise = { width: steps, stride };

    for(let j = steps ** 2;j--;) {
        let x = Math.floor(stride * Math.floor(j % steps) + xoff);
        let y = Math.floor(stride * Math.floor(j / steps) + yoff);
        xorseed(x * 7239875, y * 7239875);
        noise[j] = (xorstar() * 2) - 1;
    }

    for(let i = output.length;i--;) {
        let x = i % width;
        let y = Math.floor(i / width);

        let nx1 = Math.floor(x / stride);
        let ny1 = Math.floor(y / stride) * noise.width;
        
        let nx2 = nx1 + 1;
        let ny2 = ny1 + noise.width;

        let dist = x / noise.stride;
        dist = dist - Math.floor(dist);

        let x_result1 = noise[nx2 + ny1] * dist + 
            noise[nx1 + ny1] * (1 - dist);
        let x_result2 = noise[nx2 + ny2] * dist + 
            noise[nx1 + ny2] * (1 - dist);
            
        dist = y / noise.stride;
        dist = dist - Math.floor(dist);

        output[i] = scale * (x_result2 * dist + 
            x_result1 * (1 - dist));
    }
    return output;
}

function layeredNoise(width, xoff = 0, yoff = 0) {
    let output = new Array(width ** 2);

    let noise0 = noise(16, 4, width, xoff * width, yoff * width);
    let noise1 = noise(8, 8, width, xoff * width + 91283, yoff * width + 98723);
    let noise2 = noise(4, 16, width, xoff * width + 7451, yoff * width + 11751);
    let noise3 = noise(2, 32, width, xoff * width + 59238, yoff * width + 38);
    let noise4 = noise(1, 64, width, xoff * width + 920148, yoff * width + 5938);

    for(let i = output.length;i--;)
        output[i] = -(
            noise0[i]
            + noise1[i]
            + noise2[i]
            + noise3[i]
            + noise4[i]
        );
    
    return output;
}

export {
    noise,
    layeredNoise,
    xorstar
};