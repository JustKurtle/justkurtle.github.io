const Container = {
    create() {
        let entities = [];
        let systems = [];

        return {
            addSystem(system) {
                systems.unshift(system);
            },
            addEntity(entity) {
                entities.push(entity);
            },

            runSystems(dt = 1) {
                // run through the systems
                let sysIter = systems.length;
                while(sysIter--) {
                    let system = systems[sysIter];

                    // run through the entities
                    let entIter = entities.length;
                    while(entIter--) {
                        let entity = entities[entIter];

                        // run the system on the entity
                        system(entity, dt);
                    }
                }
            }
        };
        return output;
    },
};

Object.freeze(Container);
export default Container;