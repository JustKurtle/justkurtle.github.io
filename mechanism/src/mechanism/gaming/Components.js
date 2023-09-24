import Vector3 from "../math/Vector3.js";

class RigidBody {
    friction = 0;
}

class Transform {
    position = new Float32Array(3);
    rotation = new Float32Array(3);
    scale = new Float32Array(3);
}

class PlayerController {
    
}

export default {
    RigidBody,
    Transform,
    PlayerController,
};
