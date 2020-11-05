addEventListener('message', message => {
  let [w, h, d] = message.data;

  let terrainData = [];

  let i = 4098;
  while(i--) {
    let iw = i % w;
    let ih = (i / w | 0) % h;
    let id = (i / (w * h) | 0) % d;

    terrainData[i] = [iw, ih, id];
    console.log(terrainData[i]);
  }
  
  postMessage(terrainData);
});