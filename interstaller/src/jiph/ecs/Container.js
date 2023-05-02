const Container = {
    create() {
        let obj = {
            "entities": [],
            "systems": [],
        };
        return obj;
    },

    addSystem(target, system) {
        target.systems.unshift(system);
    },

    addEntity(target, entity) {
        target.entities.push(entity);
    },

    runSystems(target, dt = 1) {
        let sysIter = target.systems.length;
        // run through the systems
        while(sysIter--) {
            let system = target.systems[sysIter];
            // run through the entities
            let entIter = target.entities.length;
            while(entIter--) {
                let entity = target.entities[entIter];
                // run the system on the entity
                system(entity, dt);
            }
        }
    }
};
Object.freeze(Container);
export default Container;