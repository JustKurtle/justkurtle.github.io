import QuadTree from "./QuadTree.js"

class AABB {
    constructor(x, y, w, h) {
        this.srcPos = [x, y];
        this.w = w;
        this.h = h;
    }

    get x() { return this.srcPos[0]; }
    get y() { return this.srcPos[1]; }
    get xm() { return this.srcPos[0] + this.w; }
    get ym() { return this.srcPos[1] + this.h; }

    intersect(aabb) {
        const x = AABB.check(this.x, this.xm, aabb.x, aabb.xm);
        const y = AABB.check(this.y, this.ym, aabb.y, aabb.ym);

        switch(Math.min(x * x, y * y)) {
            case x * x:
                return [x, 0];
            case y * y:
                return [0, y];
            default:
                return [0, 0];
        }
    }
    intersects(aabb) {
        const x = AABB.check(this.x, this.xm, aabb.x, aabb.xm);
        const y = AABB.check(this.y, this.ym, aabb.y, aabb.ym);
        return (x !== null && y !== null);
    }
    contains(aabb) {
        const x = AABB.check(this.x, this.xm - aabb.w, aabb.x, aabb.x);
        const y = AABB.check(this.y, this.ym - aabb.h, aabb.y, aabb.y);
        return (x && y) !== null;
    }

    static check(sMin, sMax, oMin, oMax) {
        const O1 = sMin <= oMax && sMin >= oMin;
        const O2 = oMin <= sMax && oMin >= sMin;

        if(O1 || O2) {
            const min1 = oMax - sMin;
            const min2 = oMin - sMax;
            return (min1 * min1 < min2 * min2) ? min1 : min2;
        }
        return null;
    }
}

(function() {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    (window.onresize = () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    })();

    const keyEvent = new Map();
    window.onkeydown = e => keyEvent.set(e.code, e);    
    window.onkeyup = e => keyEvent.delete(e.code);
    
    let clrColor = new Uint8Array([32,12,46]);

    let tree = new QuadTree([innerWidth / 2, innerHeight / 2],[innerWidth / 2, innerHeight / 2], 4);

    let findPos = [0, 0];
    let searchSize = [32, 32];
    let w = 2, h = 2;
    
    for(let i = Math.floor(innerWidth * innerHeight / 64);i--;) {
        let boxPosition = [Math.random() * innerWidth - 0.5, Math.random() * innerHeight - 0.5];
        tree.set(boxPosition, [1, 1], new AABB(...boxPosition, 1, 1));
    }

    addEventListener("mousemove", e => {
        findPos[0] = e.x;
        findPos[1] = e.y;
        if(e.buttons > 0) {
            let boxPosition = [e.x - w/2, e.y - h/2];
            tree.set(boxPosition, [w, h], new AABB(...boxPosition, w, h));
        }
    }, false);
    addEventListener("wheel", e => {
        if(searchSize[0] - e.deltaY < 0) {
            searchSize = [0, 0];
            return;
        }
        searchSize[0] -= e.deltaY / 10;
        searchSize[1] -= e.deltaY / 10;
    }, false);

    let then = 0;
    function main(now) {
        requestAnimationFrame(main);
        const dt = (now - then) * 0.001;
        then = now;

        ctx.fillStyle = `rgba(${clrColor}, 1)`;
        ctx.fillRect(0,0, innerWidth, innerHeight);

        let points = tree.get(findPos, searchSize);
        for(let v of points) {
            ctx.fillStyle = "#00FF98";
            ctx.fillRect(v.x,v.y,v.w,v.h);
        }
    }
    requestAnimationFrame(main);
})();
