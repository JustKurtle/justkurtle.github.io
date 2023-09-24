import ArrayTools from "./mechanism/arrays/ArrayTools.js";
import ArrayMap from "./mechanism/arrays/ArrayMap.js";
import SubArrayMap from "./mechanism/arrays/SubarrayMap.js";

import Geometry from "./mechanism/resources/Geometry.js";

import Scene from "./mechanism/rendering/Scene.js"
import Prop from "./mechanism/rendering/Prop.js";
import Renderer from "./mechanism/rendering/Renderer.js";


async function run_tests() {
    self.gl = document
        .querySelector("#canvas")
        .getContext("webgl2");
    
    function resize() {
        gl.canvas.width = innerWidth;
        gl.canvas.height = innerHeight;
        gl.viewport(0,0, innerWidth, innerHeight);
    }
    resize();
    addEventListener("resize", resize, false);

    let prop = new Prop();
    // prop.setModel();
    
    let scene = new Scene();
    // scene.addProp(scene_obj);

    let renderer = new Renderer(gl);
    // renderer.setScene();
    
    let then = 0;
    function main(now) {
        const dt = (now - then) * 0.001;
        then = now;
        
        

        // requestAnimationFrame(main);
    }
    requestAnimationFrame(main);
}
addEventListener("load", run_tests, false);
