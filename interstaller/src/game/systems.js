const physics = {
    "linearFriction": 0.9999,
    "angularFriction": 1.0,
};
// they get created and then reused so there are less new Float32Array calls
let Z = new Float32Array([0, 0, 0, 1]);
let X = new Float32Array([0, 0, 0, 1]);
let Y = new Float32Array([0, 0, 0, 1]);

function entityController({ entityController, rigidBody }) {
    if(!(entityController && rigidBody)) return -1;

    vec3.add(
        rigidBody.linearVelocity,
        rigidBody.linearVelocity,
        entityController.movement);
}

function physicsUpdate({ transform, rigidBody }, dt) {
    if(!(transform && rigidBody)) return -1;

    vec3.scale(
        rigidBody.angularVelocity,
        rigidBody.angularVelocity,
        physics.angularFriction);

    quat.setAxisAngle(X, transform.right, rigidBody.angularVelocity[0] * dt);
    quat.setAxisAngle(Y, transform.up, rigidBody.angularVelocity[1] * dt);
    quat.setAxisAngle(Z, transform.forward, rigidBody.angularVelocity[2] * dt);

    quat.multiply(Y, Y, X);
    quat.multiply(Y, Y, Z);
    quat.normalize(Y, Y);

    vec3.transformQuat(
        transform.forward,
        transform.forward,
        Y);
    vec3.transformQuat(
        transform.right,
        transform.right,
        Y);
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
}

function cameraUpdate({ camera }, dt) {
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
            X,
            camera.position,
            camera.forward),
        camera.up);
}

function modelUpdate({ shaderMaterial, transform }, dt) {
    if(!(shaderMaterial && transform)) return -1;

    vec3.scale(X, transform.right, transform.scale[0]);
    vec3.scale(Y, transform.up, transform.scale[1]);
    vec3.scale(Z, transform.forward, transform.scale[2]);
    
    let p = transform.position;

    shaderMaterial.uModelViewMatrix[0] = X[0];
    shaderMaterial.uModelViewMatrix[1] = Y[0];
    shaderMaterial.uModelViewMatrix[2] = Z[0];
    shaderMaterial.uModelViewMatrix[3] = p[0];

    shaderMaterial.uModelViewMatrix[4] = X[1];
    shaderMaterial.uModelViewMatrix[5] = Y[1];
    shaderMaterial.uModelViewMatrix[6] = Z[1];
    shaderMaterial.uModelViewMatrix[7] = p[1];
    
    shaderMaterial.uModelViewMatrix[8] = X[2];
    shaderMaterial.uModelViewMatrix[9] = Y[2];
    shaderMaterial.uModelViewMatrix[10] = Z[2];
    shaderMaterial.uModelViewMatrix[11] = p[2];
    
    shaderMaterial.uModelViewMatrix[12] = 0;
    shaderMaterial.uModelViewMatrix[13] = 0;
    shaderMaterial.uModelViewMatrix[14] = 0;
    shaderMaterial.uModelViewMatrix[15] = 1;

    // instance.data[0] = X[0];
    // instance.data[1] = Y[0];
    // instance.data[2] = Z[0];
    // instance.data[3] = p[0];

    // instance.data[4] = X[1];
    // instance.data[5] = Y[1];
    // instance.data[6] = Z[1];
    // instance.data[7] = p[1];
    
    // instance.data[8] = X[2];
    // instance.data[9] = Y[2];
    // instance.data[10] = Z[2];
    // instance.data[11] = p[2];
    
    // instance.data[12] = 0;
    // instance.data[13] = 0;
    // instance.data[14] = 0;
    // instance.data[15] = 1;

    // X[0],Y[0],Z[0],p[0],
    // X[1],Y[1],Z[1],p[1],
    // X[2],Y[2],Z[2],p[2],
    // 0,0,0,1
}

function renderUpdate({ shaderMaterial }) {
    if(!shaderMaterial) return -1;

    shaderMaterial.$shader.set(shaderMaterial);
    APP.gl.bindBuffer(APP.gl.ELEMENT_ARRAY_BUFFER, shaderMaterial.index.buffer);
    APP.gl.drawElements(APP.gl.LINES, shaderMaterial.index.length, APP.gl.UNSIGNED_SHORT, 0);
}

function view_cull({ transform }) {
    if(!transform) return -1;

    let position = vec3.subtract(vec3.create(), transform.position, APP.camera.position);
    let distance = vec3.length(position);
    let dotProduct = vec3.dot(position, APP.camera.forward) / distance;

    return dotProduct < 1 / (APP.camera.aspect + 1) && distance > transform.scale[0] + 10;
}


export default {
    entityController,
    physicsUpdate,
    cameraUpdate,
    modelUpdate,
    renderUpdate,
};