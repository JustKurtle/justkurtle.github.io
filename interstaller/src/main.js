import "./math/aabb.js"

(function() {
    const canvas = document.querySelector("#canvas");
    self.ctx = canvas.getContext("2d");
    (window.onresize = () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    })();

    let clrColor =       [100, 100, 100];
    let staticColor =    [  0, 255,   0];
    let rigidbodyColor = [255,   0, 255];

    let rbPos =  [300, 100],
        rbSize = [100, 100],
        rbMove = [0, 1000];

    let staticPos =  [300, 300],
        staticSize = [400, 400];

    let input = [];
    addEventListener("mousemove", e => { input.push(e) }, false);
    addEventListener("keydown", e => { input.push(e); }, false);
    
    let then = 0;
    function main(now) {
        const dt = (now - then) * 0.001;
        then = now;
        ctx.fillStyle = `rgba(${clrColor}, 2)`;
        ctx.fillRect(0,0, innerWidth, innerHeight);

        while(input.length != 0) {
            let e = input.pop();
            if(e.buttons > 0) rbMove = [e.x - rbPos[0], e.y - rbPos[1]];
            if(e.code === "KeyW") {
                rbMove[1] -= 10;
            } else
            if(e.code === "KeyS") {
                rbMove[1] += 10;
            } else
            if(e.code === "KeyA") {
                rbMove[0] -= 10;
            } else
            if(e.code === "KeyD") {
                rbMove[0] += 10;
            }
        }

        continuousRect(rbPos, rbSize, rbMove, staticPos, staticSize);
        // continuousRect(rbPos, rbSize, rbMove, [200,200], [10, 300]);
        // continuousRect(rbPos, rbSize, rbMove, [200,200], [300, 10]);
        // continuousRect(rbPos, rbSize, rbMove, [490,200], [10, 300]);
        // continuousRect(rbPos, rbSize, rbMove, [200,490], [300, 10]);

        rbPos[0] += rbMove[0];
        rbPos[1] += rbMove[1];

        rbMove[0] *= 0;
        rbMove[1] *= 0;
        
        ctx.strokeStyle = `rgba(${rigidbodyColor}, 255)`;
        ctx.strokeRect(...rbPos, ...rbSize);

        ctx.strokeStyle = `rgba(${staticColor}, 255)`;
        ctx.strokeRect(...staticPos, ...staticSize);
        // ctx.strokeRect(200, 200, 10, 300);
        // ctx.strokeRect(200, 200, 300, 10);
        // ctx.strokeRect(490, 200, 10, 300);
        // ctx.strokeRect(200, 490, 300, 10);

        // let res = lineRectIntersect(rbPos, rbMove, [200, 200], [300, 300]);

        // ctx.strokeStyle = `rgba(${rigidbodyColor}, 255)`;
        // ctx.beginPath();
        // ctx.lineTo(...rbPos);
        // ctx.lineTo(rbPos[0] + rbMove[0] * res, rbPos[1] + rbMove[1] * res);
        // ctx.closePath();
        // ctx.stroke();

        // ctx.strokeStyle = `rgba(${staticColor}, 255)`;
        // ctx.strokeRect(200, 200, 300, 300);

        requestAnimationFrame(main);
    }
    // setInterval(main, 50);
    requestAnimationFrame(main);
})();
