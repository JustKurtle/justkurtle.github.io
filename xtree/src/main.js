import QuadTree from "./QuadTree.js"

const vec2 = {
    create: _ => new Float32Array(2),
    from: _ => new Float32Array(_),
}

let search = {
    position: vec2.create(),
    size: vec2.from([20,20]),
};
addEventListener("mousemove", e => {
    search.position[0] = e.x;
    search.position[1] = e.y;
    if(e.buttons) {
        grid.insert(search.position, search.size, [...search.position, ...search.size]);
    }
}, false);
addEventListener("wheel", e => {
    search.size[0] *= 2 ** Math.sign(e.deltaY);
    search.size[1] *= 2 ** Math.sign(e.deltaY);
}, false);

let tree = new QuadTree([0,0], [800, 600], 4, 10);
{
    let i = 2000000;
    while(i--) {
        let position = [Math.random() * (800 - 10), Math.random() * (600 - 10)];
        let size = [Math.random() * 10, Math.random() * 10];
        tree.insert(position, size, [...position, ...size]);
    }
}

self.speed_test = (name, callback, scale = 2000000) => {
    console.time(name);
    while(scale--) callback(scale);
    console.timeEnd(name);
};


self.update = (dt) => {
    console.log(total / i);
}

let i = 0;
let total = 0;
self.draw = (ctx) => {
    let then = performance.now();
    tree.collect(search.position, search.size);
    total += performance.now() - then; i++;
    console.log(total / i);
    
    // let data = tree.collect(search.position, search.size);
    // let i = data.length;
    // while(i--) {
    //     ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
    //     ctx.fillRect(...data[i].value)
    // }
    
    // ctx.strokeStyle = `hsl(${200}, 100%, 50%)`;
    // ctx.strokeRect(
    //     search.position[0],
    //     search.position[1],
    //     search.size[0],
    //     search.size[1]);
}

(function() {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    (window.onresize = () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    })();
    
    let clrColor = new Uint8Array([32, 16, 48]);

    self.QuadTree = new QuadTree([0,0], [innerWidth, innerHeight]);

    let then = 0;
    function main(now) {
        const dt = (now - then) * 0.001;
        then = now;
        
        ctx.fillStyle = `rgba(${clrColor}, 1)`;
        ctx.fillRect(0,0, innerWidth, innerHeight);
       
        update(dt);
        draw(ctx);

        document.querySelector('title').innerHTML = "fps: " + ((1 / dt) | 0);
        
        requestAnimationFrame(main);
    }
    requestAnimationFrame(main);
})();
