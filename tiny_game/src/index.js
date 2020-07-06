import "./vector.js"
import "./aabb.js"
import "./game_object.js"
import "./mapData.js"


;(function() {
  let viewport = document.getElementById("viewport");
  let ctx = viewport.getContext("2d");

  function resize() {
    viewport.width = self.innerWidth;
    viewport.height = self.innerHeight;
  }

  addEventListener("resize", resize);
  resize();

  const walls = new MapData([
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  ], "#ffffff", 20, 100);
  const log = new PhysBox(100, 100, 80, 140, "#00f00f");
  log.jump = new AABB(log.pos, 80, 142);
  log.grounded = false;

  let keys = {};
  addEventListener("keydown", e => { keys[e.code] = true; });
  addEventListener("keyup", e => { keys[e.code] = false; });
  function main(now) {
    requestAnimationFrame(main);
    ctx.fillStyle = "#00aff2";
    ctx.fillRect(0, 0, self.innerWidth, self.innerHeight);

    log.update();
    walls.update();

    if(keys.KeyA) log.vel.x -= (log.grounded) ? 8 : 0.8;
    if(keys.KeyD) log.vel.x += (log.grounded) ? 8 : 0.8;
    if(keys.Space && log.grounded) { log.vel.y -= 24; }
    log.grounded = false;

    log.vel.y += 2;

    for(let w of walls.lvl) {
      const poob = log.aabb.minDist(w);
      log.vel.a(1, poob);
      log.pos.a(1, poob);
      log.grounded = log.jump.minDist(w).y != 0 || log.grounded;
    }

    walls.draw(ctx);
    log.draw(ctx);
  }
  requestAnimationFrame(main);
})();
