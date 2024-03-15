class Application {
    canvas;
    
    config;
    
    asset_handler;
    entity_manager;

    renderer;

    run(dt) {
        this.entity_manager.run(dt);
    }
}

class ApplicationBuilder {
    #app;

    constructor(canvas) {
        this.#app = new Application();
        this.#app.canvas = canvas;

        this.#app.config = {
            "settings": {},
            "controls": {},
        };

        this.#app.asset_handler = {};
        this.#app.entity_manager = {};

        this.#app.renderer = {};
    }

    withResizeCallback(callback) {
        callback();
        addEventListener("resize", callback, false);
        return this;
    }

    withConfig(path) {
        fetch(path)
            .then(res => res.json())
            .then(data => this.config = data);
        return this;
    }

    withAssetHandler(handler) {
        this.#app.asset_handler = new handler();
        return this;
    }

    withEntityManager(manager) {
        this.#app.entity_manager = new manager(this.#app.renderer);
        return this;
    }

    withRenderer(renderer) {
        this.#app.renderer = new renderer(this.#app);
        return this;
    }

    build() {
        let out = this.#app;
        this.#app = {};
        return out;
    }
}
export default ApplicationBuilder;