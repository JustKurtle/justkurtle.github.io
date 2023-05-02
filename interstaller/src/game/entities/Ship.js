const Ship = {
    create() {
        let obj = {
            "transform": Components.transform(),
            "rigidBody": Components.rigidBody(),
            "boxCollider": Components.boxCollider(),
            
            "entityController": Components.entityController(),
            "shipBehavior": {
                "engine_active": false,
                "engine_damaged": false,
                
            },
        };
        return obj;
    },

    shipBehavior({ entityController, shipBehavior, shipParts }, dt) {
        
    }


};
Object.freeze(Ship);
export default Ship;        