
addEventListener('message', message => {
  let [w, h] = message.data;
  let terrainData = [];

  let i = w * h;
  while(i--) {
    terrainData[i] = 1;
  }
  
  postMessage(terrainData);
});