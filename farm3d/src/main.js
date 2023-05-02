import "./jiph/core.js";
import "../deps/gl-matrix.js";
Object.assign(self, glMatrix);

import Game from "./game/game.js";

import Level from "./game/entities/level.js";
import Lenny from "./game/entities/lenny.js";
import Cow from "./game/entities/cow.js";

import Container from "./jiph/container.js"
import Systems from "./game/systems.js";
import Components from "./game/components.js";

self.APP = {};

addEventListener("load", async function() {
    // get the canvas
    let canvas = document.querySelector("#canvas");
    // pass the canvas
    APP = Game.create(canvas);
    if (!APP.gl) throw "Failed to load webgl2"; // return on failure to get context

    self.addEventListener("resize", APP.resizeCallback, false);
    APP.resizeCallback(); // invoke and set default game resize callback 

    APP.canvas.onclick = APP.canvas.requestPointerLock;

    {
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
        await fetch("assets/models/arms.json")
            .then(response => response.json())
            .then(data => {
                APP.assets.models.arms = data;
            });
        // load shaders
        await fetch("assets/shaders/cow.hlsl")
            .then(response => response.text())
            .then(data => APP.assets.shaders.cow = jShader(APP.gl, data
                .replaceAll("#VERTEX", "")
                .split("#FRAGMENT")) );
        await fetch("assets/shaders/arms.hlsl")
            .then(response => response.text())
            .then(data => APP.assets.shaders.arms = jShader(APP.gl, data
                .replaceAll("#VERTEX", "")
                .split("#FRAGMENT")) );
        await fetch("assets/shaders/level.hlsl")
            .then(response => response.text())
            .then(data => APP.assets.shaders.level = jShader(APP.gl, data
                .replaceAll("#VERTEX", "")
                .split("#FRAGMENT")) );

        // load textures
        APP.assets.textures.arm = jTexture(APP.gl, 'assets/textures/arm.png');
        APP.assets.textures.cow0 = jTexture(APP.gl, 'assets/textures/cow0.png');
        APP.assets.textures.cow1 = jTexture(APP.gl, 'assets/textures/cow1.png');
        APP.assets.textures.ground = jTexture(APP.gl, 'assets/textures/ground.png');
    }

    APP.camera = Components.camera();

    APP.level = Level.create();
    Level.init(APP.level, APP);

    APP.lenny = Lenny.create([0,1,0]);
    Lenny.init(APP.lenny, APP);

    self.env = Container.create();

    Container.addEntity(env, APP.lenny);

    let i = 6000; // how many cows to create
    while(i--) {
        let newCow = Cow.create();
        // Cow.init(newCow, [Math.random() * 2000 - 1000, 1, Math.random() * 2000 - 1000]);
        Cow.init(newCow, [0, 1, 0]);
        Container.addEntity(env, newCow);
    }

    {
        function renderingCull(entity, dt) {
            let position = vec3.subtract(vec3.create(), entity.transform.position, APP.camera.position);
            let distance = vec3.length(position)
            let dotProduct = vec3.dot(position, APP.camera.forward) / distance;

            return dotProduct < APP.camera.fov / (APP.camera.fov * APP.camera.aspect + APP.camera.fov) && distance > 5;
        }

        // Container.addSystem(env,    Cow.behavior);
        Container.addSystem(env,  Lenny.behavior);
        Container.addSystem(env, Systems.entityController);
        Container.addSystem(env, Systems.physicsUpdate, (entity) => !entity.lennyData);
        Container.addSystem(env, Systems.cameraUpdate);
        Container.addSystem(env, Systems.modelUpdate, renderingCull);
        Container.addSystem(env,  Lenny.lennySpecificRenderUpdate);
        Container.addSystem(env, Systems.renderUpdate, renderingCull);

        
    }

    {
        {
            // APP.gl.enable(APP.gl.CULL_FACE);

            APP.gl.enable(APP.gl.DEPTH_TEST);
            APP.gl.depthFunc(APP.gl.LEQUAL);

            APP.gl.enable(APP.gl.BLEND);
            APP.gl.blendFunc(APP.gl.SRC_ALPHA, APP.gl.ONE_MINUS_SRC_ALPHA);

            APP.gl.clearColor(0.19, 0.36, 0.74, 1.0);
            APP.gl.clearDepth(1.0);
        }

        let then = 0;
        function main(now) {
            const dt = (now - then) * 0.001; // deltaTime
            then = now;

            APP.gl.clear(APP.gl.COLOR_BUFFER_BIT | APP.gl.DEPTH_BUFFER_BIT);

            Container.runSystems(env, dt);
            Systems.renderUpdate(APP.level, APP.gl);
            
            requestAnimationFrame(main);
            // console.log(dt);
        }
        requestAnimationFrame(main);
    }
}, false);