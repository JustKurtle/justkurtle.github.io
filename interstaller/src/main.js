import "./jiph/core.js"
import "../deps/glm_import.js"

import Player from "./game/entities/player.js"

import Game from "./jiph/game.js";

import Container from "./jiph/container.js";
import Components from "./game/components.js";
import Systems from "./game/systems.js"

self.APP = {};

addEventListener("load", async function() {
    // get the canvas
    let canvas = document.querySelector("#canvas");
    // pass the canvas
    APP = Game.create(canvas);
    if (!APP.gl) throw 'Failed to load "webgl2" canvas rendering context'; // return on failure to get context

    addEventListener("resize", APP.resizeCallback, false);
    APP.resizeCallback(); // invoke and set default game resize callback 
    
    // asset loading
    {
        // load settings 
        await fetch("config.json") 
            .then(response => response.json())
            .then(data => APP.config = data);

        // load models 
        await fetch("assets/models/star.json")
            .then(response => response.json())
            .then(data => APP.assets.models.star = data);

        // load shaders
        await fetch("assets/shaders/chunk.hlsl")
            .then(response => response.text())
            .then(data => APP.assets.shaders.chunk = jShader(APP.gl, data
                .split("#FILE_SPLIT")));
        await fetch("assets/shaders/star.hlsl")
            .then(response => response.text())
            .then(data => APP.assets.shaders.star = jShader(APP.gl, data
                .split("#FILE_SPLIT")));

        // load textures
        APP.assets.textures.star = jTexture(APP.gl, "assets/textures/star.png");
    }

    APP.canvas.onclick = APP.canvas.requestPointerLock; // steal their mouse!

    {

        self.ECS = Container.create();

        APP.camera = Components.camera();

        { // create and add entities
            function createBall() {
                let ball = {
                    "transform": Components.transform(),
                    "rigidBody": Components.rigidBody(),

                    "shaderMaterial": {
                        "$shader": APP.assets.shaders.star,
                        ...jBuffers(APP.gl, {
                            aVertexPosition: { 
                                array: APP.assets.models.star.vertexArray, 
                                size: 3
                            },
                            aTextureCoord: { 
                                array: APP.assets.models.star.texCoordArray,
                                size: 2
                            },
                            index: { 
                                array: APP.assets.models.star.indexArray, 
                                size: 3, 
                                length: APP.assets.models.star.indexArray.length
                            },
                        }),
                
                        uModelViewMatrix: mat4.create(),
                        uSampler: APP.assets.textures.star,
    
                        uLookAtMatrix: APP.camera.lookAtMatrix,
                        uProjectionMatrix: APP.camera.projectionMatrix,
    
                        uGlow: 2.3,
                        uColor: vec4.fromValues(
                            Math.random() / 4 + 0.7,
                            Math.random() / 4 + 0.7,
                            Math.random() / 4 + 0.7,
                            1.0),
                    }

                };
                
                ball.transform.position[0] = Math.random() * 4000 - 2000;
                ball.transform.position[1] = Math.random() * 4000 - 2000;
                ball.transform.position[2] = Math.random() * 4000 - 2000;

                let scale = Math.random() * 5 + 0.7;
                ball.transform.scale[0] = scale;
                ball.transform.scale[1] = scale;
                ball.transform.scale[2] = scale;

                ball.rigidBody.angularVelocity[0] = Math.random() * 4 - 2;
                ball.rigidBody.angularVelocity[1] = Math.random() * 4 - 2;
                ball.rigidBody.angularVelocity[2] = Math.random() * 4 - 2;

                return ball;
            }
            // Container.addEntity(ECS, chunk);
            Container.addEntity(ECS, Player.create());

            let i = 8000;
            while(i--) Container.addEntity(ECS, createBall());
        }

        { // create and add systems

            Container.addSystem(ECS,  Player.behavior);
            Container.addSystem(ECS, Systems.entityController);
            Container.addSystem(ECS, Systems.physicsUpdate);
            Container.addSystem(ECS, Systems.cameraUpdate);
            Container.addSystem(ECS, Systems.modelUpdate);
            Container.addSystem(ECS, Systems.renderUpdate);

            Container.setCullSystem(ECS, ({ transform }) => {
                if(!transform) return -1;
                let position = vec3.create();
                vec3.subtract(
                    position,
                    transform.position,
                    APP.camera.position,
                );
                let squaredLength = vec3.squaredLength(position);
                vec3.normalize(position, position);
                return vec3.dot(APP.camera.forward, position) > APP.camera.fov / Math.PI - 0.1 || squaredLength <= 25;
            });
            // Container.addSystem(ECS, chunkRenderSys);
        }

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
        function main(now) {
            const dt = (now - then) * 0.001;
            then = now;
        
            APP.gl.clear(APP.gl.COLOR_BUFFER_BIT | APP.gl.DEPTH_BUFFER_BIT);

            // APP.assets.shaders.chunk.set({
            //     uSampler: APP.assets.textures.star,
            //     uLookAtMatrix: APP.camera.lookAtMatrix,
            //     uProjectionMatrix: APP.camera.projectionMatrix
            // });

            Container.runSystems(ECS, dt);

            requestAnimationFrame(main);
        }
        requestAnimationFrame(main);
    }
}, false);

