import "./jiph/core.js"
import "/deps/glm_import.js"

import Geometry from "./mechanism/resources/Geometry.js";
import ShaderTools from "./mechanism/rendering/ShaderTools.js";

import EntityContainer from "./mechanism/gaming/EntityContainer.js";

import Player from "./game/entities/player.js";
import Star from "./game/entities/Star.js";

import Components from "./game/components.js";
import Systems from "./game/systems.js";

import Game from "./jiph/game.js";

self.APP = {};

addEventListener("load", async function() {
    APP = Game.create(document.querySelector("#canvas"));
    // return on failure to get context
    if (!APP.gl) throw 'Failed to load "webgl2" canvas rendering context';

    addEventListener("resize", APP.resizeCallback, false);
    APP.resizeCallback(); // invoke and set default game resize callback 
    
    // asset loading
    let promises = [
        // load settings 
        fetch("config.json")
            .then(response => response.json())
            .then(data => APP.config = data),
        // load shaders
        fetch("assets/shaders/star.hlsl")
            .then(response => response.text())
            .then(data => APP.assets.shaders.star = ShaderTools.buildShader(APP.gl, data
                .split("#FILE_SPLIT"))),
        // load models 
        Geometry.createQuadSphere(20)
            .then(res => APP.assets.models.star = res),
    ]; 

    // load textures
    APP.assets.textures.star = jTexture(APP.gl, "assets/textures/star.png");
    await Promise.all(promises);

    APP.gl.canvas.onclick = APP.gl.canvas.requestPointerLock; // steal their mouse!
    {
        self.ECS = new EntityContainer();

        APP.camera = Components.camera();

        { // create and add entities
            ECS.addEntity(Player.create());
            
            // for(let i = 8000;i--;) 
            ECS.addEntity(Star.create());
        }

        // create and add systems
        ECS.addSystem(Player.behavior);
        ECS.addSystem(Systems.entityController);
        ECS.addSystem(Systems.physicsUpdate);
        ECS.addSystem(Systems.cameraUpdate);
        ECS.addSystem(Systems.modelUpdate);
        ECS.addSystem(Systems.renderUpdate);

        {
            APP.gl.enable(APP.gl.CULL_FACE);

            APP.gl.enable(APP.gl.DEPTH_TEST);
            APP.gl.depthFunc(APP.gl.LEQUAL);
        
            APP.gl.enable(APP.gl.BLEND);
            APP.gl.blendFunc(APP.gl.SRC_ALPHA, APP.gl.ONE_MINUS_SRC_ALPHA);
        
            APP.gl.clearColor(0.0, 0.02, 0.1, 1.0);
            APP.gl.clearDepth(1.0);
        }

        self.then = 0;
        async function main(now) {
            const dt = (now - then) * 0.001;
            then = now;
        
            APP.gl.clear(APP.gl.COLOR_BUFFER_BIT | APP.gl.DEPTH_BUFFER_BIT);

            ECS.run(dt);

            requestAnimationFrame(main);
        }
        requestAnimationFrame(main);
    }
}, false);

