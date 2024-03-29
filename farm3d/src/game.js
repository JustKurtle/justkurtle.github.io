const Game = {
    create(canvas) {
        let game = {
            // the basics
            "canvas": canvas,
            "gl": canvas.getContext("webgl2"),

            // for read in data
            "config": { "settings": {}, "controls": {}, },
            "assets": { "models": {}, "shaders": {}, },

            // to resize the canvas when the window changes
            "resizeCallback"(e) {
                game.canvas.width = innerWidth;
                game.canvas.height = innerHeight;
                game.gl.viewport(0, 0, innerWidth, innerHeight);
            },
        };
        return game;
    },
};
Object.freeze(Game); // make the Game immutable
export default Game;