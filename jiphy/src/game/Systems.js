const Systems = {
    physicsUpdate({ transform, rigidBody }, dt = 1) {
        if(!(transform && rigidBody)) return -1;

        let forwardRotQuat = quat.create();
        let rightRotQuat = quat.create();
        let upRotQuat = quat.create();

        let rotQuat = quat.create();

        vec3.scale(
            rigidBody.angularVelocity,
            rigidBody.angularVelocity,
            physics.angularFriction);

        quat.setAxisAngle(
            rightRotQuat,
            transform.right,
            rigidBody.angularVelocity[0] * dt);
        quat.setAxisAngle(
            upRotQuat,
            transform.up,
            rigidBody.angularVelocity[1] * dt);
        quat.setAxisAngle(
            forwardRotQuat,
            transform.forward,
            rigidBody.angularVelocity[2] * dt);

        quat.multiply(
            rotQuat,
            upRotQuat,
            rightRotQuat);
        quat.multiply(
            rotQuat,
            rotQuat,
            forwardRotQuat);
        quat.normalize(
            rotQuat,
            rotQuat);

        vec3.transformQuat(
            transform.forward,
            transform.forward,
            rotQuat);
        vec3.transformQuat(
            transform.right,
            transform.right,
            rotQuat);
        vec3.cross(
            transform.up,
            transform.forward,
            transform.right);

        vec3.scale(
            rigidBody.linearVelocity,
            rigidBody.linearVelocity,
            physics.linearFriction);
        vec3.scaleAndAdd(
            transform.position,
            transform.position,
            rigidBody.linearVelocity,
            dt);
    },
    cameraUpdate({ camera }) {
        if(!camera) return -1;

        camera.aspect = innerWidth / innerHeight;

        mat4.perspective(
            camera.projectionMatrix,
            camera.fov,
            camera.aspect,
            camera.near,
            camera.far);

        mat4.lookAt(
            camera.lookAtMatrix,
            camera.position,
            vec3.add(
                vec3.create(),
                camera.position,
                camera.forward),
            camera.up);
    },
    modelUpdate({ renderData, transform }) {
        if(!(renderData && transform)) return -1;

        let x = vec3.scale([], transform.right, transform.scale[0]);
        let y = vec3.scale([], transform.up, transform.scale[1]);
        let z = vec3.scale([], transform.forward, transform.scale[2]);

        renderData.data[0] = x[0];
        renderData.data[1] = y[0];
        renderData.data[2] = z[0];
        renderData.data[3] = transform.position[0];
        
        renderData.data[4] = x[1];
        renderData.data[5] = y[1];
        renderData.data[6] = z[1];
        renderData.data[7] = transform.position[1];
        
        renderData.data[8] = x[2];
        renderData.data[9] = y[2];
        renderData.data[10] = z[2];
        renderData.data[11] = transform.position[2];

        // x[0],y[0],z[0],p[0],
        // x[1],y[1],z[1],p[1],
        // x[2],y[2],z[2],p[2],
        // 0,0,0,1
    },
    entityController({ entityController, rigidBody }) {
        if(!(entityController && rigidBody)) return -1;

        vec3.add(
            rigidBody.linearVelocity,
            rigidBody.linearVelocity,
            entityController.movement);
    },

    view_cull({ transform }) {
        if(!transform) return -1;

        let position = vec3.subtract(vec3.create(), transform.position, APP.camera.position);
        let distance = vec3.length(position);
        let dotProduct = vec3.dot(position, APP.camera.forward) / distance;

        return dotProduct < 1 / (APP.camera.aspect + 1) && distance > transform.scale[0] + 10;
    },
    physics_cull({ transform }) {
        if(!transform) return -1;

        let position = vec3.subtract(vec3.create(), transform.position, APP.camera.position);
        let distance = vec3.squaredLength(position);

        return distance > 1000000;
    }
};

const physics = {
    "linearFriction": 0.998,
    "angularFriction": 1.0,
};

Object.freeze(Systems);
export default Systems;