self.rSeed = new Uint32Array([2, 0, 0]);
self.rand = () => {
  rSeed[0] += 0xe120fc15;
  rSeed[1] = rSeed[0] * 0x4a39b70d;
  rSeed[2] = (rSeed[1] >> 16) ^ rSeed[1];
  rSeed[1] = rSeed[2] * 0x12fad5c9;
  rSeed[2] = (rSeed[1] >> 16) ^ rSeed[1];
  return rSeed[2];
}

self.addEventListener('message', e => {
  const [w, sy, xOff, yOff] = e.data;

  let canvas = new OffscreenCanvas(w, 1);
  let ctx = canvas.getContext("2d");

  for(let i = 0;i <= w;i++) {
    const [x, y] = [i % w, Math.floor(i / w)];
    rSeed[0] = (y + yOff + sy) << 16 | (x + xOff);
    ctx.fillStyle = `rgb(${[rand() % 256, rand() % 256, rand() % 256]})`
    if(rand() % 1024 < 64) ctx.fillRect(x, y, 1, 1);
  }

  self.postMessage([canvas.transferToImageBitmap(), 0, sy]);
});