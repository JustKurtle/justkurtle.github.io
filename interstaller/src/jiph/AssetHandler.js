const AssetHandler = {
    async loadFromFiles(destination, gl, paths) {
        // load the meats and potatos
        let iterator = paths.length;
        while(iterator--) {
            const path = "assets/" + paths[iterator];
            const [assetName, fileExtension] = 
                path.slice(path.lastIndexOf("/") - path.length + 1).split(".");

            if(!destination[assetName]) destination[assetName] = {};
            
            switch(fileExtension) {
                case "hlsl":
                    await fetch(path)
                        .then(response => response.text())
                        .then(data => jShader(gl, data.split("#FILE_SPLIT")))
                        .then(shader => destination[assetName].shader = shader);
                    break;
                // pictures / textures
                case "png":
                case "jpeg":
                    destination[assetName].texture = jTexture(gl, path);
                    break;
                // models
                case "json":
                    await fetch(path)
                        .then(response => response.json())
                        .then(data => destination[assetName].model = data);
                    break;
            }
        }
        return destination;
    },

    async loadFromObjects(destination, gl, assets) {
        let assetKeys = Object.keys(assets);
        let iterator = assetKeys.length;
        while(iterator--) {
            const [name, property] = assetKeys[iterator].split(".");
            if(!destination[name]) destination[name] = {};
            
            destination[name][property] = assets[assetKeys[iterator]];
        }
        return destination;
    },
};
Object.freeze(AssetHandler);
export default AssetHandler;