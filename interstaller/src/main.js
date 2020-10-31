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

  let [xOff, yOff] = [1078, 1];
  
  const keys = [];
  window.onkeydown = e => (!e.repeat && keys.indexOf(e.code) < 0) ? keys.push(e.code) : undefined;
  window.onkeyup = e => delete keys[keys.indexOf(e.code)];

  let clrColor = new Uint8Array([32,12,46]);
  
  let workers = [
    new Worker('./src/worker.js'),
    new Worker('./src/worker.js'),
    new Worker('./src/worker.js'),
    new Worker('./src/worker.js'),
    new Worker('./src/worker.js'),
    new Worker('./src/worker.js'),
    new Worker('./src/worker.js'),
    new Worker('./src/worker.js'),
  ];

  const sectors = [];
  workers.forEach(e => e.addEventListener('message', e => {    
    sectors.push(e.data);
  }));

  {
    let i = innerHeight;
    console.log(i);
    while(i--) {
      workers[i % workers.length].postMessage([innerWidth, i, xOff, yOff]);
    }
  }

  let then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;
    {
      // let i = keys.length;
      // while(i--) {
      //   switch(keys[i]) {
      //     case "KeyW":
      //       yOff -= 1;
      //       break;
      //     case "KeyS":
      //       yOff += 1;
      //       break;
      //     case "KeyA":
      //       xOff -= 1;
      //       break;
      //     case "KeyD":
      //       xOff += 1;
      //       break;
      //   }
      // }
    }

    ctx.fillStyle = `rgba(${clrColor}, 1)`;
    ctx.fillRect(0,0, innerWidth, innerHeight);
    {
      let i = sectors.length;
      while(i--) ctx.drawImage(...sectors[i]);
    }
  }
  requestAnimationFrame(main);
})();
