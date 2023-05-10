import SubarrayMap from "../arrays/SubarrayMap.js";

function create() {
    let material = {};
    let model = {};
    let texture;
    let instanceCount = 0;
    let instanceData = SubarrayMap.create();

    return {
        material,
        model,
        texture,
        instances,
    };
}

function setModel(target, instance) {
}

function addInstance(target, instance) {
    return SubarrayMap.add(target.instances, instance);
}

function removeInstance(target, instance) {
    return SubarrayMap.add(target.instances, instance);
}

function setInstance(target, instance) {
    return SubarrayMap.add(target.instances, instance);
}

function getInstance(target, instance) {
    
}

export default {
    create,
    pushInstance,
    pullInstance
};
