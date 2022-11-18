import "./jiph/core.js";
import "../deps/gl-matrix.js";
Object.assign(self, glMatrix);

import Game from "./game.js";

import Level from "./game/level.js";
import Lenny from "./game/lenny.js";
import Cow from "./game/cow.js";

self.APP = {};

addEventListener("load", onload, false);

async function onload() {
    // get the canvas
    let canvas = document.querySelector("#canvas");
    // pass the canvas as an 
    APP = Game.create(canvas);
    if (!APP.gl) throw "Failed to load webgl2"; // return on failure to get context

    self.addEventListener("resize", APP.resizeCallback, false);
    APP.resizeCallback(); // invoke and set default game resize callback 

    // load settings 
    await fetch("config.json") 
        .then(response => response.json())
        .then(data => {
            APP.config = data;
        });
    // load models 
    await fetch("assets/models/level1.json")
        .then(response => response.json())
        .then(data => {
            APP.assets.models.level1 = data;
        });
    // load shaders
    await fetch("/assets/shaders/cow.hlsl")
        .then(response => response.text())
        .then(data => APP.assets.shaders.cow = jShader(APP.gl, data
            .replaceAll("#VERTEX", "")
            .split("#FRAGMENT")) );
    await fetch("/assets/shaders/lenny.hlsl")
        .then(response => response.text())
        .then(data => APP.assets.shaders.lenny = jShader(APP.gl, data
            .replaceAll("#VERTEX", "")
            .split("#FRAGMENT")) );
    await fetch("/assets/shaders/level.hlsl")
        .then(response => response.text())
        .then(data => APP.assets.shaders.level = jShader(APP.gl, data
            .replaceAll("#VERTEX", "")
            .split("#FRAGMENT")) );
    
    APP.canvas.onclick = APP.canvas.requestPointerLock;

    let camera = jCamera.create();
    camera.projectionMatrix = mat4.create();
    camera.lookAtMatrix = mat4.create();

    APP.level = Level.create();
    console.time("level load");
    Level.load(APP.level, APP.gl, { camera });
    console.timeEnd("level load");

    APP.lenny = Lenny.create([0,1,0]);
    console.time("lenny load");
    Lenny.load(APP.lenny, APP.gl);
    console.timeEnd("lenny load");

    APP.camera = camera;

    APP.entities = [];
    let i = 1000; // how many cows
    while(i--) {
        // let newCow = Cow.create([APP.level.spawnableAreas[3 * i], APP.level.spawnableAreas[3 * i + 1], APP.level.spawnableAreas[3 * i + 2]]);
        let newCow = Cow.create([Math.random() * 2000 - 1000, 1, Math.random() * 2000 - 1000]);
        Cow.load(newCow, APP.gl, { camera });
        APP.entities[i] = newCow;
    }

    loaded();
}

async function loaded() {
    let cRad = 0, cFwd = vec3.fromValues(0,0,1), cRgt = vec3.fromValues(1,0,0);
    self.addEventListener("mousemove", e => {
        cRad += e.movementX * APP.config.settings.mouseSensitivity;

        let sin = Math.sin(cRad), cos = Math.cos(cRad);

        vec3.set(cFwd,-sin, 0, cos);
        vec3.set(cRgt, cos, 0, sin);
        
        if(APP.config.settings.mouseShove) {
            let tempFwd = vec3.create();
            let speed = 0.2 * -e.movementY;
            vec3.multiply(tempFwd, cFwd, [speed, speed, speed]);
            vec3.add(APP.lenny.vel, APP.lenny.vel, tempFwd);
        }
        // console.log(cRad, cFwd, cRgt);
    }, false);

    let queue = {}; // event queue
    self.addEventListener("mousedown", e => queue["Mouse"+e.button] = true, false);
    self.addEventListener("mouseup", e => queue["Mouse"+e.button] = false, false);
    self.addEventListener("keydown", e => queue[e.code] = true, false);
    self.addEventListener("keyup", e => queue[e.code] = undefined, false);

    let scene = new jScene(APP.gl);

    let then = 0;
    function main(now) {
        const dt = (now - then) * 0.001; // deltaTime
        then = now;

        Lenny.control(APP.lenny, queue, APP.config.controls, cFwd, cRgt);

        for(let i = APP.entities.length;i--;) Cow.update(APP.entities[i], dt, APP.lenny);
        Lenny.update(APP.lenny, dt);


        // todo: animation shit for lenny should be moved to lenny
        let camOffset = vec3.fromValues( 
            Math.sin(APP.lenny.stepProgress) * 0.2,
            Math.sin(APP.lenny.stepProgress * 2) * 0.1 - 0.5,
            Math.cos(APP.lenny.stepProgress) * 0.2
        );
        vec3.subtract(camOffset, APP.lenny.pos, camOffset);

        // todo: camera movement things should maybe be moved to a camera file
        mat4.perspective(APP.camera.projectionMatrix, APP.config.settings.fov, innerWidth / innerHeight, 0.1, Number.MAX_SAFE_INTEGER);
        mat4.lookAt(APP.camera.lookAtMatrix, camOffset, vec3.add(vec3.create(), camOffset, cFwd), [0, 1, 0]);

        scene.clear(APP.gl);

        Level.draw(APP.level, APP.gl);

        for(let i = APP.entities.length;i--;) Cow.draw(APP.entities[i], APP.gl, dt, APP.camera);
        Lenny.draw(APP.lenny, APP.gl, dt, APP.camera);

        self.requestAnimationFrame(main);
    }
    self.requestAnimationFrame(main);
};
