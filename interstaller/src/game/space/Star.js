import Components from "../Components.js"

const Star = {
    create() {
        let transform = Components.transform();
        let rigidBody = Components.rigidBody();
        let renderData = {
            "objectID": 0,
            "instanceID": 0,
            "data": [
                1.0,0.0,0.0,0.0,
                0.0,1.0,0.0,0.0,
                0.0,0.0,1.0,0.0,
                0.0,0.0,0.0,1.0,
                // color
                0.7 + Math.random() * 0.2,
                0.6 + Math.random() * 0.2,
                0.7 + Math.random() * 0.2,
                1.0,
                // glow
                2.7
            ]
        };
                
        let pos = [
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5,
        ];
        let len = Math.hypot(...pos) / (Math.random() * 50000) ** 0.7;
        transform.position[0] = pos[0] / len;
        transform.position[1] = pos[1] / len / 5;
        transform.position[2] = pos[2] / len;

        let scale = 1 - Math.log(Math.random() + 0.001);
        transform.scale[0] = scale;
        transform.scale[1] = scale;
        transform.scale[2] = scale;

        rigidBody.angularVelocity[0] = Math.random();
        rigidBody.angularVelocity[1] = Math.random();
        rigidBody.angularVelocity[2] = Math.random();

        return {
            transform,
            rigidBody,
            renderData
        };
    },
};
Object.freeze(Star);
export default Star;