import Components from "../Components.js"

const Player = {
    create() {
        let player = {
            "transform": Components.transform(),
            "rigidBody": Components.rigidBody(),
            "boxCollider": Components.boxCollider(),
            
            "entityController": Components.entityController(),
            "playerBehavior": {
                
            },
            
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

                case APP.config.controls.hyper:
                    player.entityController.actions.hyper = bool;
                    return;
                case APP.config.controls.brake:
                    player.entityController.actions.brake = bool;
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

    behavior({ playerBehavior, entityController, transform, camera, rigidBody }, dt) {
        if(!(playerBehavior && entityController && transform && camera && rigidBody)) return 1;

        // variable reset
        camera.fov = APP.config.settings.fov;
        let speed = entityController.movementSpeed;
        vec3.zero(entityController.movement);


        if(entityController.actions.hyper)
            speed *= 20;
        if(entityController.actions.brake)
            vec3.scale(rigidBody.linearVelocity, rigidBody.linearVelocity, 0.9);

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

        let magnitude = vec3.length(entityController.movement);
        if(!magnitude) return;
        vec3.scale(
            entityController.movement,
            entityController.movement,
            speed / magnitude);
    }
};

Object.freeze(Player);
export default Player;

//     update(dt = 1, { chunks }) {
//         const f = vec3.normalize(vec3.create(), [this.lookDir[0], 0, this.lookDir[2]]);
//         const r = vec3.normalize(vec3.create(), [this.lookDir[2], 0,-this.lookDir[0]]);

//         let speed = 3;
//         let jump = 33;
//         let gravity = 0;
//         let friction = vec3.fromValues(0.82, 0.98, 0.82);

//         if(!this.grounded) {
//             speed = 0.005;
//             jump = 0;
//             gravity = 10;
//             friction = vec3.fromValues(0.99, 0.99, 0.99);
//         }

//         this.vel[1] -= gravity * dt;
//         vec3.multiply(this.vel, this.vel, friction);
//         vec3.scaleAndAdd(this.pos, this.pos, this.vel, dt);

//         this.grounded = false;
//         for(let i = chunks.length;i--;) {
//             let blockPos = vec3.create();
//             let blockSize = vec3.fromValues(1, 1, 1);
//             for(
//                 let b = cCode(vec3.add([], this.pos, [-7,-7,-7]));
//                     b < cCode(vec3.add([], this.pos, [ 8, 8, 8]));
//                 b++) {
//                 if(chunks[i].data[b] != 0) blockPos = vec3.fromValues(cDecode(b)[0] - 0.5, cDecode(b)[1] - 0.5, cDecode(b)[2] - 0.5);
//                 if(boxOverlaps(this.pos, this.size, blockPos, blockSize)) {
//                     let o = boxOverlap(this.pos, this.size, blockPos, blockSize);
//                     if(o[1] > 0) this.grounded = true;
//                     vec3.multiply(this.vel, this.vel, [!o[0],!o[1],!o[2]]);
//                     vec3.add(this.pos, this.pos, o);
//                 }
//             }
//         }
//     }

//     draw(gl, { camera }) {
//         let cameraPos = vec3.add(vec3.create(), this.pos, [0, 1.6, 0]);
//         mat4.lookAt(
//             camera.lookAt, 
//             cameraPos,
//             vec3.add(vec3.create(), cameraPos, this.lookDir), 
//             vec3.fromValues(0,1,0));
//     }
