import array_tools from "./arrays/array_tools.js";
import AssetManager from "./assets/asset_manager.js";
import Matrix from "./math/matrix44.js";
import Vector from "./math/vector3.js";

function mechanism_load() {
    let assetManager = AssetManager.create();
    
    {
        let a = Matrix.create();
        let b = Matrix.create();
        speed_test("matrix_multiply", i => Matrix.multiply(a, a, b));
    }
    {
        let a = Vector.from_values(1, 0, 0);
        let b = Vector.from_values(1, 0, 0);
        speed_test("vector_multiply", i => Vector.multiply(a, a, b));
        speed_test("vector_normalize", i => Vector.normalize(a, a));
    }
}
addEventListener("load", mechanism_load, false);
