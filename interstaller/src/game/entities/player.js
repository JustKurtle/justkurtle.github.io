import "../../jiph/core.js"
import Components from "../components.js"

const Player = {
    create() {
        let player = {
            "transform": Components.transform(),
            "rigidBody": Components.rigidBody(),
            "boxCollider": Components.boxCollider(),
            
            "entityController": Components.entityController(),
            "playerBehavior": {},
            
            "camera": APP.camera
        };

        addEventListener("mousemove", e => {
            let thetaX = -e.movementX * APP.config.settings.mouseSensitivity;
            let thetaY =  e.movementY * APP.config.settings.mouseSensitivity;

            let rightRotQuat = quat.create();
            let upRotQuat = quat.create();

            let rotQuat = quat.create();

            quat.setAxisAngle(rightRotQuat, player.camera.right, thetaY);
            quat.setAxisAngle(upRotQuat, player.camera.up, thetaX);

            quat.multiply(rotQuat, upRotQuat, rightRotQuat); 
            quat.normalize(rotQuat, rotQuat);
            
            vec3.transformQuat(
                player.camera.forward,
                player.camera.forward,
                rotQuat);
            vec3.transformQuat(
                player.camera.right,
                player.camera.right,
                rotQuat);
            vec3.cross(
                player.camera.up,
                player.camera.forward,
                player.camera.right);

            player.transform.forward = player.camera.forward;
            player.transform.right = player.camera.right;
            player.transform.up = player.camera.up;
            player.transform.position = player.camera.position;
        });

        function setAction(e, bool) {
            switch(e) {
                case APP.config.controls.forward:
                    player.entityController.actions.forward = bool;
                    return;    
                case APP.config.controls.left:
                    player.entityController.actions.left = bool;
                    return;
                case APP.config.controls.backward:
                    player.entityController.actions.backward = bool;
                    return;
                case APP.config.controls.right:
                    player.entityController.actions.right = bool;
                    return;
                case APP.config.controls.up:
                    player.entityController.actions.up = bool;
                    return;
                case APP.config.controls.down:
                    player.entityController.actions.down = bool;
                    return;
                    
                case APP.config.controls.clockwise:
                    player.entityController.actions.clockwise = bool;
                    return;
                case APP.config.controls.anticlockwise:
                    player.entityController.actions.anticlockwise = bool;
                    return;

                case APP.config.controls.break:
                    player.entityController.actions.break = bool;
                    return;
                case APP.config.controls.place:
                    player.entityController.actions.place = bool;
                    return;

                case APP.config.controls.zoom:
                    player.entityController.actions.zoom = bool;
                    return;
                default:
                    // console.log(e);
            }
        }
        self.addEventListener("blur", e => {
            player.entityController.actions.forward = false;
            player.entityController.actions.left = false;
            player.entityController.actions.backward = false;
            player.entityController.actions.right = false;
            player.entityController.actions.up = false;
            player.entityController.actions.down = false;
            player.entityController.actions.clockwise = false;
            player.entityController.actions.anticlockwise = false;
            player.entityController.actions.break = false;
            player.entityController.actions.place = false;
            player.entityController.actions.zoom = false;
        }, false);

        // self.addEventListener("keydown", e => e.preventDefault(), false);

        self.addEventListener("mousedown", e => setAction("Mouse" + e.button, true), false);
        self.addEventListener("mouseup", e => setAction("Mouse" + e.button, false), false);
        self.addEventListener("keydown", e => setAction(e.code, true), false);
        self.addEventListener("keyup", e => setAction(e.code, false), false);

        return player;
    },

    behavior({ playerBehavior, entityController, transform, camera }, dt) {
        if(!(playerBehavior && entityController && transform && camera)) return 1;

        // variable reset
        camera.fov = APP.config.settings.fov;

        if(entityController.actions.forward)
            vec3.add(
                entityController.movement,
                entityController.movement,
                transform.forward);
        if(entityController.actions.backward)
            vec3.subtract(
                entityController.movement,
                entityController.movement,
                transform.forward);

        if(entityController.actions.right)
            vec3.subtract(
                entityController.movement,
                entityController.movement,
                transform.right);
        if(entityController.actions.left)
            vec3.add(
                entityController.movement,
                entityController.movement,
                transform.right);

        if(entityController.actions.up)
            vec3.add(
                entityController.movement,
                entityController.movement,
                transform.up);
        if(entityController.actions.down)
            vec3.subtract(
                entityController.movement,
                entityController.movement,
                transform.up);
        if(entityController.actions.zoom)
            camera.fov = APP.config.settings.fov / 5;

        vec3.normalize(
            entityController.movement,
            entityController.movement);
        vec3.scale(
            entityController.movement,
            entityController.movement,
            entityController.movementSpeed);
    }
};

Object.freeze(Player);
export default Player;