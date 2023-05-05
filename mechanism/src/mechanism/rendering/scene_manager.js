function create() {
    let _scenes = {};
    let active_scene = 0;
    return {
        _scenes,
        active_scene
    };
}

export default {
    create,
};
