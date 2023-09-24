const Game = {
    create(canvas) {
        let game = {
            "gl": canvas.getContext("webgl2"),

            // for read in data
            "config": {
                "settings": {},
                "controls": {},
            },
            "assets": {
                "models": {},
                "shaders": {},
                "textures": {},
            },

            // to resize the canvas when the window changes
            "resizeCallback"(e) {
                game.gl.canvas.width = innerWidth;
                game.gl.canvas.height = innerHeight;
                game.gl.viewport(0, 0, innerWidth, innerHeight);

                if(game.camera) game.camera.aspect = innerWidth/innerHeight;
            },
        };
        return game;
    },
};
Object.freeze(Game);
export default Game;