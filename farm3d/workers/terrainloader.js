
addEventListener('message', message => {
    let [w, h] = message.data;
  
    let vPos = [], tCoord = [], index = [];
    let x = w, y = h;
    while(y--) {
        x = w;
        while(x--) {
            vPos = vPos.concat([
                  0 + x * 64, 0, 64 + y * 64, 
                 64 + x * 64, 0, 64 + y * 64, 
                 64 + x * 64, 0,  0 + y * 64,   
                  0 + x * 64, 0,  0 + y * 64]);
            tCoord = tCoord.concat([0,0, 1,0, 1,1, 0,1]);
            let l = Math.floor(index.length / 6 * 4);
            index = index.concat([0 + l, 1 + l, 2 + l,   0 + l, 2 + l, 3 + l]);
        }
        postMessage([vPos, tCoord, index]);
    }
    
  });