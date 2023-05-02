import AssetHandler from "./AssetHandler.js";
import Geometry from "./Geometry.js";

import Container from "./ecs/Container.js";

import RenderObject from "./rendering/RenderObject.js"
import Scene from "./rendering/Scene.js";

const Game = {
    create(canvas) {
        let gl = canvas.getContext("webgl2");
        let config = {
            "settings": {},
            "controls": {}
        };
        let assetHandler = {
            "models": {},
            "shaders": {},
            "textures": {}
        };
        let ecsContainer = {};
        
        // setup
        {
            fetch("config.json") 
                .then(response => response.json())
                .then(data => game.config = data);
            
            function resize(e) {
                canvas.width = innerWidth;
                canvas.height = innerHeight;
                gl.viewport(0, 0, innerWidth, innerHeight);
            };
            resize(); // to resize the canvas when the window changes~
            addEventListener("resize", resize, false);

            if (!gl) return "webgl failed to load"; // return on failure to get context
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            // gl.clearColor(0.0, 0.02, 0.1, 1.0);
            gl.clearDepth(1.0);
        }

        return {
            gl,

            config,
            assetHandler,

            setAssetHandler(handler) {
                assetHandler = handler;
                return this;
            },
            setContainerECS(container) {
                assetcontainer = container;
                return this;
            },

            run() {
                
            }
        };
    },
};
Object.freeze(Game);
export default Game;





const Gae = {
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
            game.container = Container.create();

            game.camera = Components.camera();
            game.scene = Scene.create();

            game.scene.setClearColor(game.gl, [0.0, 0.02, 0.1, 1.0]);
            game.scene.setProperties({
                "uProjectionMatrix": APP.camera.projectionMatrix,
                "uLookAtMatrix": APP.camera.lookAtMatrix,
            });

            game.container.addEntity(Player.create());


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
                
                game.container.addEntity(star);
            }

            game.container.addSystem( Player.behavior);
            game.container.addSystem(Systems.entityController);
            game.container.addSystem(Systems.physicsUpdate);
            game.container.addSystem(Systems.cameraUpdate);
            game.container.addSystem(Systems.modelUpdate);
            game.container.addSystem(function instanceUpdate({ renderData }) {
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

        Container.runSystems(dt);
        
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