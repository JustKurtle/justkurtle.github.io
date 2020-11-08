
addEventListener('message', message => {
  let [w, h] = message.data;

  let terrainData = [];

  let i = w * h * 32;
  while(i--) {
    terrainData[i] = 1;
  }
  
  postMessage(terrainData);
});