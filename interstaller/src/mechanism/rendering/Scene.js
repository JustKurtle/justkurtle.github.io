import ArrayMap from "../arrays/ArrayMap.js";

class Scene {
    props;
    lights;

    // todo vars
    skybox;
    clearcolor;

    constructor() {
        this.props = new ArrayMap();
        this.lights = new ArrayMap();
    }
}
export default Scene;