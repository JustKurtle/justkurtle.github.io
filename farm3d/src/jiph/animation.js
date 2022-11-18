// todo
function Animation(nodes = [], behavior = () => {}) {
    let animation = {
        scrub: 0, // how far into the animation you arebetween 0 and 1

        run(dt = 1) {
            behavior(dt);
        }
    };
    return animation;
}