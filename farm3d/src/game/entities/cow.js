import "../../jiph/core.js"
import Components from "../components.js"

const Cow = {
    create(pos) {
        let output = {
            "transform": Components.transform(),
            "rigidBody": Components.rigidBody(),
            "boxCollider": Components.boxCollider(),

            "entityController": Components.entityController(),
            "cowBehavior": {
                "dash": {
                    "coolDown": 1, // how long the cooldown should be set to in seconds
                    "coolDownTimer": 0,
                    "speed": 150,
                },
            },
            "cowData": {
                "hunger": 0.1,
                "target": {},
            },

            "shaderMaterial": {},
        };
        return output;
    },

    init(out, pos) {
        let variant = Math.floor(Math.random() * 2);

        { // init grapohics
            out.shaderMaterial = {
                $shader: APP.assets.shaders.cow,
                ...jBuffers(APP.gl, {
                    aVertexPosition: { 
                        array: [
                            -1, 1, 0, 
                             1, 1, 0, 
                             1,-1, 0, 
                            -1,-1, 0,
                        ],
                        size: 3
                    },
                    aTextureCoord: { 
                        array: [
                            1, 0,
                            0, 0,
                            0, 1,
                            1, 1,
                        ],
                        size: 2
                    },
                    index: { 
                        array: [0,1,2, 0,2,3], 
                        size: 3,
                        length: 6
                    },
                }),
                uModelViewMatrix: mat4.create(),
                uSampler: APP.assets.textures['cow'+variant],

                uLookAtMatrix: APP.camera.lookAtMatrix,
                uProjectionMatrix: APP.camera.projectionMatrix,
            };
        }

        out.transform.position = vec3.clone(pos);
    },

    behavior({ transform, cowData, entityController }, dt = 1, target = APP.lenny) {
        if(!(transform && cowData && entityController)) return -1;

        let targetDirection = vec3.create();
        // distance from target
        vec3.subtract(
            targetDirection,
            target.transform.position,
            transform.position);
        // normalize distance to make it direction
        vec3.normalize(
            targetDirection,
            targetDirection);
        // scale linearVelocity by hunger
        vec3.scaleAndAdd(
            entityController.movement,
            entityController.movement,
            targetDirection,
            Math.atan(cowData.hunger));

        transform.forward = vec3.clone(targetDirection);
        transform.right = vec3.cross(vec3.create(), targetDirection, [0,1,0]);

        cowData.hunger += dt;
    },
};

Object.freeze(Cow);
export default Cow;