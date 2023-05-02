import "../../jiph/core.js"
import Animation from "../../jiph/animation.js"
import Components from "../components.js"

const Lenny = {
    create(pos) {
        let output = {
            "transform": Components.transform(),
            "rigidBody": Components.rigidBody(),
            "boxCollider": Components.boxCollider(),

            "entityController": Components.entityController(),
            "lennyBehavior": {
                "dash": {
                    "coolDown": 1, // how long the cooldown should be set to in seconds
                    "coolDownTimer": 0,
                    "speed": 150,
                },
            },
            "lennyData": {},

            "camera": Components.camera(),
            "shaderMaterial": {},

            "animations": {},
        };
        return output;
    },

    init(out, { camera, config }) {
        out.transform.position = vec3.fromValues(0,1,0);
        { // init graphics data
            out.shaderMaterial = {
                $shader: APP.assets.shaders.arms,
                ...jBuffers(APP.gl, {
                    aVertexPosition: { 
                        array: APP.assets.models.arms.vertexArray, 
                        size: 3
                    },
                    aTextureCoord: { 
                        array: APP.assets.models.arms.texCoordArray,
                        size: 2
                    },
                    index: { 
                        array: APP.assets.models.arms.index, 
                        size: 3,
                        length: APP.assets.models.arms.index.length
                    },
                }),
                uModelViewMatrix: mat4.create(),
                uProjectionMatrix: mat4.create(),
                uLookAtMatrix: mat4.create(),

                uSampler: APP.assets.textures.arm,
            };
        }
        
        { // init controls
            out.camera = camera;
            addEventListener("mousemove", e => {
                let thetaX = e.movementX * config.settings.mouseSensitivity;

                let sin = Math.sin(thetaX);
                let cos = Math.cos(thetaX);

                vec3.set(out.camera.forward,
                    out.camera.forward[0] * cos - out.camera.forward[2] * sin,
                    0,
                    out.camera.forward[2] * cos + out.camera.forward[0] * sin);
                vec3.cross(out.camera.right, out.camera.up, out.camera.forward);
                
                vec3.copy(out.transform.forward, out.camera.forward);
                vec3.copy(out.transform.right, out.camera.right);

                if(config.settings.mouseShove)
                    vec3.scaleAndAdd(
                        out.rigidBody.linearVelocity,
                        out.rigidBody.linearVelocity,
                        out.camera.forward,
                        0.2 * -e.movementY);
            }, false);

            addEventListener("mousedown", e => setAction("Mouse" + e.button, true), false);
            addEventListener("mouseup", e => setAction("Mouse" + e.button, false), false);
            addEventListener("keydown", e => setAction(e.code, true), false);
            addEventListener("keyup", e => setAction(e.code, false), false);

            function setAction(e, bool) {
                switch(e) {
                    case config.controls.forward:
                        out.entityController.actions.forward = bool;
                        return;
                    case config.controls.left:
                        out.entityController.actions.left = bool;
                        return;
                    case config.controls.backward:
                        out.entityController.actions.backward = bool;
                        return;
                    case config.controls.right:
                        out.entityController.actions.right = bool;
                        return;
                    case config.controls.dash:
                        out.entityController.actions.dash = bool;
                        return;
                    case config.controls.fire:
                        out.entityController.actions.fire = bool;
                        return;
                }
            }
        }

        out.animations.movement = Animation.create(2 * Math.PI, (dt) => {
            vec3.set(
                out.camera.position,
                Math.sin(out.animations.movement.progress) * 0.2,
                Math.sin(out.animations.movement.progress * 2) * 0.1 - 0.5,
                Math.cos(out.animations.movement.progress) * 0.2
            );
            vec3.subtract(out.camera.position, out.transform.position, out.camera.position);
        });
    },

    behavior({ entityController, lennyBehavior, transform }, dt) {
        if(!( entityController && lennyBehavior && transform)) return -1;

        let speed = entityController.movementSpeed;
        vec3.zero(entityController.movement);

        if(entityController.actions.dash && lennyBehavior.dash.coolDownTimer <= 0) {
            speed *= lennyBehavior.dash.speed;
            lennyBehavior.dash.coolDownTimer = lennyBehavior.dash.coolDown;
        }

        if(entityController.actions.forward)
            vec3.add(
                entityController.movement,
                entityController.movement,
                transform.forward);
        if(entityController.actions.backward)
            vec3.sub(
                entityController.movement,
                entityController.movement,
                transform.forward);
        if(entityController.actions.left)
            vec3.add(
                entityController.movement,
                entityController.movement,
                transform.right);
        if(entityController.actions.right)
            vec3.sub(
                entityController.movement,
                entityController.movement,
                transform.right);
        
        // reduce the dash cooldown
        lennyBehavior.dash.coolDownTimer -= dt;

        vec3.normalize(
            entityController.movement,
            entityController.movement);
        vec3.scale(
            entityController.movement,
            entityController.movement,
            speed * dt);
    },

    lennySpecificRenderUpdate({ animations, shaderMaterial, rigidBody, lennyData }, dt) {
        if(!(animations && shaderMaterial && rigidBody && lennyData)) return -1;
        // advance progress through the animation based on the magnitude of the linearVelocity
        Animation.step(
            animations.movement, 
            vec3.length(rigidBody.linearVelocity) * dt);
        animations.movement.frames();

        let offset = Math.cos(animations.movement.progress) * 0.4; // the value to oscillate
        let aspect = innerHeight / innerWidth;
        
        // reset the orthographic projection in case the screen is resized
        mat4.ortho(
             shaderMaterial.uProjectionMatrix,
            -1,
             1,
            -aspect,
             aspect,
             0.1,
             Number.MAX_SAFE_INTEGER);
        mat4.identity(shaderMaterial.uModelViewMatrix);

        let vertexArray = APP.assets.models.arms.vertexArray.concat();

        for(let i = 0;i < vertexArray.length;i+=3) {
            if(i < vertexArray.length / 2) {
                vertexArray[i+0] += offset + 1;
                vertexArray[i+1] += 0.7 + 0.5 * offset;
            } else {
                vertexArray[i+0] += offset - 1;
                vertexArray[i+1] += 0.7 - 0.5 * offset;
            }
        }
        
        shaderMaterial.aVertexPosition = jBuffers(APP.gl, {
            a: {
                array: vertexArray,
                size: 3
            }
        }).a;
    }
};

Object.freeze(Lenny);
export default Lenny;