self.rSeed = new Uint32Array([2, 0, 0]);
self.rand = () => {
  rSeed[0] += 0xe120fc15;
  rSeed[1] = rSeed[0] * 0x4a39b70d;
  rSeed[2] = (rSeed[1] >> 16) ^ rSeed[1];
  rSeed[1] = rSeed[2] * 0x12fad5c9;
  rSeed[2] = (rSeed[1] >> 16) ^ rSeed[1];
  return rSeed[2];
}

const canvas = new OffscreenCanvas(0, 0);
const ctx = canvas.getContext("2d");

self.addEventListener('message', e => {
  let [w, h, sx, sy, xOff, yOff] = e.data;
  sx *= w, sy *= h;

  canvas.width = w, canvas.height = h;

  let i = w * h;
  while(i--) {
    const [x, y] = [i % w, i / w | 0];
    rSeed[0] = (y + yOff + sy) << 16 | (x + xOff + sx);
    ctx.fillStyle = `rgb(${[rand() % 256, rand() % 256, rand() % 256]})`
    if(rand() % 1024 < 64) 
      ctx.fillRect(x, y, 1, 1);
  }

  self.postMessage([canvas.transferToImageBitmap(), sx, sy]);
});