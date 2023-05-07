function create() {
    const assets = {};

    return {
        assets
    };
}

async function loadFromFiles(target, paths) {
    let i = paths.length;
    while(i--) {
        let [title, extension] = paths[i].split(".");

        switch(extension) {
            case "png":
            case "jpeg":
                let img = new Image();
                img.path = paths[i];
                target.assets[title + "_image"] = img;
                break;
        }
    }
}

async function loadFromObjects(target, objects) {
    let assetsNames = Object.keys(objects);
    
    let i = assetsNames.length;
    while(i--) {
        let [title, type] = assetsNames[i].replace(".", "_");
        
        if(!target.assets[title]) target.assets[title] = {};
        target.assets[title][type] = objects[assetsNames[i]];
    }
}

export default {
    create,
    loadFromFiles,
    loadFromObjects,
};
