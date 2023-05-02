function create() {
    let render_objects = MappedArray.create();
    let properties = {};
    
    return {
        setProperties(in_properties) {
            Object.assign(properties, in_properties);
            return this;
        },
        setClearColor(gl, color) {
            gl.clearColor(...color);
            return this;
        },

        addObject(object) {
            return render_objects.add(object);
        },
        removeObject(objectID) {
            render_objects.remove(objectID);
        },

        addInstance(objectID, data) {
            let object = render_objects.get(objectID);
            object.instance_updated = true;
            return object.instance_data.add(data);
        },
        removeInstance(objectID, instanceID) {
            let object = render_objects.get(objectID);
            object.instance_updated = true;
            object.instance_data.remove(instanceID);
        },
        updateInstance(objectID, instanceID, data) {
            let object = render_objects.get(objectID);
            object.instance_updated = true;
            object.instance_data.set(instanceID, data);
        },

        render(gl) {
            let objects = render_objects.get_values();
            let objectIter = objects.length;
            while(objectIter--) {
                let render_object = objects[objectIter];
                render_object.draw(gl, properties);
            }
        }
    }
}
const Scene = {
    create
};
Object.freeze(Scene);
export default Scene;