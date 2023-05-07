import array_tools from "./arrays/array_tools.js";
import ArrayMap from "./arrays/array_map.js";
import SubArrayMap from "./arrays/subarray_map.js";

import AssetManager from "./assets/asset_manager.js";
import Geometry from "./assets/geometry.js";

import Matrix from "./math/matrix44.js";
import Vector from "./math/vector3.js";

import SceneRenderer from "./rendering/scene_renderer.js";

self.speed_test = (label, callback, iter = 10000000) => {
    console.time(label);
    while(iter--) callback(iter);
    console.timeEnd(label);
};

addEventListener("load", async () => {
    let gl = document.querySelector("#canvas").getContext("webgl2");

    let assetManager = AssetManager.create();
    await AssetManager.loadFromFiles(assetManager, [
        "star.png",
    ]);
    await AssetManager.loadFromObjects(assetManager, {
        "star.model": Geometry.createQuadSphere(2),
    });

    let sceneRenderer = SceneRenderer.create(gl);



    let iter = 1000000;

    {
        let a = Matrix.create();
        let b = Matrix.create();

        speed_test("matrix_multiply", i => Matrix.multiply(a, a, b), iter);
    }

    {
        let a = Vector.fromValues(1, 0, 0);
        let b = Vector.fromValues(1, 0, 0);

        speed_test("vector_multiply", i => Vector.multiply(a, a, b), iter);
        speed_test("vector_normalize", i => Vector.normalize(a, a), iter);
    }

    {
        let a = SubArrayMap.fromInitialSize(iter, 1000, 16);

        let b = Matrix.create();
        let c = Matrix.create();

        speed_test("sam_add", i => SubArrayMap.add(a, b), iter);
        speed_test("sam_get", i => SubArrayMap.get(a, i), iter);
        speed_test("sam_set", i => SubArrayMap.set(a, i, c), iter);
        speed_test("sam_pop", i => SubArrayMap.remove(a, i), iter);
    }
}, false);
