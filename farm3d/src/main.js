import "./jiph/core.js"
import "./jiph/math.js"

import "./game/level.js"
import "./game/lenny.js"
import "./game/cow.js"

self.settings = {};
self.controls = {};
fetch("config.json")
        .then(response => response.json())
        .then(data => {
            self.settings = data.settings;
            self.controls = data.controls;
        });

(function() {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return;
    (window.onresize = () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        gl.viewport(0, 0, innerWidth, innerHeight);
    })();

    canvas.onclick = canvas.requestPointerLock;
    
    let camera = new jCamera();
    camera.lookAt = new Mat4();
    camera.projection = new Mat4();


    let entities = [];
    let i = 100;
    while(i--) {
        let newCow = Cow.create(new Vec3(Math.random() * 2048, 1, Math.random() * 2048));
        Cow.load(newCow, gl, { camera });
        entities.push(newCow);
    }

    let level = Level.create();
    Level.load(level, gl, { path: "assets/level1.json", camera });
    
    self.lenny = Lenny.create(new Vec3(1024,1,1024));
    Lenny.load(lenny, gl);
    
    let cRad = 0, cFwd = new Vec3(0,0,1), cRgt = new Vec3(1,0,0);
    addEventListener("mousemove", e => {
        cRad += e.movementX * settings.mouseSensitivity;
        cFwd = new Vec3(-Math.sin(cRad), 0, Math.cos(cRad));
        cRgt = new Vec3( Math.cos(cRad), 0, Math.sin(cRad));
        if(settings.mouseShove) lenny.vel.a(cFwd.m(-e.movementY, []));
    }, false);
    
    let queue = {};
    addEventListener("mousedown", e => queue["Mouse"+e.button] = true, false);
    addEventListener("mouseup", e => queue["Mouse"+e.button] = false, false);
    addEventListener("keydown", e => queue[e.code] = true, false);
    addEventListener("keyup", e => queue[e.code] = undefined, false);

    let scene = new jScene(gl);

    let marchProg = 1;

    self.then = 0;
    function main(now) {
        const dt = (now - then) * 0.001;
        then = now;
        
        for(let e of entities) Cow.update(e, dt, lenny);
        Lenny.update(lenny, dt);
        Lenny.control(lenny, queue, controls, cFwd, cRgt);

        
        marchProg += lenny.vel.mag * 100 * dt;
        let camOffset = new Vec3(
            Math.sin(marchProg * 0.01) * 0.2, 
            Math.sin(marchProg * 0.02) * 0.1 + 0.5, 
            Math.cos(marchProg * 0.01) * 0.2
        );

        camera.projection.perspective(0.1, 1000, settings.fov, innerWidth / innerHeight);
        camera.lookAt.lookTo(lenny.pos.a(camOffset, new Vec3()), cFwd).i();

        scene.clear(gl);
        
        Level.draw(level, gl);
        for(let e of entities) Cow.draw(e, gl);
        Lenny.draw(lenny, gl, marchProg);
        
        requestAnimationFrame(main);
    }
    requestAnimationFrame(main);
})();
