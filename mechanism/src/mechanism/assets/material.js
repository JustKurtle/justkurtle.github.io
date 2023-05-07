function create() {
    let properties = {}; 
    
    return {
        properties,

    };
}

function setProperty(target, property) {
    target.properties[property.name];
    return target;
}

export default {
    create,
};