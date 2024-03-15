import ApplicationBuilder from "./mechanism/ApplicationBuilder.js";
import EntityManager from "./mechanism/EntityManager.js";
import Renderer from "./mechanism/rendering/Renderer3d.js";

async function run_tests() {
    let canvas = document
        .querySelector("#canvas");

    let app = await new ApplicationBuilder(canvas)
        .withResizeCallback(_ => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
        })
        .withConfig("/config.json")
        .withEntityManager(EntityManager)
        .withRenderer(Renderer)
        .build();

    let then = 0;
    function main(now) {
        const dt = (now - then) * 0.001;
        then = now;
        
        app.run(dt);

        requestAnimationFrame(main);
    }
    requestAnimationFrame(main);
}
addEventListener("load", run_tests, false);
