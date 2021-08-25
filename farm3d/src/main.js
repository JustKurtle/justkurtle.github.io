import "./jiph/core.js"
import "./jiph/math.js"

import "./game/level.js"
import "./game/lenny.js"
import "./game/hungarian.js"

self.settings = {
    "mouseShove": false,
    "mouseSensitivity": 0.0012,
};

(function() {
    const canvas = document.querySelector("#canvas");
    self.gl = canvas.getContext("webgl2");
    if (!gl) return;
    (window.onresize = () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        gl.viewport(0, 0, innerWidth, innerHeight);
    })();
    
    canvas.onclick = canvas.requestPointerLock;

    self.shader = jShader(gl, [`
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;

        uniform mat4 uProjectionMatrix;
        uniform mat4 uLookAtMatrix;

        varying highp vec2 vTextureCoord;

        void main(void) {
            gl_Position = aVertexPosition * (uModelViewMatrix * uLookAtMatrix * uProjectionMatrix);
            vTextureCoord = aTextureCoord;
        }`,`
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;
        uniform highp vec3 uLight;

        void main(void) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            if(gl_FragColor.a < 0.5) discard;
        }
    `]);

    self.lenny = new Lenny(new Vec3(1024,1,1024));

    let entities = [self.lenny];
    let i = 100;
    while(i--) {
        entities.push(new Hungarian(gl, new Vec3(Math.random() * 2048, 1, Math.random() * 2048), shader));
    }

    let level = new Level(shader);
    level.load(gl);

    let camera = new jCamera();
    camera.lookAt = new Mat4();
    
    let cRad = 0, cFwd = new Vec3(0,0,1), cRgt = new Vec3(1,0,0);
    addEventListener("mousemove", e => {
        cRad += e.movementX * settings.mouseSensitivity;
        cFwd = new Vec3(-Math.sin(cRad), 0, Math.cos(cRad));
        cRgt = new Vec3( Math.cos(cRad), 0, Math.sin(cRad));
        if(settings.mouseShove) lenny.vel.a(cFwd.m(-e.movementY, []));
    }, false);
    
    let keys = {};
    addEventListener("keydown", e => keys[e.code] = true, false);
    addEventListener("keyup", e => keys[e.code] = false, false);

    let scene = new jScene(gl);
    
    let marchProg = 1;

    self.then = 0;
    function main(now) {
        const dt = (now - then) * 0.001;
        then = now;

        let fov = 90;
        camera.projection = new Mat4().perspective(0.1, 1000, fov, innerWidth / innerHeight);

        scene.clear(gl);

        shader.set({
            uLookAtMatrix: camera.lookAt,
            uProjectionMatrix: camera.projection
        });

        for(let e of entities) e.update(dt, lenny);
        
        if(keys["KeyW"]) lenny.vel.a(cFwd.m(2, []));
        if(keys["KeyS"]) lenny.vel.s(cFwd.m(2, []));
        if(keys["KeyA"]) lenny.vel.a(cRgt.m(2, []));
        if(keys["KeyD"]) lenny.vel.s(cRgt.m(2, []));
        
        level.draw(gl);
        for(let e of entities) e.draw(gl);

        marchProg += lenny.vel.mag * 100 * dt;
        camera.lookAt.lookTo(
            lenny.pos.a([
                Math.sin(marchProg * 0.01) * 0.2, 
                Math.sin(marchProg * 0.02) * 0.1 + 0.5, 
                Math.cos(marchProg * 0.01) * 0.2
            ], new Vec3()), cFwd).i();
        
        requestAnimationFrame(main);
    }
    requestAnimationFrame(main);
})();
