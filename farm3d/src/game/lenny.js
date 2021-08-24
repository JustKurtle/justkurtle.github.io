import "../jiph/core.js"
import "../jiph/math.js"

self.Lenny = class Lenny {
    constructor(pos) {
        this.box = new jRect(pos,
            0.50, 2.0, 0.50,
           -0.25,-1.8,-0.25);

        this.pos = pos;
        this.vel = new Vec3();

        this.foods = [Infinity];
        this.held = 0;
    }

    update(dt = 1) {
        this.vel.m(0.9);
        this.pos.a(this.vel.m(dt, []));
    }
    draw(gl) {
        
    }
};
