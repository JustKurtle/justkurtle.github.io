const Systems = {
    physicsUpdate({ transform, rigidBody }, dt = 1) {
        if(!(transform && rigidBody)) return -1;

        // friction
        vec3.scale(
            rigidBody.linearVelocity,
            rigidBody.linearVelocity,
            0.048 ** dt);
        // linearVelocity scaled to delta time and added to position
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
    entityController({ entityController, rigidBody }, dt) {
        if(!(entityController && rigidBody)) return -1;

        vec3.add(
            rigidBody.linearVelocity,
            rigidBody.linearVelocity,
            entityController.movement);
    },
}
Object.freeze(Systems);
export default Systems;