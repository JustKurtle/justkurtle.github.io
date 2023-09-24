function renderSystem({ material, transform }) {
    if(!(material && transform)) return 1;

}

function physicsSystem({ rigidBody, transform }) {
    if(!(rigidBody && transform)) return 1;
    
}

export default {
    renderSystem,
    physicsSystem,
};
