// todo
const Animation = {
    create(duration, frames) {
        let ouput = {
            progress: 0, // how far into the animation you are between 0 and duration
            duration: duration,
            frames: frames,
        };
        return ouput;
    },

    step(animation, stepSize) {
        animation.progress = (animation.progress + stepSize) % animation.duration;
    },
    run(animation, stepSize) {
        ;
    }
}

Object.freeze(Animation);
export default Animation;