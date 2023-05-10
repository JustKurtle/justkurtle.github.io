import "./mechanism/core.js";

async function run_tests() {
    let gl = document.querySelector("#canvas").getContext("webgl2");

    let assetManager = Mechanism.AssetManager.create();
    await Mechanism.AssetManager.loadFromFiles(assetManager, [
        "star.png",
    ]);
    await Mechanism.AssetManager.loadFromObjects(assetManager, {
        "star.model": Mechanism.Geometry.createQuadSphere(2),
    });

    let sceneRenderer = Mechanism.SceneRenderer.create(gl);

    let iter = 1000000;
    Mechanism.Matrix44.test(iter);
    Mechanism.Vector3.test(iter);
    Mechanism.SubArrayMap.test(iter);
}
addEventListener("load", run_tests, false);