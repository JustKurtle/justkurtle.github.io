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

        quat.setAxisAngle(rightRotQuat, transform.right, rigidBody.angularVelocity[0] * dt);
        quat.setAxisAngle(upRotQuat, transform.up, rigidBody.angularVelocity[1] * dt);
        quat.setAxisAngle(forwardRotQuat, transform.forward, rigidBody.angularVelocity[2] * dt);

        quat.multiply(rotQuat, upRotQuat, rightRotQuat);
        quat.multiply(rotQuat, rotQuat, forwardRotQuat);
        quat.normalize(rotQuat, rotQuat);
            
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
    renderUpdate({ shaderMaterial }) {
        if(!shaderMaterial) return -1;

        shaderMaterial.$shader.set(shaderMaterial);
        APP.gl.bindBuffer(APP.gl.ELEMENT_ARRAY_BUFFER, shaderMaterial.index.buffer);
        APP.gl.drawElements(APP.gl.TRIANGLES, shaderMaterial.index.length, APP.gl.UNSIGNED_SHORT, 0);
    },
    cameraUpdate({ camera }) {
        if(!camera) return -1;

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
    modelUpdate({ shaderMaterial, transform }) {
        if(!(shaderMaterial && transform)) return -1;

        let x = vec3.scale(vec3.create(), transform.right, transform.scale[0]);
        let y = vec3.scale(vec3.create(), transform.up, transform.scale[1]);
        let z = vec3.scale(vec3.create(), transform.forward, transform.scale[2]);
        
        let p = transform.position;
        
        mat4.set(
            shaderMaterial.uModelViewMatrix,
            x[0],x[1],x[2],0,
            y[0],y[1],y[2],0,
            z[0],z[1],z[2],0,
            p[0],p[1],p[2],1);
    },
    entityController({ entityController, rigidBody }) {
        if(!(entityController && rigidBody)) return -1;
        vec3.add(
            rigidBody.linearVelocity,
            rigidBody.linearVelocity,
            entityController.movement);

        entityController.movement = vec3.create();
    },
};

const physics = {
    "linearFriction": 0.9,
    // "angularFriction": 0.997,
    "angularFriction": 1.0,
};

Object.freeze(Systems);
export default Systems;