import "./math/vector.js"
import "./math/matrix.js"

self.rSeed = new Uint32Array([2, 0, 0]);
self.rand = () => {
  rSeed[0] += 0xe120fc15;
  rSeed[1] = rSeed[0] * 0x4a39b70d;
  rSeed[2] = (rSeed[1] >> 16) ^ rSeed[1];
  rSeed[1] = rSeed[2] * 0x12fad5c9;
  rSeed[2] = (rSeed[1] >> 16) ^ rSeed[1];
  return rSeed[2];
}

(function() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  (window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  })();

  let sectors = [];

  let [xOff, yOff] = [1 << 4, 0];
  addEventListener("keydown", e => {
    switch(e.code) {
      case "KeyA":
        xOff -= 10;
        break;
      case "KeyD":
        xOff += 10;
        break;
      case "KeyW":
        yOff -= 10;
        break;
      case "KeyS":
        yOff += 10;
        break;
    }
  });

  for(let i = 0;i <= 32 * 32;i++) {
    const [x, y] = [i % 128, Math.floor(i / 128)];
    rSeed[0] = y << 16 | x;
    // r.fillStyle = `rgb(${[rand() % 256, rand() % 256, rand() % 256]})`
    // if(rand() % 256 < 16)
      // r.fillRect(x, y, 1, 1);
  }

  let clrColor = new Uint8Array([32,12,46]);

  let then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;

    ctx.fillStyle = `rgba(${clrColor}, 1)`;
    ctx.fillRect(0,0, innerWidth, innerHeight);

    for(let i = 0;i <= 128 * 128;i++) {
      const [x, y] = [i % 128, Math.floor(i / 128)];
      rSeed[0] = (y + yOff) << 16 | (x + xOff);
      ctx.fillStyle = `rgb(${[rand() % 256, rand() % 256, rand() % 256]})`
      if(rand() % 256 < 32)
        ctx.fillRect(x, y, 1, 1);
    }
  }
  requestAnimationFrame(main);
})();
