import { buildShader, buildTexture } from "../rendering/ShaderTools.js";

class AssetHandler {
    assets;

    constructor() {
        this.assets = {};
    }

    async loadFromFiles(gl, paths) {
        // extend assets list
        let promises = new Array(paths.length);
        // load the meats and potatos
        let iterator = paths.length;
        while(iterator--) {
            const path = paths[iterator];
            const [assetName, fileExtension] = path.slice(path.lastIndexOf("/") - path.length + 1).split(".");
            this.assets[assetName] = this.assets[assetName] ? this.assets[assetName] : {};

            switch(fileExtension) {
                case "hlsl":
                    promises[iterator] = fetch(path)
                        .then(response => response.text())
                        .then(data => this.assets[assetName].shader = buildShader(gl, data.split("#FILE_SPLIT")));
                    break;
                // pictures / textures
                case "png":
                case "jpeg":
                    let img = new Image();
                    Image.onload = _ => this.assets[assetName].texture = buildTexture(gl, img);
                    break;
                // models
                case "gltf":
                    promises[iterator] = fetch(path)
                        .then(response => response.json())
                        .then(data => this.assets[assetName].model = data);
                    console.log(promises[iterator]);
                    break;
                case "json":
                    promises[iterator] = fetch(path)
                        .then(response => response.json())
                        .then(data => this.assets[assetName].model = {
                                aVertexPosition: new BufferObject(gl, {
                                    array: data.vertexArray
                                }),
                                aTextureCoord: new BufferObject(gl, { 
                                    array: data.texCoordArray
                                }),
                                index: new BufferObject(gl, {
                                    array: data.indexArray,
                                    target: gl.ELEMENT_ARRAY_BUFFER,
                                    length: data.indexArray.length
                                }),
                            });
                    break;
                default:
                    console.error("Unknown file type");
            }
        }
        await Promise.all(promises);
    }

    // todo: build shaders and load textures here instead of just piling data in
    async loadFromObjects(gl, objects) {
        for(let [key, value] of Object.entries(objects)) {
            const [assetName, assetType] = key.split(".");
            if(!this.assets[assetName]) this.assets[assetName] = {};
            switch(assetType) {
                case "shader":
                    this.assets[assetName].shader = buildShader(gl, value);
                    break;
                case "sprite":
                case "texture":
                    this.assets[assetName].texture = buildTexture(gl, value);
                    break;
                case "model":
                    this.assets[assetName].model = {
                        aVertexPosition: new BufferObject(gl, {
                            array: value.vertexArray
                        }),
                        aTextureCoord: new BufferObject(gl, { 
                            array: value.texCoordArray
                        }),
                        index: new BufferObject(gl, {
                            array: value.indexArray,
                            target: gl.ELEMENT_ARRAY_BUFFER,
                            length: value.indexArray.length
                        }),
                    }
                    break;
                default:
                    console.error("Unknown asset type");
            }
        }
    }
}
export default AssetHandler;
