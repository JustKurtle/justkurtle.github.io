const Container = {
    create() {
        return {
            "entities": [],
            "systems": [],

            "superSystems": [],
            "cullSystem": () => true
        };
    },

    addEntity(container, entity) {
        container.entities.push(entity);
        return container.entities.length - 1;
    },
    
    addSystem(container, system) {
        container.systems.unshift(system);
    },
    addSuperSystem(container, system) {
        container.superSystems.unshift(system);
    },
    setCullSystem(container, system) {
        container.cullSystem = system;
    },

    runSystems(container, dt = 1) {
        // loop systems

        let sSysIter = container.superSystems.length;
        while(sSysIter--)
            container.superSystems[sSysIter](container, dt);

        let sysIter = container.systems.length;
        while(sysIter--) {
            let system = container.systems[sysIter];
            // loop entities
            let entIter = container.entities.length;
            while(entIter--) {
                let entity = container.entities[entIter];

                if(!container.cullSystem(entity)) continue; // todo: improveate

                // run system on entity with delta-time
                system(entity, dt);
            }
        }
    },
};

Object.freeze(Container);
export default Container;