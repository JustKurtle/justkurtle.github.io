import "./jiph/core.js"
import "../deps/gl-matrix.js";
Object.assign(self, glMatrix);

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
    camera.projection = mat4.create();
    camera.lookAt = mat4.create();


    let level = Level.create();
    console.time("level load");
    Level.load(level, gl, { path: "assets/level1.json", camera });
    console.timeEnd("level load");

    self.lenny = Lenny.create([1024,1,1024]);
    console.time("lenny load");
    Lenny.load(lenny, gl);
    console.timeEnd("lenny load");

    let entities = [];
    let i = 100;
    while(i--) {
        let newCow = Cow.create([level.spawnableAreas[0], level.spawnableAreas[1], level.spawnableAreas[2]]);
        Cow.load(newCow, gl, { camera });
        entities.push(newCow);
    }
    
    let cRad = 0, cFwd = vec3.create(0,0,1), cRgt = vec3.create(1,0,0);
    addEventListener("mousemove", e => {
        cRad += e.movementX * settings.mouseSensitivity;
        vec3.set(cFwd, -Math.sin(cRad), 0, Math.cos(cRad));
        vec3.set(cRgt,  Math.cos(cRad), 0, Math.sin(cRad));
        if(settings.mouseShove) {
            let tempFwd = vec3.create();
            vec3.multiply(tempFwd, tempFwd, [-e.movementY,-e.movementY,-e.movementY]);
            vec3.add(lenny.pos, lenny.pos, tempFwd);
        }
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

        // {
        //     let i = entities.length
        //     while(i--) {
        //         let j = i;
        //         while(j--) { 
        //             entities[i].box.overlaps(entities[j]);
        //         }
        //     }
        // }
        
        marchProg += lenny.vel.mag * 100 * dt;
        let camOffset = vec3.fromValues(
            Math.sin(marchProg * 0.01) * 0.2, 
            Math.sin(marchProg * 0.02) * 0.1 + 0.5, 
            Math.cos(marchProg * 0.01) * 0.2
        );

        mat4.perspective(camera.projection, settings.fov, innerWidth / innerHeight, 0.1, 1000);

        mat4.translate(camera.lookAt, camera.lookAt, lenny.pos);
        mat4.rotate(camera.lookAt, camera.lookAt, cRad, [0,1,0]);

        scene.clear(gl);
        
        Level.draw(level, gl);
        for(let e of entities) Cow.draw(e, gl);
        Lenny.draw(lenny, gl, marchProg);

        requestAnimationFrame(main);
    }
    requestAnimationFrame(main);
})();
