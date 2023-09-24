const Components = {
    transform() {
        return {
            "position": vec3.create(),

            "forward": vec3.fromValues(0,0,1),
            "right": vec3.fromValues(1,0,0),
            "up": vec3.fromValues(0,1,0),
            
            "scale": vec3.fromValues(1,1,1),
        };
    },
    rigidBody() {
        return {
            "angularVelocity": vec3.create(),
            "linearVelocity": vec3.create(),
        };
    },
    entityController() {
        return {
            "actions": {},
            "movement": vec3.create(),
            "movementSpeed": 2,
            "grounded": false
        };
    },
    camera() {
        return {
            "projectionMatrix": mat4.create(),
            "lookAtMatrix": mat4.create(),

            "fov": 1.49, //app.config.settings.fov,
            "aspect": innerWidth / innerHeight,
            "near": 0.001,
            "far": 100000,

            "position": vec3.create(),
            
            "forward": vec3.fromValues(0,0,1),
            "right": vec3.fromValues(1,0,0),
            "up": vec3.fromValues(0,1,0),
        };
    },
    boxCollider() {
        return { 
            "size": vec3.fromValues(2, 2, 2) 
        };
    },
};
Object.freeze(Components);
export default Components;