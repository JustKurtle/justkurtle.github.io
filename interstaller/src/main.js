import "./jiph/core.js"
import "../deps/gl-matrix.js"
Object.assign(self, glMatrix); 

import Game from "./jiph/Game.js";

self.APP = {};

addEventListener("load", async function() {
    // get the canvas
    let canvas = document.querySelector("#canvas");
    // pass the canvas
    APP = Game.create(canvas);
    await Game.setup(APP);

    let then = 0;
    function main(now) {
        // requestAnimationFrame(main);
        const dt = (now - then) * 0.001;
        then = now;
        
        Game.update(APP, dt);
        
        document.querySelector("title").innerHTML = "Interstaller | FPS: " + Math.floor(1 / dt);
        requestAnimationFrame(main);
    }
    requestAnimationFrame(main);
}, false);

