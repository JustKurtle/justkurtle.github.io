importScripts("../src/jiph/math.js");

addEventListener('message', message => {
  let [w, h, d] = message.data;

  let terrainData = [];

  let i = w * h * d;
  while(i--) {
    terrainData[i] = 1;
  }
  
  postMessage(terrainData);
});