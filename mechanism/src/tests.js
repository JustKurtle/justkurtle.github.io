import "./mechanism/core.js";

addEventListener("load", async () => {
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

    // Matrix44 tests
    {
        let a = Mechanism.Matrix44.create();
        let b = Mechanism.Matrix44.create();

        speed_test("matrix_multiply", i => Mechanism.Matrix44.multiply(a, a, b), iter);
    }

    // Vector3 tests
    {
        let a = Mechanism.Vector3.fromValues(1, 0, 0);
        let b = Mechanism.Vector3.fromValues(1, 0, 0);

        speed_test("vector_multiply", i => Mechanism.Vector3.multiply(a, a, b), iter);
        speed_test("vector_normalize", i => Mechanism.Vector3.normalize(a, a), iter);
    }

    // SubArrayMap tests
    {
        let a = Mechanism.SubArrayMap.fromInitialSize(iter, 1000, 16);

        let b = Mechanism.Matrix44.create();
        let c = Mechanism.Matrix44.create();

        speed_test("sam_add", i => Mechanism.SubArrayMap.add(a, b), iter);
        speed_test("sam_get", i => Mechanism.SubArrayMap.get(a, i), iter);
        speed_test("sam_set", i => Mechanism.SubArrayMap.set(a, i, c), iter);
        speed_test("sam_pop", i => Mechanism.SubArrayMap.remove(a, i), iter);
    }
}, false);