import ArrayTools from "./arrays/array_tools.js";
import ArrayMap from "./arrays/array_map.js";
import SubArrayMap from "./arrays/subarray_map.js";

import AssetManager from "./assets/asset_manager.js";
import Geometry from "./assets/geometry.js";

import Matrix44 from "./math/matrix44.js";
import Vector3 from "./math/vector3.js";

import SceneRenderer from "./rendering/scene_renderer.js";

self.speed_test = (label, callback, iter = 10000000) => {
    console.time(label);
    while(iter--) callback(iter);
    console.timeEnd(label);
};

self.Mechanism = {
    ArrayTools,
    ArrayMap,
    SubArrayMap,
    AssetManager,
    Geometry,
    Matrix44,
    Vector3,
    SceneRenderer,
};
