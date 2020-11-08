import "./math.js"
import "./trees.js"

(function() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  (window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  })();

  const keyEvent = new Map();
  window.onkeydown = e => keyEvent.set(e.code, e);  
  window.onkeyup = e => keyEvent.delete(e.code);
  
  let clrColor = new Uint8Array([32,12,46]);

  let tree = new QuadTree([innerWidth / 2, innerHeight / 2],[innerWidth / 2, innerHeight / 2],16);
  
  let [w, h] = [2, 2];
  {
    let i = 4098 * 4;
    while(i--) {
      let [x, y] = [Math.random()*innerWidth-0.5, Math.random()*innerHeight-0.5];
      tree.set([x,y],[1,1],new AABB(x,y,1,1));
    }
  }
  let findPos = new Vec3();
  window.onmousemove = e => {
    findPos.x = e.x;
    findPos.y = e.y;
    if(e.buttons > 0) {
      let [x, y] = [e.x-w/2,e.y-h/2];
      tree.set([x,y],[w,h], new AABB(x,y,w,h));
    }
  };
  let searchSize = [32, 32];

  let then = 0;
  function main(now) {
    requestAnimationFrame(main);
    const dt = (now - then) * 0.001;
    then = now;

    ctx.fillStyle = `rgba(${clrColor}, 1)`;
    ctx.fillRect(0,0, innerWidth, innerHeight);

    let points = tree.get(findPos,searchSize);
    for(let v of points) {
      ctx.fillStyle = "#00FF98";
      ctx.fillRect(v.x,v.y,v.w,v.h);
    }   
  }
  requestAnimationFrame(main);
})();
