class GameAnimation {
    time = 0;
    frame_index = 0; 

    constructor({keyframes = [], behavior = "linear", loop = true}) {
        this.behavior = behavior;
        this.keyframes = keyframes;

        this.loop = loop;
        this.play = true;
    }

    step(dt, object) {
        let next_time = this.time;
        
        let c_frame = this.keyframes[this.frame_index];
        let n_frame = this.keyframes[this.frame_index + 1];
        
        if(this.play) {
            while(!n_frame || n_frame.time < this.time + dt) {
                this.frame_index = (this.frame_index + 1) % (this.keyframes.length - 1);
                
                c_frame = this.keyframes[this.frame_index];
                n_frame = this.keyframes[this.frame_index + 1];
                
                next_time -= this.time - c_frame.time;
                this.time = c_frame.time;
                
                this.play = this.play && (this.loop || this.frame_index !== 0);
            }
            next_time += dt;
        }

        let c_time = 1 - ((c_frame.time - this.time) / (n_frame.time - c_frame.time));
        let n_time = 1 - c_time;
        
        if(this.behavior == "linear") {
            object[0] += c_frame.position[0] * c_time + n_frame.position[0] * n_time;
            object[1] += c_frame.position[1] * c_time + n_frame.position[1] * n_time;
            
            object[2] *= c_frame.scale[0] * c_time + n_frame.scale[0] * n_time;
            object[3] *= c_frame.scale[1] * c_time + n_frame.scale[1] * n_time;
        }

        this.time = next_time;
    }
}
export default GameAnimation;