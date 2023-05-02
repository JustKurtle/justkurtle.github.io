import "../../jiph/core.js"
import Components from "../Components.js";

self.Player = {
    create() {
        let transform = Components.transform();
        let rigidBody = Components.rigidBody();
        let boxCollider = Components.boxCollider();
        let entityController = Components.entityController();
        let renderObject = {
            "modelID": 0,
            "instanceID": 0,
            "data": [
                1.0,0.0,0.0,0.0,
                0.0,1.0,0.0,0.0,
                0.0,0.0,1.0,0.0,
                0.0,0.0,0.0,1.0,

                1.0,1.0,1.0,1.0,

                1.0
            ],
        };
        
        let camera = {};

        // controls
        {
            let cRad = 0;
            addEventListener("mousemove", e => {
                let x = e.movementX * 2 - innerWidth;
                let y = e.movementY * 2 - innerHeight;
                cRad = Math.atan(x / y) + (y > 0) * Math.PI;
            }, false);
            
            addEventListener("mousedown", e => setActions("Mouse" + e.button, true), false);
            addEventListener("mouseup", e => setActions("Mouse" + e.button, false), false);
            addEventListener("keydown", e => setActions(e.code, true), false);
            addEventListener("keyup", e => setActions(e.code, false), false);

            function setActions(e, bool) {
                switch(e) {
                    case config.controls.forward:
                        entityController.actions.forward = bool;
                        return;
                    case config.controls.backward:
                        entityController.actions.backward = bool;
                        return;
                    case config.controls.left:
                        entityController.actions.left = bool;
                        return;
                    case config.controls.right:
                        entityController.actions.right = bool;
                        return;
                }
            }
        }

        return {
            transform,
            rigidBody,
            boxCollider,
            entityController,
            camera,
            renderObject
        };
    },

    playerControllerSystem({ entityController, playerBehavior }, dt) {
        if(!(entityController && playerBehavior)) return;

        let speed = entityController.movementSpeed;

        if(events[APP.config.controls.up]) 
            playerController.movement[1] += speed;
        if(events[APP.config.controls.down]) 
            playerController.movement[1] -= speed;
        if(events[APP.config.controls.right]) 
            playerController.movement[0] += speed;
        if(events[APP.config.controls.left]) 
            playerController.movement[0] -= speed;

        vec3.scaleAndAdd(
            rigidBody.velocity, 
            rigidBody.velocity, 
            playerController.movement, 
            dt);
    },
};
