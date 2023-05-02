import "./jiph/core.js";
import "../deps/gl-matrix.js";
Object.assign(self, glMatrix);

import "./game/entities/level.js";
import "./game/entities/Player.js";

import Game from "./game/game.js"

import Container from "./jiph/container.js";
import Components from "./game/Components.js";
import Systems from "./game/Systems.js";

self.APP = {};

addEventListener("load", async function() {
    // get the canvas
    let canvas = document.querySelector("#canvas");
    // pass the canvas
    APP = Game.create(canvas);
    if (!APP.gl) throw "Failed to load webgl2"; // return on failure to get context

    canvas.width = 600;
    canvas.height = 400;
    // self.addEventListener("resize", APP.resizeCallback, false);
    // APP.resizeCallback(); // invoke and set default game resize callback 

    APP.canvas.onclick = APP.canvas.requestPointerLock;

    {
        // load settings 
        await fetch("config.json") 
            .then(response => response.json())
            .then(data => {
                APP.config = data;
            });
        // load models 
        // await fetch("assets/models/level1.json")
        //     .then(response => response.json())
        //     .then(data => {
        //         APP.assets.models.level1 = data;
        //     });
        // load shaders
        await fetch("assets/shaders/matte.hlsl")
            .then(response => response.text())
            .then(data => APP.assets.shaders.matte = jShader(APP.gl, data
                .replaceAll("#VERTEX", "")
                .split("#FRAGMENT")) );

        // load textures
        APP.assets.textures.benjamonkey_frank = jTexture(APP.gl, 'assets/textures/benjamonkey_frank.png');
        APP.assets.textures.ground = jTexture(APP.gl, 'assets/textures/ground.png');
        APP.assets.textures.guy = jTexture(APP.gl, 'assets/textures/guy.png');
        APP.assets.textures.station = jTexture(APP.gl, 'assets/textures/station.png');
    }

    APP.camera = Components.camera();

    APP.scene = Container.create();

    {
        let i = 10000;
        while(i--) {
            let entity = {
                "transform": Components.transform(),
                "rigidBody": Components.rigidBody(),
                "shaderMaterial": {},
            };
            Player.init(entity, APP);
            Container.addEntity(APP.scene, entity);
        }

        let entity = Player.create();
        Player.init(entity, APP);
        Container.addEntity(APP.scene, entity);
    }

    Container.addSystem(APP.scene, Player.playerControllerSystem);
    Container.addSystem(APP.scene, Systems.physicsUpdate);
    Container.addSystem(APP.scene, Systems.renderUpdate);

    {
        let then = 0;
        function main(now) {
            const dt = (now - then) * 0.001; // convert to time betweem
            then = now;

            // reset the orthographic projection in case the screen is resized
            mat4.ortho(
                APP.camera.projectionMatrix, 
                -1, 1, 
                -innerHeight / innerWidth, innerHeight / innerWidth, 
                0.1, Number.MAX_SAFE_INTEGER);

            APP.gl.clear(APP.gl.COLOR_BUFFER_BIT | APP.gl.DEPTH_BUFFER_BIT);

            Container.runSystems(APP.scene, dt);

            requestAnimationFrame(main);
        }
        requestAnimationFrame(main);
    }
}, false);