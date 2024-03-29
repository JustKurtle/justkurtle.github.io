import AssetHandler from "./AssetHandler.js";
import Geometry from "./Geometry.js";

import Container from "./ecs/Container.js";
import Components from "../game/Components.js";
import Systems from "../game/Systems.js"

import Scene from "./rendering/Scene.js";
import RenderObject from "./rendering/RenderObject.js"

import Player from "../game/entities/player.js"
import Star from "../game/space/Star.js"

const Game = {
    create(canvas) {
        let obj = {
            "canvas": canvas,
            "gl": canvas.getContext("webgl2"),

            // for read in data
            "config": {
                "settings": {},
                "controls": {},
            },
            "assets": {}
        };
        return obj;
    },

    async setup(game) {
        setupResize(game); // invoke and set default game resize callback
        setupWebgl(game);
        
        await fetch("config.json") 
            .then(response => response.json())
            .then(data => game.config = data);
    
        await AssetHandler.loadFromFiles(game.assets, game.gl, [
            "batch.hlsl",
            "instance.hlsl",
            
            "star.hlsl",
            "star.png"
        ]);
        await AssetHandler.loadFromObjects(game.assets, game.gl, {
            "star.model": Geometry.QuadSphere(20),
            "block.model": Geometry.QuadSphere(1),
        });
    
        game.canvas.onclick = game.canvas.requestPointerLock; // steal their mouse!

        {
            game.ECS = Container.create();

            game.camera = Components.camera();
            game.scene = Scene.create();

            game.scene.setClearColor(game.gl, [0.0, 0.02, 0.1, 1.0]);
            game.scene.setProperties({
                "uProjectionMatrix": APP.camera.projectionMatrix,
                "uLookAtMatrix": APP.camera.lookAtMatrix,
            });

            Container.addEntity(game.ECS, Player.create());


            let star_render_object_ID = game.scene.addObject(
                RenderObject
                    .create(game.gl)
                    .setShader(game.assets.instance.shader)
                    .setModel(game.gl, game.assets.star.model)
                    .setProperties({
                        "uSampler": game.assets.star.texture
                    }));

            let i = 8192;
            while(i--) {
                let star = Star.create();
                star.renderData.instanceID = game.scene.addInstance(star_render_object_ID, star.renderData.data);
                
                Container.addEntity(game.ECS, star);
            }

            Container.addSystem(game.ECS,  Player.behavior);
            Container.addSystem(game.ECS, Systems.entityController);
            Container.addSystem(game.ECS, Systems.physicsUpdate);
            Container.addSystem(game.ECS, Systems.cameraUpdate);
            Container.addSystem(game.ECS, Systems.modelUpdate);
            Container.addSystem(game.ECS, function render({ renderData }) {
                if(!renderData) return -1;
                game.scene.updateInstance(
                    renderData.objectID,
                    renderData.instanceID,
                    renderData.data
                );
            });
        }
    },

    update(game, dt) {
        game.gl.clear(game.gl.COLOR_BUFFER_BIT | game.gl.DEPTH_BUFFER_BIT);

        Container.runSystems(game.ECS, dt);
        
        game.scene.render(game.gl);
    }
};

function setupResize(game) {
    function resize(e) {
        game.canvas.width = innerWidth;
        game.canvas.height = innerHeight;
        game.gl.viewport(0, 0, innerWidth, innerHeight);
    };
    resize();
    // to resize the canvas when the window changes~
    addEventListener("resize", resize, false);
};

function setupWebgl(game) {
    if (!game.gl) return "webgl failed to load"; // return on failure to get context

    game.gl.enable(game.gl.CULL_FACE);

    game.gl.enable(game.gl.DEPTH_TEST);
    game.gl.depthFunc(game.gl.LEQUAL);

    game.gl.enable(game.gl.BLEND);
    game.gl.blendFunc(game.gl.SRC_ALPHA, game.gl.ONE_MINUS_SRC_ALPHA);

    // game.gl.clearColor(0.0, 0.02, 0.1, 1.0);
    game.gl.clearDepth(1.0);
};

Object.freeze(Game);
export default Game;